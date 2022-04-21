/**
 * @file Define the mongoose schema for the
 * documents in the tags collection
 */

import mongoose from "mongoose";
import Tag from "../../models/tags/Tag";

const TagSchema = new mongoose.Schema<Tag>(
    {
        tag: {type: String, required: true},
        frequency: {type: Number, default: 1}
    },
    { collection: "tags" }
);
export default TagSchema;
