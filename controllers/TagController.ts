/**
 * @file Controller RESTful Web service API for tags resource
 */
import {Express, Request, Response} from "express";
import TagControllerI from "../interfaces/TagControllerI";
import TagDao from "../daos/TagDao";
import Tag from "../models/tags/Tag";

/**
 * @class TagController Implements RESTful Web service API for tags resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/tags to retrieve all the tag instances</li>
 *     <li>GET /api/tags/trending to retrieve top 3 recent tag instances</li>
 * </ul>
 * @property {TagDao} tagDao Singleton DAO implementing tag CRUD operations
 * @property {TagController} tagController Singleton controller implementing
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
     * Retrieves all tags from the database and returns an array of tags.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tag objects
     */
    findAllTags = (req: Request, res: Response) => {
        console.log("Find all tags reached!")
          return TagController.tagDao.findAllTags()
                     .then((tags: Tag[]) => res.json(tags));
    }

    /**
     * Retrieves the recent trending tag instances from the database and returns an array of tags.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tag objects
     */
    findTrendingTags = (req: Request, res: Response) => {
        return TagController.tagDao. findTrendingTags(TagController.NUM_TRENDING_TAGS)
                     .then((tags: Tag[]) => res.json(tags));
    }

};
