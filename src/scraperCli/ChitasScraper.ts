// TODO Event emitter responsible for looping through a given amount of time
// todo Event emitter should implement spinner - spinner needs to know about which iteration of loop
// TODO Event emitter needs to do some checks before inserting to the db
import { EventEmitter } from "events";
import moment = require("moment");
import { Model } from "mongoose";
import { mongoDbConfig } from "../config/mongoDbConfig";
import { IChumashDocument, IChumashObject } from "../models/Chumash";
import { IRashiDocument } from "../models/Rashi";
import { ChumashScraper } from "./ChumashScraper";

export class ChitasScraper extends EventEmitter {

    private amountOfDaysToScrape: number;
    private chumashScraper: ChumashScraper;
    private chumashModel: Model<IChumashDocument>;
    private RashiModel: Model<IRashiDocument>;
    constructor(
        amountOfDaysToScrape: number,
        ChumashModel: Model<IChumashDocument>,
        RashiModel: Model<IRashiDocument>,
    ) {
        super();
        this.amountOfDaysToScrape = amountOfDaysToScrape;
        this.chumashScraper = new ChumashScraper();
        mongoDbConfig();
        this.chumashModel = ChumashModel;
        this.RashiModel = RashiModel;
    }

    public processChumash() {
        do {
            this.chumashScraper.getContent()
                .then(this.saveContent)
                .then(this.goToNextDay);
        } while (this.amountOfDaysToScrape > 0);
    }

    private goToNextDay(theDateJustScraped: Date) {
        const nextDate = moment(theDateJustScraped).add(1, "day");
        this.chumashScraper = new ChumashScraper(nextDate);
        this.amountOfDaysToScrape -= 1;
    }

    private saveContent(chumashContent: IChumashObject) {
        const dateOfScrapedContent = chumashContent.learnOnDate;
        this.emit("succeededScraping", dateOfScrapedContent);

        const aChumashDocument = new this.chumashModel(chumashContent);
        return aChumashDocument.save()
            .then((chumashDocument: IChumashDocument) => {
                // tslint:disable-next-line:no-console
                console.log(chumashDocument);
                this.emit("succeededSaving", chumashDocument.learnOnDate);
                return chumashDocument.learnOnDate;
            });

    }
}
