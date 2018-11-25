import mongoose, { Document, Model } from "mongoose";

export interface ISingleRashi {
    belongsToPasuk: string;
    diburHamaschil: string;
    rashiWords: string;
}
export type RashiToAPasuk = ISingleRashi[];
export interface IRashisOnAPasuk {
    thatBelongToPasuk: string;
    rashisForThisPasuk: RashiToAPasuk;
}
export type TodaysRashiContent = IRashisOnAPasuk[];
export interface IRashiObject {
    learnOnDate: Date;
    todaysHebrewRashiContent: TodaysRashiContent;
    todaysEnglishRashiContent: TodaysRashiContent;
    amountOfRashis: number | null;
    aliyah: number;
    mmddyyyy: string;
}

export interface IRashiDocument extends Document {
    learnOnDate: Date;
    todaysHebrewRashiContent: Array<{
        thatBelongToPasuk: string;
        rashisForThisPasuk: Array<{
            belongsToPasuk: string;
            diburHamaschil: string;
            rashiWords: string;
        }>;
    }>;
    todaysEnglishRashiContent: Array<{
        thatBelongToPasuk: string;
        rashisForThisPasuk: Array<{
            belongsToPasuk: string;
            diburHamaschil: string;
            rashiWords: string;
        }>;
    }>;
    amountOfRashis: number;
    aliyah: number;
    mmddyyyy: string;
}

export const RashiSchema = new mongoose.Schema({
    aliyah: Number,
    amountOfRashis: Number,
    learnOnDate: Date,
    mmddyyyy: String,
    todaysEnglishRashiContent: [{
        rashisForThisPasuk: [{
            belongsToPasuk: String,
            diburHamaschil: String,
            rashiWords: String,
        }],
        thatBelongToPasuk: String,
    }],
    todaysHebrewRashiContent: [{
        rashisForThisPasuk: [{
            belongsToPasuk: String,
            diburHamaschil: String,
            rashiWords: String,
        }],
        thatBelongToPasuk: String,
    }],
});

export const RashiModel: Model<IRashiDocument> = mongoose.model<IRashiDocument>("Rashi", RashiSchema);
