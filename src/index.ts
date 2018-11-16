import dotenv from "dotenv";
dotenv.config();

import mongoDbConfigFunction from "./config/mongoDbConfigFunction";
import ExpressApp from "./ExpressApp";

mongoDbConfigFunction();

const PORT = process.env.PORT || 5000;

ExpressApp.listen(PORT, () => {
    // tslint:disable-next-line
    console.log(`Listening at port ${PORT}...`);
});
