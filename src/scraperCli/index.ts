
import ora from "ora";
import vorpalApp, { Args } from "vorpal";
import { ChumashModel } from "../models/Chumash";
import { RashiModel } from "../models/Rashi";
import { ChitasScraper } from "./ChitasScraper";
const app = new vorpalApp();

const scraper = new ChitasScraper(ChumashModel, RashiModel);

app.command("scrape <amount>", "grab a specified amount of days and store them in the mongoDb instance.")
    .help((args) => {
        app.log("Provide a number of days to scrape and populate in the DB.");
    })
    .action((args) => {
        return new Promise((resolve, reject) => {
            app.log("working in promise...");
            app.log("This is args.amount: " + args.amount);
            const spinner = ora("scraping data...").start();
            setTimeout(() => {
                spinner.color = "blue";
                spinner.text = "Still scraping...";
            }, 1000);
            setTimeout(() => {
                spinner.color = "white";
            }, 2000);
            setTimeout(() => {
                spinner.color = "yellow";
                spinner.text = "still working!";
            }, 3000);
            setTimeout(() => {
                resolve();
                spinner.succeed();
                spinner.text = "Nice!";
            }, 4000);
        });
    });

app.delimiter("Chitas Scraper $<<")
    .show()
    .log("Welcome to Scraper");
