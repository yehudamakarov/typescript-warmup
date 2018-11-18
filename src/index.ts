import dotenv from "dotenv";
dotenv.config();

import mongoDbConfig from "./config/mongoDbConfig";
import ExpressApp from "./ExpressApp";

mongoDbConfig();

const PORT = process.env.PORT || 5000;

ExpressApp.listen(PORT, () => {
    // tslint:disable-next-line
    console.log(`Listening at port ${PORT}...`);
});
