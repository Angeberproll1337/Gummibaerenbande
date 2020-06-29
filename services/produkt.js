const helper = require("../helper.js");
const ProduktDao = require("../dao/produktDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/produkt/gib/:id", function(request, response) {
    helper.log("Service Produkt: Client requested one record, id=" + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadById(request.params.id);
        helper.log("Service Produkt: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/produkt/gibmitname/:name", function(request, response) {
    helper.log("Service Produkt: Client requested one record, name=" + request.params.name);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadByName(request.params.name);
        helper.log("Service Produkt: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading record by name. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/produkt/alle/", function(request, response) {
    helper.log("Service Produkt: Client requested all records");

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadAll();
        helper.log("Service Produkt: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/produkt/kategorie/:id", function(request, response) {
    helper.log("Service Produkt: Client requested all records by CategoryID");

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.loadByKategorieID(request.params.id);
        helper.log("Service Produkt: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/produkt/existiert/:id", function(request, response) {
    helper.log("Service Produkt: Client requested check, if record exists, id=" + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.exists(request.params.id);
        helper.log("Service Produkt: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Produkt: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

// "Artikelname": Artikelname, "KategorieID": strKategorieID, "Nettopreis": Preis, "MwstID": Mwst, "Beschreibung": Beschreibung, "Naehrwerte": Naehrwerte, "BildURL": BildURL
serviceRouter.post("/produkt", function(request, response) {
    helper.log("Service Produkt: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.Artikelname)) 
        errorMsgs.push("Artikelname fehlt");
    if (helper.isUndefined(request.body.KategorieID)) 
        errorMsgs.push("KategorieID fehlt");
    if (helper.isUndefined(request.body.MwstID)) 
        errorMsgs.push("MwstID fehlt");
    if (helper.isUndefined(request.body.Nettopreis)) 
        errorMsgs.push("Nettopreis fehlt");
    if (helper.isUndefined(request.body.Beschreibung)) 
        errorMsgs.push("Beschreibung fehlt");
    if (helper.isUndefined(request.body.Naehrwerte)) {
        errorMsgs.push("Naehrwerte fehlt");
    } else if (helper.isUndefined(request.body.BildURL)) {
        errorMsgs.push("BildURL fehlt");
    }
    
    if (errorMsgs.length > 0) {
        helper.log("Service Produkt: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var result = produktDao.create(request.body.Artikelname, request.body.KategorieID, request.body.MwstID, request.body.Nettopreis, request.body.Beschreibung, request.body.Naehrwerte, request.body.BildURL);
        helper.log("Service Produkt: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put("/produkt", function(request, response) {
    helper.log("Service Produkt: Client requested update of existing record");

    var errorMsgs=[];
    
    if(helper.isUndefined(request.body.ArtikelID))
        errorMsgs.push("ArtikelID fehlt");
    if(helper.isUndefined(request.body.Artikelname))
        errorMsgs.push("Artikelname fehlt");
    if(helper.isUndefined(request.body.KategorieID))
        errorMsgs.push("KatergorieID fehlt");
    if(helper.isUndefined(request.body.Nettopreis))
        errorMsgs.push("Nettopreis fehlt");
    if(helper.isUndefined(request.body.Beschreibung))
        errorMsgs.push("Beschreibung fehlt");
    if(helper.isUndefined(request.body.Naehrwerte))
        errorMsgs.push("Naehrwerte fehlt");
    if(helper.isUndefined(request.body.BildURL))
        errorMsgs.push("BildURL fehlt");

    if (errorMsgs.length > 0) {
        helper.log("Service Produkt: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    console.log(request.body);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        // ArtikelID=0, Artikelname="", KategorieID=0, Nettopreis=0.0, Beschreibung="", Naehrwerte=[], BildURL=""
        var result = produktDao.update(request.body.ArtikelID, request.body.Artikelname, request.body.KategorieID, request.body.Nettopreis, request.body.Beschreibung, request.body.Naehrwerte, request.body.BildURL);
        helper.log("Service Produkt: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Produkt: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/produkt/delete/:id", function(request, response) {
    helper.log("Service Produkt: Client requested deletion of record, id=" + request.params.id);

    const produktDao = new ProduktDao(request.app.locals.dbConnection);
    try {
        var obj = produktDao.loadById(request.params.id);
        produktDao.delete(request.params.id);
        helper.log("Service Produkt: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Produkt: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;