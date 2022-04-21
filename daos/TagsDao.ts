import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tags/TagModel";
import Tag from "../models/tags/Tag";

export default class TagsDao implements TagDaoI {
    private static tagDao: TagsDao | null = null;
    public static getInstance = (): TagsDao => {
        if(TagsDao.tagDao === null) {
            TagsDao.tagDao = new TagsDao();
        }
        return TagsDao.tagDao;
    }
    private constructor() {}

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


    updateTagStats = async (tagID: string, newFrequency: number): Promise<any> =>
        TagModel.updateOne(
            {_id: tagID},
            {$set: {frequency: newFrequency}}
        );


    findTrendingTags = async (numTrending: number): Promise<any> =>
        TagModel.find().sort({frequency: -1}).limit(numTrending)


    findTagByName = async (tag: string): Promise<any> =>
        TagModel.findOne({tag: tag});

    deleteTag = async (tag: string): Promise<any>

