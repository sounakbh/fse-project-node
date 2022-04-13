import User from "../users/User";
import Stats from "./Stats";
import mongoose, {Schema} from "mongoose";

export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
    image?: String,
    youtube?: String,
    avatarLogo?: String,
    imageOverlay?: String,
    stats: Stats,
    tags: Array<mongoose.Schema.Types.ObjectId>
};