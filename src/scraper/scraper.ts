import * as $ from "cheerio";
import moment from "moment";
import rp from "request-promise";

// export a function that takes args. Subjects and start/end date to fill up the
// DB with.

interface IHebrewRashiObject {
    diburHamaschil: string;
    content: string;
}

interface IEnglishRashiObject {
    diburHamaschil: string;
    content: string;
}

interface IHebrewPasukObject {
    pasuk: string;
    content: string;
    // rashi: IHebrewRashiObject[];
}

interface IEnglishPasukObject {
    pasuk: string;
    content: string;
    // rashi: IEnglishRashiObject[];
}

type HebrewContent = IHebrewPasukObject[];
type EnglishContent = IEnglishPasukObject[];

interface IChumashObject {
    learnOnDate: Date;
    dayOfTheWeek: string;
    hebrewContent: HebrewContent;
    englishContent: EnglishContent;
    amountOfPesukim: number;
    aliyah: number;
    mmddyyyy: string;
    // parshaNameHebrew: string;
    parshaNameEnglish: string;
    // seferHebrew: string;
    // seferEnglish: string;
}

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
    const hebrewTdNodes = doc(".Co_Verse td:nth-child(3)");
    const englishTdNodes = doc(".Co_Verse td:nth-child(1)");

    const hebrewContent: HebrewContent = [];
    const englishContent: EnglishContent = [];

    for (let i = 0; i < amountOfPesukim; i++) {
        hebrewContent.push({
            content: hebrewTdNodes[i].childNodes[1].childNodes[0].nodeValue,
            pasuk: hebrewTdNodes[i].childNodes[0].childNodes[0].nodeValue,
        });
        englishContent.push({
            content: englishTdNodes[i].childNodes[2].childNodes[0].nodeValue,
            pasuk: englishTdNodes[i].childNodes[1].childNodes[0].nodeValue,
        });

    }

    const chumashObjectForDb: IChumashObject = {
        aliyah,
        amountOfPesukim,
        dayOfTheWeek,
        englishContent,
        hebrewContent,
        learnOnDate,
        mmddyyyy,
        parshaNameEnglish,
    };
});
