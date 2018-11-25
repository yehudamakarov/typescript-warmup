import mongoose from "mongoose";
import { ChumashSchema } from "../models/Chumash";
import RashiSchema from "../models/Rashi";

export default () => {
    mongoose.model("Chumash", ChumashSchema);
    mongoose.model("Rashi", RashiSchema);
};
