import * as $ from "cheerio";
import moment from "moment";
import rp from "request-promise";

// =============================================================================
// Types for a Chumash Document
// =============================================================================
// =============================================================================
// =============================================================================
// Array of Hebrew Pesukim Objects
// =============================================================================
interface IHebrewPasukObject {
    pasukNumber: string;
    pasukWords: string;
}
type HebrewPesukim = IHebrewPasukObject[];

// =============================================================================
// Array of English Pesukim Objects
// =============================================================================
interface IEnglishPasukObject {
    pasukNumber: string;
    pasukWords: string;
}
type EnglishPesukim = IEnglishPasukObject[];

// =============================================================================
// Document
// =============================================================================
interface IChumashSection {
    learnOnDate: Date;
    dayOfTheWeek: string;
    hebrewPesukim: HebrewPesukim;
    englishPesukim: EnglishPesukim;
    amountOfPesukim: number;
    rashi: IRashiSection;
    aliyah: number;
    mmddyyyy: string;
    parshaNameEnglish: string;
}

// =============================================================================
// =============================================================================

// =============================================================================
// Types for a Rashi Document
// =============================================================================
// =============================================================================
// =============================================================================
// Array of Hebrew Rashi Objects
// =============================================================================
interface IHebrewRashiObject {
    belongsToPasuk: string;
    diburHamaschil: string;
    rashiWords: string;
}
interface IHebrewRashisOnPasukObject {
    thatBelongToPasuk: string;
    rashisForThisPasuk: IHebrewRashiObject[];
}
type HebrewRashisOnPasuk = IHebrewRashisOnPasukObject[];

// =============================================================================
// Array of English Rashi Objects
// =============================================================================
interface IEnglishRashisOnPasuk {
    thatBelongToPasuk: string;
    rashisForThisPasuk: IEnglishRashiObject[];
}
interface IEnglishRashiObject {
    belongsToPasuk: string;
    diburHamaschil: string;
    rashiWords: string;
}
type EnglishRashisOnPasuk = IEnglishRashisOnPasuk[];

// =============================================================================
// Document
// =============================================================================
interface IRashiSection {
    learnOnDate: Date;
    hebrewRashisOnPasuk: HebrewRashisOnPasuk;
    englishRashisOnPasuk: HebrewRashisOnPasuk;
    amountOfRashis: number;
    aliyah: number;
    mmddyyyy: string;
}
// =============================================================================
// =============================================================================

// =============================================================================
// The Scraper
// =============================================================================
const subjectsForUrl = {
    chumash: "torahreading",
    tanya: "tanya",
    tehillim: "tehillim",
};

// "11/11/2018"
const now = moment();
const learnOnDate: Date = new Date(now.year(), now.month(), now.date());
const dayOfTheWeek: string = now.format("dddd");
const aliyah = now.day() + 1;
const mmddyyyy = now.format("MM/DD/YYYY");

const url = `https://www.chabad.org/dailystudy/${subjectsForUrl.chumash}.asp?tdate=${mmddyyyy}`;

rp(url).then((html) => {
    const doc = $.load(html);

    const parshaNameParts = doc(".article-header__subtitle")[0].childNodes[0].nodeValue.split(" ");
    parshaNameParts.shift();
    const parshaNameEnglish = parshaNameParts.join("").trim();

    const pesukimRows = doc(".Co_Verse");
    const amountOfPesukim = pesukimRows.length;
    // const hebrewTdNodes = doc(".Co_Verse td:nth-child(3)");
    // const englishTdNodes = doc(".Co_Verse td:nth-child(1)");

    // const hebrewContent: HebrewPesukim = [];
    // const englishContent: EnglishPesukim = [];

    // for (let i = 0; i < amountOfPesukim; i++) {
    //     hebrewContent.push({
    //         pasukNumber: hebrewTdNodes[i].childNodes[0].childNodes[0].nodeValue,
    //         pasukWords: hebrewTdNodes[i].childNodes[1].childNodes[0].nodeValue,
    //     });
    //     englishContent.push({
    //         pasukNumber: englishTdNodes[i].childNodes[1].childNodes[0].nodeValue,
    //         pasukWords: englishTdNodes[i].childNodes[2].childNodes[0].nodeValue,
    //     });
    // }
    // iterate over. if current is pasuk => start a new object if it is a rashi
    // => part of the same pasuk just passed until it is a pasuk again, and we
    // should make a new pasuk

    // **** // store rashi per pasuk as a new collection? for fancy pop up rashi views.

    const allTrPasukAndRashi = doc("tr[class*='Co']");
    const hebrewPesukim: HebrewPesukim = [];
    const englishPesukim: EnglishPesukim = [];

    const hebrewRashisOnPasuk: HebrewRashisOnPasuk = [];
    const englishRashisOnPasuk: EnglishRashisOnPasuk = [];

    for (let i = 0; i < allTrPasukAndRashi.length; i++) {
        const eitherPasukOrRashi = allTrPasukAndRashi[i];
        if (eitherPasukOrRashi.attribs.class.match(/Verse/)) {
            // make a new IHebrewPasukObject
            // make a new IEnglishPasukObject
        }
    }

    for (let i = 0; i < allTrPasukAndRashi.length; i++) {
        const eitherPasukOrRashi = allTrPasukAndRashi[i];
        if (eitherPasukOrRashi.attribs.class.match(/Rashi/)) {
            // if this is rashi, and the previous element was a pasuk,
            // make a new array of rashis and add each one until another pasuk is reached.
        }
    }
});
