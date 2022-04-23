import {Request, Response} from "express";

export default interface TagControllerI {
    findAllTags (req: Request, res: Response): void;
    findTrendingTags (req: Request, res: Response): void;
};