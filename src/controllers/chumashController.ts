import { Router } from "express";
import moment from "moment";
import { ChumashMongooseModel, IChumashDocument } from "../models/Chumash";

const chumashController = Router();

chumashController.get("/", (req, res) => {
    const date = moment().startOf("day").toDate();
    ChumashMongooseModel.findOne({ learnOnDate: date }, (err, chumashDocument) => {
        if (err) {
            res.send(err);
            return;
        }

        res.json(chumashDocument);
    });
});

export default chumashController;
