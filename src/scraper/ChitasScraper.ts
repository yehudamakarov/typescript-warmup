// TODO must delegate date control to chumash scraper
// TODO responsible for looping through a given amount of time
// TODO needs to insert to the DB
// TODO needs to do some checks before inserting to the db
import mongoose from "mongoose";
import { mongoDbConfig } from "../config/mongoDbConfig";
import { ChumashScraper } from "./ChumashScraper";

class ChitasScraper {
    // todo Declare your models exactly once and use dependency injection; never declare them in a routes file.
    // https://www.mongodb.com/blog/post/the-mean-stack-mistakes-youre-probably-making
    private chumashScraper: ChumashScraper;
    // TODO get types for the model up and running
    // https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way
    private chumashModel: any;
    constructor() {
        this.chumashScraper = new ChumashScraper();
        mongoDbConfig();
        this.chumashModel = mongoose.model("Chumash");
    }
    /**
     * processChumash
     */
    public processChumash() {
        this.chumashScraper.getContent().then((chumashContent) => {
            const aChumashDocument = new this.chumashModel(chumashContent);
            aChumashDocument.save().then((success: any) => console.log(success));
        });
    }
}

const chitasScraper = new ChitasScraper();
chitasScraper.processChumash();
