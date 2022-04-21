/**
 * @file Controller RESTful Web service API for tuits resource
 */
import TuitDao from "../daos/TuitDao";
import Tuit from "../models/tuits/Tuit";
import {Express, Request, Response} from "express";
import TuitControllerI from "../interfaces/TuitControllerI";
import TagDao from "../daos/TagDao";
import Tag from "../models/tags/Tag";
import {compileFunction} from "vm";
import {promises} from "dns";

/**
 * @class TuitController Implements RESTful Web service API for tuits resource.
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
 * @property {TuitController} tuitController Singleton controller implementing
 * RESTful Web service API
 */
export default class TuitController implements TuitControllerI {
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static tagDao: TagDao = TagDao.getInstance();
    private static tuitController: TuitController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): TuitController => {
        if(TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();
            app.get("/api/tuits", TuitController.tuitController.findAllTuits);
            app.get("/api/users/:uid/tuits", TuitController.tuitController.findAllTuitsByUser);
            app.get("/api/tuits/:uid", TuitController.tuitController.findTuitById);
            app.post("/api/users/:uid/tuits", TuitController.tuitController.createTuitByUser);
            app.put("/api/tuits/:uid", TuitController.tuitController.updateTuit);
            app.delete("/api/tuits/:uid", TuitController.tuitController.deleteTuit);
        }
        return TuitController.tuitController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuits = (req: Request, res: Response) =>
        TuitController.tuitDao.findAllTuits()
            .then((tuits: Tuit[]) => res.json(tuits));
    
    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the tuit that matches the user ID
     */
    findTuitById = (req: Request, res: Response) =>
        TuitController.tuitDao.findTuitById(req.params.uid)
            .then((tuit: Tuit) => res.json(tuit));

    /**
     * Retrieves all tuits from the database for a particular user and returns
     * an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects
     */
    findAllTuitsByUser = (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "my" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        if (userId === "my") {
            res.sendStatus(503);
            return;
        }
        TuitController.tuitDao.findAllTuitsByUser(userId)
            .then((tuits: Tuit[]) => res.json(tuits));
    }


    getTagIDsHelper = async(promises: any[], tags: any[]) =>{
        const tagIds: any[] = []
        const tagDao = TuitController.tagDao

        return Promise.all(promises).then((item) => {
                let i = 0;
                item.forEach(async tag => {
                    i += 1;
                    if(tag){
                        const frequency = tag.frequency + 1
                        tagIds.push(tag._id)
                        const updateTagStatus =  await tagDao.updateTagStats(tag._id, frequency);
                    } else{
                        const newTag = await tagDao.createNewTag(tags[i - 1])
                        const id = await tagDao.findTagIdByTagName(tags[i-1])
                        tagIds.push(id[0]._id)

                    }
                })
                console.log('Tag IDs from get tag ids helper:', tagIds);
                return tagIds;
            }
        );

    }
    /**
     * @param {Request} req Represents request from client, including body
     * containing the JSON object for the new tuit to be inserted in the
     * database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new tuit that was inserted in the
     * database
     */
    createTuitByUser = async (req: Request, res: Response) => {
        // @ts-ignore
        let userId = req.params.uid === "my" && req.session['profile'] ?
            // @ts-ignore
            req.session['profile']._id : req.params.uid;
        if (userId === "my") {
            res.sendStatus(503);
            return;
        }
        let tags = req.body.tags;
        const tagDao = TuitController.tagDao
        let tagIds: any[] = []

        for (let tag of tags) {
            const isTagPresent = await tagDao.findTagByName(tag);
            if(isTagPresent) {
                const frequency = isTagPresent.frequency + 1;
                await tagDao.updateTagStats(isTagPresent._id, frequency);
                tagIds.push(isTagPresent._id);
            }
            else {
                await tagDao.createNewTag(tag);
                const id = await tagDao.findTagIdByTagName(tag);
                tagIds.push(id[0]._id)
            }
        }
        req.body.tags = tagIds
        console.log(req.body)
        TuitController.tuitDao.createTuitByUser(userId, req.body)
            .then((tuit: Tuit) => res.json(tuit));
        return res.status(200);
    }

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be modified
     * @param {Response} res Represents response to client, including status
     * on whether updating a tuit was successful or not
     */
    updateTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.updateTuit(req.params.uid, req.body)
            .then((status) => res.send(status));

    /**
     * @param {Request} req Represents request from client, including path
     * parameter tid identifying the primary key of the tuit to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting a user was successful or not
     */
    deleteTuit = (req: Request, res: Response) =>
        TuitController.tuitDao.deleteTuit(req.params.uid)
            .then((status) => res.send(status));
};
