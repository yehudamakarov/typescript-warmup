
import moment from "moment";
import ora from "ora";
import vorpalApp, { Args } from "vorpal";

import { ChumashMongooseModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";

const commandLineApplication = new vorpalApp();

const spinner = ora("Initializing Chitas Scraper...");
spinner.color = "magenta";

commandLineApplication.command(
    "scrape chumash <amount>",
    "grab a specified amount of days and store them in the mongoDb instance.",
)
    .help((args) => {
        spinner.text = "Provide a number of days to scrape and populate in the DB.";
    })
    .action((args) => {
        return new Promise((resolve, reject) => {
            spinner.start("Making Scraper...");
            const scraper = new ChitasScraper(args.amount, ChumashMongooseModel, RashiModel);
            scraper.on("startedScraping", () => {
                spinner.text = `Started scrape at ${moment().format("LTS")}`.padStart(30);
            });
            scraper.on("succeededScraping", (learnOnDate: Date) => {
                spinner.stopAndPersist({
                    symbol: "⏱",
                    text: `Started scrape at ${moment().format("LTS")}`.padStart(31, "."),
                });
                commandLineApplication.log("|");
                spinner.stopAndPersist({
                    symbol: "🔍",
                    text: `Scraped ${moment(learnOnDate).format("ll")}`.padStart(30, "."),
                })
                    .color = "yellow";
            });
            scraper.on("succeededSaving", (learnOnDate: Date) => {
                spinner.stopAndPersist({
                    symbol: "💿",
                    text: `Saved ${moment(learnOnDate).format("ll")}`.padStart(30, "."),
                });
                commandLineApplication.log("");
                spinner.start("Cooling down for 5 seconds...")
                    .color = "white";
            });
            scraper.on("doneScrapingEverything", () => {
                spinner.text = "Succeeded with scrape...";
                spinner.succeed();
            });
            scraper.on("scrapeError", (reason, failedDate) => {
                spinner.stopAndPersist({
                    symbol: `FAILED - ${moment(failedDate).format("ll")} due to:`,
                    text: reason,
                });
                commandLineApplication.log("");
                spinner.stopAndPersist({
                    symbol: "🔍",
                    text: `Now trying - ${moment(failedDate).add(1, "days").format("ll")}`,
                });
                commandLineApplication.log("");
                spinner.start("Trying the next date")
                    .color = "green";
            });
            // the below method will emit the events being listened for above.
            scraper.processChumash().then(() => {
                resolve();
            }).catch((errorStack) => {
                spinner.stopAndPersist({
                    symbol: "FAILED ALL: ",
                    text: `${errorStack}`,
                });
                spinner.fail(
                    `Oh no!`,
                );
                resolve();
            });
        });
    });

commandLineApplication.delimiter("Chitas Scraper $<<");

export { commandLineApplication };
