import { Schema } from "mongoose";

export default new Schema({
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
