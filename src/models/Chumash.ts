import mongoose, { Document, Model } from "mongoose";
import { IRashiDocument, IRashiObject, RashiSchema } from "./Rashi";

export interface IChumashObject {
    learnOnDate: Date;
    dayOfTheWeek: string;
    hebrewPesukim: Pesukim;
    englishPesukim: Pesukim;
    amountOfPesukim: number | null;
    rashiDocument: IRashiObject;
    aliyah: number;
    mmddyyyy: string;
    parshaNameEnglish: string;
}
interface IPasukObject {
    pasukNumber: string;
    pasukWords: string;
}
export type Pesukim = IPasukObject[];

export interface IChumashDocument extends Document {
    learnOnDate: Date;
    dayOfTheWeek: string;
    hebrewPesukim: Array<{
        pasukNumber: string;
        pasukWords: string;
    }>;
    englishPesukim: Array<{
        pasukNumber: string;
        pasukWords: string;
    }>;
    amountOfPesukim: number;
    rashiDocument: IRashiDocument;
    aliyah: number;
    mmddyyyy: string;
    parshaNameEnglish: string;
}

export const ChumashSchema = new mongoose.Schema({
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

export const ChumashMongooseModel: Model<IChumashDocument> = mongoose.model<IChumashDocument>("Chumash", ChumashSchema);
