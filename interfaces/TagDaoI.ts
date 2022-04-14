import Tag from "../models/tags/Tag";
import mongoose from "mongoose";

/**
 * @file Declares API for tags related data access object methods
 */
export default interface TagDaoI {
    findAllTags (): Promise<Tag[]>;
    findTrendingTags (numTrending: number): Promise<Tag[]>;
    createNewTag ( tag: Tag): Promise<Tag>;
    updateTagStats (tagId: string, newFrequency: number): Promise<any>;
    deleteTag (tagId: string): Promise<any>;
    findTagByName (tag: string): Promise<any>;
    findTagById (tagId: string): Promise<any>;
    findTagIdByTagName (tag: string): Promise<any>;
};