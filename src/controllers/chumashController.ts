import { Router } from "express";
import moment from "moment";
import { ChumashMongooseModel, IChumashDocument } from "../models/Chumash";

const chumashController = Router();

chumashController.get("/", (req, res) => {
    const date = moment().add(1, "days").startOf("day").toDate();
    ChumashMongooseModel.findOne({ learnOnDate: date }, (err, chumashDocument) => {
        // =====================================================================
        // Error?
        if (err) {
            res.send(err);
            return;
        }
        // =====================================================================
        // Empty Response?
        const responseBody = chumashDocument
            ? chumashDocument
            : `Nothing found for ${moment(date).format("ll")}`;
        // =================================================================
        // Send Response
        res.json(responseBody);
    });
});

export default chumashController;
