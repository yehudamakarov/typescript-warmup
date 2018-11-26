// TODO must delegate date control to chumash scraper
// TODO responsible for looping through a given amount of time
// TODO needs to do some checks before inserting to the db
import { Model } from "mongoose";
import { mongoDbConfig } from "../config/mongoDbConfig";
import { IChumashDocument } from "../models/Chumash";
import { IRashiDocument } from "../models/Rashi";
import { ChumashScraper } from "./ChumashScraper";

export class ChitasScraper {
    private chumashScraper: ChumashScraper;
    private chumashModel: Model<IChumashDocument>;
    private RashiModel: Model<IRashiDocument>;
    constructor(ChumashModel: Model<IChumashDocument>, RashiModel: Model<IRashiDocument>) {
        this.chumashScraper = new ChumashScraper();
        mongoDbConfig();
        this.chumashModel = ChumashModel;
        this.RashiModel = RashiModel;
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
