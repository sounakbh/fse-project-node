import mongoose, { Schema } from "mongoose";
import Tuit from "../../models/tuits/Tuit";
import TagModel from "../tags/TagModel";

const TuitSchema = new mongoose.Schema<Tuit>(
  {
    tuit: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
    postedOn: { type: Date, default: Date.now },
    image: String,
    youtube: String,
    avatarLogo: String,
    imageOverlay: String,
    stats: {
      replies: { type: Number, default: 0 },
      retuits: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
        },
      tags: {type: [mongoose.Schema.Types.ObjectId]}
  },
  { collection: "tuits" }
);
export default TuitSchema;
