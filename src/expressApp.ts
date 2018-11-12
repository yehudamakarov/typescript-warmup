import express, { Router } from "express";

class ExpressApp {
    public expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const apiRouter = Router();
        const chumashRouter = Router();
        chumashRouter.get("/:date", (req, res) => {
            res.json({
                message: req.params.date,
            });
        });
        apiRouter.use("/chumash", chumashRouter);
        this.expressApp.use("/api", apiRouter);
    }
}

export default new ExpressApp().expressApp;
