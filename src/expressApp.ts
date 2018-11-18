import express, { Router } from "express";
import chumashController from "./controllers/chumashController";
import usersController from "./controllers/usersController";

class ExpressApp {
    public expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        this.expressApp.use("/users", usersController);
        this.expressApp.use("/chumash", chumashController);
    }
}

export default new ExpressApp().expressApp;
