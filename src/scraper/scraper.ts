import moment from "moment";
import rp from "request-promise";

const subjectsToUrlPortionMap = {
    chumash: "torahreading",
    tanya: "tanya",
    tehillim: "tehillim",
};

// "11/11/2018"
const momentDate = moment().format("MM/DD/YYYY");

const url = `https://www.chabad.org/dailystudy/${subjectsToUrlPortionMap.chumash}.asp?tdate=${momentDate}`;

rp(url).then((html) => {
    debugger;
});
