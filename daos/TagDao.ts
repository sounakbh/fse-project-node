import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tags/TagModel";
import Tag from "../models/tags/Tag";


export default class TagDao implements TagDaoI {
    private static tagDao: TagDao | null = null;
    public static getInstance = (): TagDao => {
        if (TagDao.tagDao === null) {
            TagDao.tagDao = new TagDao();
        }
        return TagDao.tagDao;
    }

    private constructor() {
    }

    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find().exec();

    /**
     * Inserts tag instance into the database
     * @param {Tag} tags Instance to be inserted into the database
     * @returns Promise To be notified when a new tag is inserted into the database
     */
    createNewTag = async (tag: Tag): Promise<Tag> =>
        // check if the tag is present, in which case update the re-tags count
        TagModel.create(tag);


    updateTagStats = async (tagId: string, newFrequency: number): Promise<any> =>
        TagModel.updateOne(
            {_id: tagId},
            {$set: {frequency: newFrequency}}
        );


    findTrendingTags = async (numTrending: number): Promise<any> =>
        TagModel.find().sort({frequency: -1}).limit(numTrending)


    findTagByName = async (tag: string): Promise<any> =>
        TagModel.findOne({tag: tag});

    deleteTag = async (tagId: string): Promise<any> =>
        TagModel.deleteOne({_id: tagId});

    findTagById = async (tagId: string): Promise<any> =>
        TagModel.findById(tagId)
            .exec();

    findTagIdByTagName = async (tag: string): Promise<any> =>
        TagModel.find({tag: tag}, "_id")

}

