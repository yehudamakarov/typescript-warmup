import mongoose from "mongoose";
import { mongoDbConnectionStringDevelopment } from "./developmentKeys";
import modelConnections from "./modelConnections";
import { mongoDbConnectionStringProduction } from "./productionKeys";

export default () => {
    if (process.env.NODE_ENV === "production") {
        mongoose.connect(mongoDbConnectionStringProduction);
    } else {
        mongoose.connect(mongoDbConnectionStringDevelopment);
    }
    modelConnections(mongoose);
};
