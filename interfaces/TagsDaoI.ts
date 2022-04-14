import Tags from "../models/tags/Tags";
import mongoose from "mongoose";

/**
 * @file Declares API for tags related data access object methods
 */
export default interface TagsDaoI {
    findAllTags (): Promise<Tags[]>;
    findTrendingTags (uid: string): Promise<Tags[]>;
    createNewTag ( tag: Tags): Promise<Tags>;
    updateTagStats (tagID: mongoose.Schema.Types.ObjectId): Promise<any>;
    deleteTag (tag: string): Promise<any>;
};