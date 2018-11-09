import mongoDbConfigFunction from "./config/mongoDbConfigFunction";
import expressApp from "./expressApp";

mongoDbConfigFunction();

expressApp.listen(3000, () => {
    // tslint:disable-next-line
    console.log(`Listening at port 3000...`);
});
