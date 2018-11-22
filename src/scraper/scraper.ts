import * as $ from "cheerio";
import moment, { Moment } from "moment";
import rp from "request-promise";
import {
    IChumashSection,
    IRashiObject,
    IRashiSection,
    IRashisOnAPasuk,
    Pesukim,
    RashiToAPasuk,
    TodaysRashiContent,
} from "./scraperTypes";

// =============================================================================
// The Scraper
// =============================================================================
const subjectsForUrl = {
    chumash: "torahreading",
    tanya: "tanya",
    tehillim: "tehillim",
};

class ChumashScraper {
    readonly url: string;
    readonly learnOnDate: Date;
    readonly dayOfTheWeek: string;
    readonly aliyah: number;
    readonly mmddyyyy: string;

    public chumashDocument: IChumashSection | null;
    private amountOfPesukim: number | null;
    // TODO refactor the rashi loops
    // public rashiDocument: IRashiSection;

    constructor(dayToFetch: Moment = moment()) {
        this.learnOnDate = new Date(dayToFetch.year(), dayToFetch.month(), dayToFetch.date());
        this.dayOfTheWeek = dayToFetch.format("dddd");
        this.aliyah = dayToFetch.day() + 1;
        this.mmddyyyy = dayToFetch.format("MM/DD/YYYY");
        this.url = `https://www.chabad.org/dailystudy/${subjectsForUrl.chumash}.asp?tdate=${this.mmddyyyy}`;
        this.amountOfPesukim = null;
        this.chumashDocument = null;
    }

    public getContent(): Promise<IChumashSection> {
        return new Promise((resolve, reject) => {
            this.fetchContent().then((html) => {
                const doc = $.load(html);
                this.parseHtml(doc);
                if (this.chumashDocument === null) {
                    reject("There was a problem parsing this Html...");
                } else {
                    resolve(this.chumashDocument);

                }
            });
        });
    }

    private fetchContent(): rp.RequestPromise {
        return rp(this.url);
    }

    private parseForParshaNameEnglish(doc: CheerioStatic): string {
        const parshaNameParts = doc(".article-header__subtitle")[0].childNodes[0].nodeValue.split(" ");
        parshaNameParts.shift();
        const parshaNameEnglish = parshaNameParts.join("").trim();
        return parshaNameEnglish;
    }

    private parseForPesukimUtility(hebrewOrEnglish: string, doc: CheerioStatic): Pesukim {
        // TODO only write the for-loop once using arguments.
        const pesukimRows = doc(".Co_Verse");
        this.amountOfPesukim = pesukimRows.length;

        switch (hebrewOrEnglish) {
            case "hebrew":
                const hebrewTdNodes = doc(".Co_Verse td:nth-child(3)");
                const hebrewPesukim: Pesukim = [];
                for (let i = 0; i < this.amountOfPesukim; i++) {
                    const eitherPasukOrRashi = pesukimRows[i];
                    if (eitherPasukOrRashi.attribs.class.match(/Verse/)) {
                        hebrewPesukim.push({
                            pasukNumber: hebrewTdNodes[i].childNodes[0].childNodes[0].nodeValue,
                            pasukWords: hebrewTdNodes[i].childNodes[1].childNodes[0].nodeValue,
                        });
                    }
                }
                return hebrewPesukim;
            case "english":
                const englishTdNodes = doc(".Co_Verse td:nth-child(1)");
                const englishPesukim: Pesukim = [];
                for (let i = 0; i < this.amountOfPesukim; i++) {
                    const eitherPasukOrRashi = pesukimRows[i];
                    if (eitherPasukOrRashi.attribs.class.match(/Verse/)) {
                        englishPesukim.push({
                            pasukNumber: englishTdNodes[i].childNodes[1].childNodes[0].nodeValue,
                            pasukWords: englishTdNodes[i].childNodes[2].childNodes[0].nodeValue,
                        });
                    }
                }
                return englishPesukim;
            default:
                throw new Error("Please specify 'hebrew' or 'english'");
        }
    }

    private parseForHebrewPesukim(doc: CheerioStatic): Pesukim {
        const hebrewPesukim = this.parseForPesukimUtility("hebrew", doc);
        return hebrewPesukim;
    }

    private parseForEnglishPesukim(doc: CheerioStatic): Pesukim {
        const englishPesukim = this.parseForPesukimUtility("english", doc);
        return englishPesukim;
    }

    //  TODO Make sure these get written
    // private parseForHebrewRashiContent(doc: CheerioStatic): TodaysRashiContent {

    // }

    // private parseForEnglishRashiContent(doc: CheerioStatic): TodaysRashiContent {

    // }

    private parseHtml(doc: CheerioStatic): void {
        const parshaNameEnglish = this.parseForParshaNameEnglish(doc);
        const hebrewPesukim: Pesukim = this.parseForHebrewPesukim(doc);
        const englishPesukim: Pesukim = this.parseForEnglishPesukim(doc);

        const allTrPasukAndRashi = doc("tr[class*='Co']");

        const todaysHebrewRashiContent: TodaysRashiContent = [];
        const todaysEnglishRashiContent: TodaysRashiContent = [];

        // TODO finish refactoring from here.
        let howManyRashisCounter = 0;

        for (let i = 1; i <= allTrPasukAndRashi.length; i++) {
            const eitherPasukOrRashi = allTrPasukAndRashi[i - 1];
            if (eitherPasukOrRashi.attribs.class.match(/Rashi/)
                && allTrPasukAndRashi[i - 2].attribs.class.match(/Verse/)) {
                const hebrewRashisOnPasuk: RashiToAPasuk = [];
                const englishRashisOnPasuk: RashiToAPasuk = [];

                const pasukElement = allTrPasukAndRashi[i - 2];
                const hebrewPasukNumber = pasukElement.childNodes[5].childNodes[0].childNodes[0].nodeValue;
                const englishPasukNumber = pasukElement.childNodes[1].childNodes[1].childNodes[0].nodeValue;

                let counter = 0;
                do {
                    const currentHebrewRashi = allTrPasukAndRashi[i - 1 + counter].childNodes[5];
                    const currentEnglishRashi = allTrPasukAndRashi[i - 1 + counter].childNodes[1];

                    const individualHebrewRashi: IRashiObject = {
                        belongsToPasuk: hebrewPasukNumber,
                        diburHamaschil: currentHebrewRashi.childNodes[0].childNodes[0].childNodes[0].nodeValue,
                        rashiWords: currentHebrewRashi.childNodes[0].childNodes[1].childNodes[0].nodeValue,
                    };
                    const individualEnglishRashi: IRashiObject = {
                        belongsToPasuk: englishPasukNumber,
                        diburHamaschil: currentEnglishRashi.childNodes[0].childNodes[0].childNodes[0].nodeValue,
                        rashiWords: currentEnglishRashi.childNodes[0].childNodes[1].childNodes[0].nodeValue,
                    };

                    hebrewRashisOnPasuk.push(individualHebrewRashi);
                    englishRashisOnPasuk.push(individualEnglishRashi);
                    howManyRashisCounter++;
                    counter++;
                } while (allTrPasukAndRashi[i - 1 + counter]
                    && !allTrPasukAndRashi[i - 1 + counter].attribs.class.match(/Verse/));

                const hebrewRashisOnThisPasuk: IRashisOnAPasuk = {
                    rashisForThisPasuk: hebrewRashisOnPasuk,
                    thatBelongToPasuk: hebrewPasukNumber,
                };
                const englishRashisOnThisPasuk: IRashisOnAPasuk = {
                    rashisForThisPasuk: englishRashisOnPasuk,
                    thatBelongToPasuk: hebrewPasukNumber,
                };
                todaysHebrewRashiContent.push(hebrewRashisOnThisPasuk);
                todaysEnglishRashiContent.push(hebrewRashisOnThisPasuk);
            } else {
                if (eitherPasukOrRashi.attribs.class.match(/Verse/)
                    && !allTrPasukAndRashi[i].attribs.class.match(/Rashi/)) {
                    const hebrewPasukNumber = eitherPasukOrRashi.childNodes[5].childNodes[0].childNodes[0].nodeValue;
                    const englishPasukNumber = eitherPasukOrRashi.childNodes[1].childNodes[1].childNodes[0].nodeValue;
                    const hebrewRashisOnThisPasuk: IRashisOnAPasuk = {
                        rashisForThisPasuk: [],
                        thatBelongToPasuk: hebrewPasukNumber,
                    };
                    const englishRashisOnThisPasuk: IRashisOnAPasuk = {
                        rashisForThisPasuk: [],
                        thatBelongToPasuk: hebrewPasukNumber,
                    };
                    todaysHebrewRashiContent.push(hebrewRashisOnThisPasuk);
                    todaysEnglishRashiContent.push(englishRashisOnThisPasuk);
                }
            }
        }
        // =========================================================================
        // Make daily Rashi Document
        // =========================================================================
        const rashiDocument: IRashiSection = {
            aliyah: this.aliyah,
            amountOfRashis: howManyRashisCounter,
            learnOnDate: this.learnOnDate,
            mmddyyyy: this.mmddyyyy,
            todaysEnglishRashiContent,
            todaysHebrewRashiContent,
        };
        // =========================================================================
        // Make Daily Chumash Document
        // =========================================================================
        const chumashDocument: IChumashSection = {
            aliyah: this.aliyah,
            amountOfPesukim: this.amountOfPesukim,
            dayOfTheWeek: this.dayOfTheWeek,
            englishPesukim,
            hebrewPesukim,
            learnOnDate: this.learnOnDate,
            mmddyyyy: this.mmddyyyy,
            parshaNameEnglish,
            rashiDocument,
        };
    }
}
