import moment from "moment";
import ora from "ora";
import { ChitasScraper } from "./ChitasScraper";

export const attachEventListeners = (scraper: ChitasScraper, oraSpinner: any, commandLineApplication: any) => {
    scraper.on("startedScraping", () => {
        oraSpinner.text = `Started scrape at ${moment().format("LTS")}`.padStart(30);
    });
    scraper.on("succeededScraping", (learnOnDate: Date) => {
        oraSpinner.stopAndPersist({
            symbol: "⏱",
            text: `Started scrape at ${moment().format("LTS")}`.padStart(31, "."),
        });
        commandLineApplication.log("|");
        oraSpinner.stopAndPersist({
            symbol: "🔍",
            text: `Scraped ${moment(learnOnDate).format("ll")}`.padStart(30, "."),
        })
            .color = "yellow";
    });
    scraper.on("succeededSaving", (learnOnDate: Date) => {
        oraSpinner.stopAndPersist({
            symbol: "💿",
            text: `Saved ${moment(learnOnDate).format("ll")}`.padStart(30, "."),
        });
        commandLineApplication.log("");
        oraSpinner.start("Cooling down for 5 seconds...")
            .color = "white";
    });
    scraper.on("doneScrapingEverything", () => {
        oraSpinner.text = "Succeeded with scrape...";
        oraSpinner.succeed();
    });
    scraper.on("scrapeError", (reason, failedDate) => {
        oraSpinner.stopAndPersist({
            symbol: `FAILED - ${moment(failedDate).format("ll")} due to:`,
            text: reason,
        });
        commandLineApplication.log("");
        oraSpinner.stopAndPersist({
            symbol: "🔍",
            text: `Now trying - ${moment(failedDate).add(1, "days").format("ll")}`,
        });
        commandLineApplication.log("");
        oraSpinner.start("Trying the next date")
            .color = "green";
    });
};
