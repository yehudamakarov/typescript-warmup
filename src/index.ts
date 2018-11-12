import dotenv from "dotenv";
dotenv.config();

import mongoDbConfigFunction from "./config/mongoDbConfigFunction";
import ExpressApp from "./ExpressApp";

mongoDbConfigFunction();

ExpressApp.listen(3000, () => {
    // tslint:disable-next-line
    console.log(`Listening at port 3000...`);
});
