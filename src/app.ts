import express from "express";

interface IApp {
    expressApp: express.Application;
}

class App implements IApp {
    public expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.use("/", (req, res) => {
            res.json({
                message: "Hello World",
            });
        });
        this.expressApp.use("/", router);
    }
}

export default new App().expressApp;
