/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TagDaoI from "../interfaces/TagDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class TagDao implements TagDaoI{
    private static tagDao: TagDao | null = null;
    public static getInstance = (): TagDao => {
        if(TagDao.tagDao === null) {
            TagDao.tagDao = new TagDao();
        }
        return TagDao.tagDao;
    }
    private constructor() {}
}