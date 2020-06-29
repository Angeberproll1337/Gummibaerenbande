const helper = require("../helper.js");
const ProduktnaehwerteDao = require("../dao/produktnaehwerteDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/produktnaehwerte/gib/:id", function(request, response) {
    helper.log("Service Naehrwerte: Client requested one record, id=" + request.params.id);

    const produktnaehwerteDao = new ProduktnaehwerteDao(request.app.locals.dbConnection);
    try {
        var result = produktnaehwerteDao.loadById(request.params.id);
        helper.log("Service Naehrwerte: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Naehrwerte: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;