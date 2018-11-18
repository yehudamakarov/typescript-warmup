import * as $ from "cheerio";
import moment from "moment";
import rp from "request-promise";

const subjectsForUrl = {
    chumash: "torahreading",
    tanya: "tanya",
    tehillim: "tehillim",
};

// "11/11/2018"
const momentDate = moment().format("MM/DD/YYYY");

const url = `https://www.chabad.org/dailystudy/${subjectsForUrl.chumash}.asp?tdate=${momentDate}`;

rp(url).then((html) => {
    // tslint:disable-next-line:no-debugger
    debugger;
});
