import TagsDaoI from "../interfaces/TagsDaoI";
import TagModel from "../mongoose/tags/TagModel";
import Tags from "../models/tags/Tags";
import mongoose from "mongoose";

export default class TagsDao implements TagsDaoI {
    private static tagDao: TagsDao | null = null;
    public static getInstance = (): TagsDao => {
        if(TagsDao.tagDao === null) {
            TagsDao.tagDao = new TagsDao();
        }
        return TagsDao.tagDao;
    }
    private constructor() {}

    findAllTags = async (): Promise<Tags[]> =>
        TagModel.find().exec();

    /**
     * Inserts tag instance into the database
     * @param {Tags} tags Instance to be inserted into the database
     * @returns Promise To be notified when a new tag is inserted into the database
     */
    createNewTag = async (tag: Tags): Promise<Tags> =>
        // check if the tag is present, in which case update the re-tags count
        TagModel.create(tag);

    updateTagStats = async (tagID: mongoose.Schema.Types.ObjectId): Promise<any> =>
        TagModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        );

    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});
    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({tuit: tid, likedBy: uid});
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});
    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});
}