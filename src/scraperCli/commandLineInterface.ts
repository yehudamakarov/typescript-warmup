
import ora from "ora";
import vorpalApp, { Args } from "vorpal";

import { ChumashMongooseModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";

const commandLineApplication = new vorpalApp();

commandLineApplication.command(
    "scrape chumash <amount>",
    "grab a specified amount of days and store them in the mongoDb instance.",
)
    .help((args) => {
        commandLineApplication.log("Provide a number of days to scrape and populate in the DB.");
    })
    .action((args) => {
        return new Promise((resolve, reject) => {
            const scraper = new ChitasScraper(args.amount, ChumashMongooseModel, RashiModel);
            scraper.processChumash();
        });
    });

commandLineApplication.delimiter("Chitas Scraper $<<");

export { commandLineApplication };
