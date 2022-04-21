/**
 * @file Controller RESTful Web service API for tuits resource
 */
import Tuit from "../models/tuits/Tuit";
import {Express, Request, Response} from "express";
import TagControllerI from "../interfaces/TagControllerI";
import TagDao from "../daos/TagDao";
import Tag from "../models/tags/Tag";

/**
 * @class TagController Implements RESTful Web service API for tuits resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid/tuits to create a new tuit instance for
 *     a given user</li>
 *     <li>GET /api/tuits to retrieve all the tuit instances</li>
 *     <li>GET /api/tuits/:tid to retrieve a particular tuit instances</li>
 *     <li>GET /api/users/:uid/tuits to retrieve tuits for a given user </li>
 *     <li>PUT /api/tuits/:tid to modify an individual tuit instance </li>
 *     <li>DELETE /api/tuits/:tid to remove a particular tuit instance</li>
 * </ul>
 * @property {TuitDao} tuitDao Singleton DAO implementing tuit CRUD operations
 * @property {TagController} tuitController Singleton controller implementing
 * RESTful Web service API
 */

export default class TagController implements TagControllerI {
    private static tagDao: TagDao = TagDao.getInstance();
    private static tagController: TagController | null = null;
    private static readonly NUM_TRENDING_TAGS = 3;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TagController
     */
    public static getInstance = (app: Express): TagController => {
        if(TagController.tagController === null) {
            TagController.tagController = new TagController();
            app.get("/api/tags", TagController.tagController.findAllTags);
            app.get("/api/tags/trending", TagController.tagController.findTrendingTags);
        }
        return TagController.tagController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTags = (req: Request, res: Response) => {
        console.log("Find all tags reached!")
          return TagController.tagDao.findAllTags()
                     .then((tags: Tag[]) => res.json(tags));
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findTrendingTags = (req: Request, res: Response) => {
        return TagController.tagDao. findTrendingTags(TagController.NUM_TRENDING_TAGS)
                     .then((tags: Tag[]) => res.json(tags));
    }

    /**
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createNewTag = (req: Request, res: Response) => {
        //  TagController.tagDao.createNewTag()
        //             .then((tags: Tag[]) => res.json(tags));
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTagStats = (req: Request, res: Response) => {
        // TagController.tagDao.updateTagStats(req.params.tagId, req.body)
        //             .then((status) => res.send(status));
    }

};
