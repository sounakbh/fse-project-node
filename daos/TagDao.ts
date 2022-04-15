/**
 * @file Implements DAO managing data storage of tags. Uses mongoose TagModel
 * to integrate with MongoDB
 */
import TagDaoI from "../interfaces/TagDaoI";
import TagModel from "../mongoose/tags/TagModel";
import Tag from "../models/tags/Tag";

/**
 * @class TagDao Implements Data Access Object managing data storage
 * of Users
 * @property {TagDao} TagDao Private single instance of UserDao
 */
export default class TagDao implements TagDaoI {
    private static tagDao: TagDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns UserDao
     */
    public static getInstance = (): TagDao => {
        if (TagDao.tagDao === null) {
            TagDao.tagDao = new TagDao();
        }
        return TagDao.tagDao;
    }
    private constructor() {
    }


    /**
     * Uses TagModel to retrieve all Tag documents from Tags collection
     * @returns Promise To be notified when the Tags are retrieved from
     * database
     */
    findAllTags = async (): Promise<Tag[]> =>
        TagModel.find().exec();

    /**
     * Inserts tag instance into the database
     * @param {Tag} tags Instance to be inserted into the database
     * @returns Promise To be notified when a new tag is inserted into the database
     */
    createNewTag = async (tag: Tag): Promise<Tag> =>
        TagModel.create(tag);

    /**
     * Update the frequency of a particular tag in the database using TagModel
     * @param tagId the ID of the tag for which the frequency has to be increased
     * @param newFrequency the updated frequency
     * @returns Promise to be notified when the update is successful.
     */
    updateTagStats = async (tagId: string, newFrequency: number): Promise<any> =>
        TagModel.updateOne(
            {_id: tagId},
            {$set: {frequency: newFrequency}}
        );

    /**
     * Finds the Top 'n' trending tags in the database using the TagModel
     * @param numTrending the top n tags that are required
     * @returns promise to be notified when the tags are retrieved from the database
     */
    findTrendingTags = async (numTrending: number): Promise<any> =>
        TagModel.find().sort({frequency: -1}).limit(numTrending)


    /**
     * Finds the tag details when the tag text is provided using the TagModel
     * @param tag the tag text details of which has to be retrieved
     * @returns promise to be notified when the tag is retrieved
     */
    findTagByName = async (tag: string): Promise<any> =>
        TagModel.findOne({tag: tag});

    /**
     * Delete a tag when a tagId is provided using the TagModel
     * @param tagId the ID of the tag that has to be deleted from the database
     * @returns promise to be notified after the delete operation
     */
    deleteTag = async (tagId: string): Promise<any> =>
        TagModel.deleteOne({_id: tagId});

    /**
     * Finds the tag object when the ID of the tag is provided using the TagModel
     * @param tagId the ID of the tag details of which has to be retrieved
     * @returns promise to be notified when the tag is retrieved
     */
    findTagById = async (tagId: string): Promise<any> =>
        TagModel.findById(tagId)
            .exec();

    /**
     * Finds the ID of the tag when the tag text is provided using the TagModel
     * @param tag the text of the tag ID of which is required
     * @returns the ID of the tag if a Tag with the given name is present
     */
    findTagIdByTagName = async (tag: string): Promise<any> =>
        TagModel.find({tag: tag}, "_id")

}