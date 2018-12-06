
import ora from "ora";
import vorpalApp, { Args } from "vorpal";

import { stringify } from "querystring";
import { ChumashMongooseModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";

const commandLineApplication = new vorpalApp();

const spinner = ora("Initializing Chitas Scraper...");
spinner.color = "white";

commandLineApplication.command(
    "scrape chumash <amount>",
    "grab a specified amount of days and store them in the mongoDb instance.",
)
    .help((args) => {
        commandLineApplication.log("Provide a number of days to scrape and populate in the DB.");
    })
    .action((args) => {
        return new Promise((resolve, reject) => {
            commandLineApplication.log("Making Scraper...");
            const scraper = new ChitasScraper(args.amount, ChumashMongooseModel, RashiModel);
            scraper.on("succeededScraping", (learnOnDate: Date) => {
                spinner.text =
                    `Successfully scraped content... **  ${learnOnDate} **`.padEnd(83, "--") +
                    `Finished chumashScraper.getContent() with a chumashDocument.`.padEnd(83, "--");
                spinner.color = "yellow";
                commandLineApplication.log(`Scraped ${learnOnDate}...`);
            });
            scraper.on("succeededSaving", (learnOnDate: Date) => {
                spinner.text = "Saved!".padEnd(83, "#=#");
                spinner.color = "green";
                commandLineApplication.log(`Saved ${learnOnDate}`);
            });
            // the below method will emit the events defined above.
            scraper.processChumash().then(() => {
                resolve();
            });
        });
    });

commandLineApplication.delimiter("Chitas Scraper $<<");

export { commandLineApplication };
