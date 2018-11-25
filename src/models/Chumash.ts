import { Document, Schema } from "mongoose";
import RashiSchema from "./Rashi";

export const ChumashSchema = new Schema({
    aliyah: Number,
    amountOfPesukim: Number,
    dayOfTheWeek: String,
    englishPesukim: [{
        pasukNumber: String,
        pasukWords: String,
    }],
    hebrewPesukim: [{
        pasukNumber: String,
        pasukWords: String,
    }],
    learnOnDate: Date,
    mmddyyyy: String,
    parshaNameEnglish: String,
    rashiDocument: RashiSchema,
});
