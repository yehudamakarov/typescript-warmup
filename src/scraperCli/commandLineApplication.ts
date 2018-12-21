
import moment from "moment";
import ora from "ora";
import vorpalApp, { Args } from "vorpal";

import { mongoDbConfig } from "../config/mongoDbConfig";
import { ChumashMongooseModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";
import { attachEventListeners } from "./configFunctions";

mongoDbConfig();
const app = new vorpalApp();

const spinner = ora("Initializing Chitas Scraper...");
type Ora = typeof spinner;
spinner.color = "magenta";

app.command(
    "scrape chumash <amount>",
    "grab a specified amount of days and store them in the mongoDb instance.",
)
    .validate((args) => {
        if (typeof args.amount !== "number") {
            app.log("Please specify a number.");
            return "Type 'help' for help.";
        } else {
            return true;
        }
    })
    .action((args) => {
        return new Promise((resolve, reject) => {
            spinner.start("Making Scraper...");
            const scraper = new ChitasScraper(args.amount, ChumashMongooseModel, RashiModel);
            attachEventListeners(scraper, spinner, app);
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

app.command("delete chumash", "Delete all the Chumash records in the collection.").action((args) => {
    return new Promise((resolve, reject) => {
        spinner.start("Deleting all Chumash records...").color = "red";

        ChumashMongooseModel.deleteMany({}, (err) => {
            if (err) {
                spinner.fail("There was a problem during deletion.");
                app.log("");
                resolve();
            } else {
                spinner.succeed("Done.");
                app.log("");
                resolve();
            }
        });
    });
});

app.delimiter("Chitas Scraper $<<");

export { app as commandLineApplication };
