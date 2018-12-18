// TODO needs to do some checks before inserting to the db / reflect
// TODO confirmations and errors of checks in CLI
// TODO must handle all rejected promises errors

import { EventEmitter } from "events";
import moment = require("moment");
import { Model } from "mongoose";
import { mongoDbConfig } from "../config/mongoDbConfig";
import { IChumashDocument, IChumashObject } from "../models/Chumash";
import { IRashiDocument } from "../models/Rashi";
import { ChumashScraper } from "./ChumashScraper";

export class ChitasScraper extends EventEmitter {

    public amountOfDaysToScrape: number;
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

    // only resolves when all days are scraped
    // TODO continue the below pattern and try to push all logic to events as much as possible.
    public processChumash(): Promise<void> {
        const thisChitasScraper = this;
        return new Promise((resolve, reject) => {
            thisChitasScraper.getChumashUntilDone();
            thisChitasScraper.on("doneScrapingEverything", () => {
                resolve();
            });
            // thisChitasScraper.on("scrapeError", (reason) => {
            //     reject(`Check where a scrapeError was emitted to fix this issue. Here: ${reason}`);
            // });
            // thisChitasScraper.on("saveError", () => {
            //     reject("Check where a saveError was emitted to fix this issue.");
            // });
        });
    }

    private getChumashUntilDone() {
        if (this.amountOfDaysToScrape === 0) {
            this.emit("doneScrapingEverything");
            return;
        }
        this.emit("startedScraping");
        this.chumashScraper.getContent()
            .then(this.saveContent.bind(this))
            .then(this.wait5AndStartNextCall.bind(this))
            .catch(this.emitScrapeErrorAndStartAnotherCall.bind(this));
    }

    private emitScrapeErrorAndStartAnotherCall(errorReason: string): void {
        this.emit("scrapeError", errorReason, this.chumashScraper.learnOnDate);
        this.wait5AndStartNextCall(this.chumashScraper.learnOnDate);
    }

    private wait5AndStartNextCall(theDateJustScraped: Date): void {
        this.goToNextDay(theDateJustScraped);
        setTimeout(() => {
            this.getChumashUntilDone();
        }, 5000);
    }

    private goToNextDay(theDateJustScraped: Date) {
        const nextDate = moment(theDateJustScraped).add(1, "day");
        this.chumashScraper = new ChumashScraper(nextDate);
        this.amountOfDaysToScrape -= 1;
    }

    private saveContent(chumashContent: IChumashObject): Promise<Date> {
        const dateOfScrapedContent = chumashContent.learnOnDate;
        this.emit("succeededScraping", dateOfScrapedContent);

        const aChumashDocument = new this.chumashModel(chumashContent);
        return aChumashDocument.save()
            .then((chumashDocument: IChumashDocument) => {
                // tslint:disable-next-line:no-console
                // console.log(chumashDocument);
                this.emit("succeededSaving", chumashDocument.learnOnDate);
                return chumashDocument.learnOnDate;
            });

    }
}
