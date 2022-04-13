import mongoose from "mongoose";
import Tags from "../../models/tags/Tags";

const TagSchema = new mongoose.Schema<Tags>(
    {
        tag: {type: String, required: true},
        retags: {type: Number, default: 0}
    },
    { collection: "tags" }
);
export default TagSchema;
