import express from "express";
import mongoDbConfig from "./config/mongoDbConfig";
import chumashController from "./controllers/chumashController";
import usersController from "./controllers/usersController";

class ExpressApp {
    public expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.MongoDbConfig();
        this.mountControllers();
    }

    private MongoDbConfig() {
        mongoDbConfig();
    }

    private mountControllers(): void {
        this.expressApp.use("/users", usersController());
        this.expressApp.use("/chumash", chumashController());
    }
}

export default new ExpressApp().expressApp;
