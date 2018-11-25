// TODO must delegate date control to chumash scraper
// TODO responsible for looping through a given amount of time
// TODO needs to do some checks before inserting to the db
import mongoose, { Model } from "mongoose";
import { mongoDbConfig } from "../config/mongoDbConfig";
import { IChumashDocument } from "../models/Chumash";
import { ChumashScraper } from "./ChumashScraper";

export class ChitasScraper {
    private chumashScraper: ChumashScraper;
    private chumashModel: Model<IChumashDocument>;
    constructor(ChumashModel: Model<IChumashDocument>) {
        this.chumashScraper = new ChumashScraper();
        mongoDbConfig();
        this.chumashModel = ChumashModel;
    }
    /**
     * processChumash
     */
    public processChumash() {
        this.chumashScraper.getContent().then((chumashContent) => {
            const aChumashDocument = new this.chumashModel(chumashContent);
            aChumashDocument.save().then((chumashDocument: IChumashDocument) => {
                // tslint:disable-next-line:no-console
                console.log(chumashDocument);
            });
        });
    }
}
