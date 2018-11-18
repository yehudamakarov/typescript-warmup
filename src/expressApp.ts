import express, { Router } from "express";
import mongoDbConfig from "./config/mongoDbConfig";
import chumashController from "./controllers/chumashController";
import usersController from "./controllers/usersController";

class ExpressApp {
    public expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.MongoDbConfig();
        this.mountRoutes();
    }

    private MongoDbConfig() {
        mongoDbConfig();
    }

    private mountRoutes(): void {
        this.expressApp.use("/users", usersController);
        this.expressApp.use("/chumash", chumashController);
    }
}

export default new ExpressApp().expressApp;
