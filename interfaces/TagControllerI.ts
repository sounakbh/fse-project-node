import {Request, Response} from "express";

export default interface TagControllerI {
    findAllTags (req: Request, res: Response): void;
    findTrendingTags (req: Request, res: Response): void;
    updateTagStats (req: Request, res: Response): void;
    createNewTag (req: Request, res: Response): void;
};