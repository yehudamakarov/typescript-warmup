import * as $ from "cheerio";
import moment, { Moment } from "moment";
import rp, { RequestPromise } from "request-promise";
import { IChumashObject, Pesukim } from "../models/Chumash";
import { IRashiObject, IRashisOnAPasuk, ISingleRashi, RashiToAPasuk, TodaysRashiContent } from "../models/Rashi";
const subjectsForUrl = {
    chumash: "torahreading",
    tanya: "tanya",
    tehillim: "tehillim",
};
export class ChumashScraper {
    public chumashDocument: IChumashObject | null;

    private readonly urlToScrapeFrom: string;
    private readonly learnOnDate: Date;
    private readonly dayOfTheWeek: string;
    private readonly aliyah: number;
    private readonly mmddyyyy: string;
    private amountOfPesukim: number | null;
    private amountOfRashis: number | null;

    constructor(dayToFetch: Moment = moment()) {
        this.learnOnDate = new Date(dayToFetch.year(), dayToFetch.month(), dayToFetch.date());
        this.dayOfTheWeek = dayToFetch.format("dddd");
        this.aliyah = dayToFetch.day() + 1;
        this.mmddyyyy = dayToFetch.format("MM/DD/YYYY");
        this.urlToScrapeFrom = `https://www.chabad.org/dailystudy/${subjectsForUrl.chumash}.asp?tdate=${this.mmddyyyy}`;
        this.amountOfPesukim = null;
        this.chumashDocument = null;
        this.amountOfRashis = null;
    }
    public getContent(): Promise<IChumashObject> {
        const thisChumashScraper = this;
        return new Promise((resolve, reject) => {
            thisChumashScraper.fetchContent().then((html) => {
                const doc = $.load(html);
                thisChumashScraper.chumashDocument = thisChumashScraper.parseHtml(doc);
                if (thisChumashScraper.chumashDocument === null) {
                    reject("There was a problem parsing this Html...");
                } else {
                    resolve(thisChumashScraper.chumashDocument);
                }
            });
        });
    }
    private fetchContent(): RequestPromise {
        return rp(this.urlToScrapeFrom);
    }
    private parseForParshaNameEnglish(doc: CheerioStatic): string {
        const parshaNameParts = doc(".article-header__subtitle")[0].childNodes[0].nodeValue.split(" ");
        parshaNameParts.shift();
        const parshaNameEnglish = parshaNameParts.join("").trim();
        return parshaNameEnglish;
    }
    private parseForPesukimUtility(hebrewOrEnglish: string, doc: CheerioStatic): Pesukim {
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
    private parseForHebrewRaahis(doc: CheerioStatic): TodaysRashiContent {
        const todaysHebrewRashiContent: TodaysRashiContent = [];
        const allTrPasukAndRashi = doc("tr[class*='Co']");
        let howManyRashisCounter = 0;
        for (let i = 1; i <= allTrPasukAndRashi.length; i++) {
            const eitherPasukOrRashi = allTrPasukAndRashi[i - 1];
            if (eitherPasukOrRashi.attribs.class.match(/Rashi/)
                && allTrPasukAndRashi[i - 2].attribs.class.match(/Verse/)) {
                const hebrewRashisOnPasuk: RashiToAPasuk = [];
                const pasukElement = allTrPasukAndRashi[i - 2];
                const hebrewPasukNumber = pasukElement.childNodes[5].childNodes[0].childNodes[0].nodeValue;
                let counter = 0;
                do {
                    const currentHebrewRashi = allTrPasukAndRashi[i - 1 + counter].childNodes[5];
                    const individualHebrewRashi: ISingleRashi = {
                        belongsToPasuk: hebrewPasukNumber,
                        diburHamaschil: currentHebrewRashi.childNodes[0].childNodes[0].childNodes[0].nodeValue,
                        rashiWords: currentHebrewRashi.childNodes[0].childNodes[1].childNodes[0].nodeValue,
                    };
                    hebrewRashisOnPasuk.push(individualHebrewRashi);
                    howManyRashisCounter++;
                    counter++;
                } while (allTrPasukAndRashi[i - 1 + counter]
                    && !allTrPasukAndRashi[i - 1 + counter].attribs.class.match(/Verse/));
                const hebrewRashisOnThisPasuk: IRashisOnAPasuk = {
                    rashisForThisPasuk: hebrewRashisOnPasuk,
                    thatBelongToPasuk: hebrewPasukNumber,
                };
                todaysHebrewRashiContent.push(hebrewRashisOnThisPasuk);
            } else {
                if (eitherPasukOrRashi.attribs.class.match(/Verse/)
                    && !allTrPasukAndRashi[i].attribs.class.match(/Rashi/)) {
                    const hebrewPasukNumber = eitherPasukOrRashi.childNodes[5].childNodes[0].childNodes[0].nodeValue;
                    const hebrewRashisOnThisPasuk: IRashisOnAPasuk = {
                        rashisForThisPasuk: [],
                        thatBelongToPasuk: hebrewPasukNumber,
                    };
                    todaysHebrewRashiContent.push(hebrewRashisOnThisPasuk);
                }
            }
        }
        this.amountOfRashis = howManyRashisCounter;
        return todaysHebrewRashiContent;
    }
    private parseForEnglishRashis(doc: CheerioStatic): TodaysRashiContent {
        const todaysEnglishRashiContent: TodaysRashiContent = [];
        const allTrPasukAndRashi = doc("tr[class*='Co']");
        for (let i = 1; i <= allTrPasukAndRashi.length; i++) {
            const eitherPasukOrRashi = allTrPasukAndRashi[i - 1];
            if (eitherPasukOrRashi.attribs.class.match(/Rashi/)
                && allTrPasukAndRashi[i - 2].attribs.class.match(/Verse/)) {
                const englishRashisOnPasuk: RashiToAPasuk = [];
                const pasukElement = allTrPasukAndRashi[i - 2];
                const englishPasukNumber = pasukElement.childNodes[1].childNodes[1].childNodes[0].nodeValue;
                let counter = 0;
                do {
                    const currentEnglishRashi = allTrPasukAndRashi[i - 1 + counter].childNodes[1];
                    const individualEnglishRashi: ISingleRashi = {
                        belongsToPasuk: englishPasukNumber,
                        diburHamaschil: currentEnglishRashi.childNodes[0].childNodes[0].childNodes[0].nodeValue,
                        rashiWords: currentEnglishRashi.childNodes[0].childNodes[1].childNodes[0].nodeValue,
                    };
                    englishRashisOnPasuk.push(individualEnglishRashi);
                    counter++;
                } while (allTrPasukAndRashi[i - 1 + counter]
                    && !allTrPasukAndRashi[i - 1 + counter].attribs.class.match(/Verse/));
                const englishRashisOnThisPasuk: IRashisOnAPasuk = {
                    rashisForThisPasuk: englishRashisOnPasuk,
                    thatBelongToPasuk: englishPasukNumber,
                };
                todaysEnglishRashiContent.push(englishRashisOnThisPasuk);
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
                    todaysEnglishRashiContent.push(englishRashisOnThisPasuk);
                }
            }
        }
        return todaysEnglishRashiContent;
    }

    private parseHtml(doc: CheerioStatic): IChumashObject {
        const parshaNameEnglish = this.parseForParshaNameEnglish(doc);
        const hebrewPesukim: Pesukim = this.parseForHebrewPesukim(doc);
        const englishPesukim: Pesukim = this.parseForEnglishPesukim(doc);
        const todaysHebrewRashiContent: TodaysRashiContent = this.parseForHebrewRaahis(doc);
        const todaysEnglishRashiContent: TodaysRashiContent = this.parseForEnglishRashis(doc);
        const rashiDocument: IRashiObject = {
            aliyah: this.aliyah,
            amountOfRashis: this.amountOfRashis,
            learnOnDate: this.learnOnDate,
            mmddyyyy: this.mmddyyyy,
            todaysEnglishRashiContent,
            todaysHebrewRashiContent,
        };
        const chumashDocument: IChumashObject = {
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
        return chumashDocument;
    }
}
