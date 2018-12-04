import { Router } from "express";
import moment from "moment";
import { ChumashMongooseModel, IChumashDocument } from "../models/Chumash";

const chumashController = Router();

chumashController.get("/", (req, res) => {
    // const date = moment().subtract(1, "days");
    const date = moment().startOf("day").toDate();
    ChumashMongooseModel.findOne({ learnOnDate: date }, (err, chumashDocument) => {
        res.json(chumashDocument);
    });
});

export default chumashController;
