import { Mongoose } from "mongoose";
import ChumashSchema from "../models/Chumash";

export default (mongoose: Mongoose) => {
    mongoose.model("Chumash", ChumashSchema);
};
