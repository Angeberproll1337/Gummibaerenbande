const helper = require("../helper.js");
const ProduktkategorieDao = require("./produktkategorieDao.js");
const MehrwertsteuerDao = require("./mehrwertsteuerDao.js");
const DownloadDao = require("./downloadDao.js");
const ProduktbildDao = require("./produktbildDao.js");
const ProduktnaehwerteDao = require("./produktnaehwerteDao.js")

class ProduktDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const produktkategorieDao = new ProduktkategorieDao(this._conn);
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        const downloadDao = new DownloadDao(this._conn);
        const produktbildDao = new ProduktbildDao(this._conn);
        const produktnaehwerteDao = new ProduktnaehwerteDao(this._conn);

        var sql = "SELECT * FROM Produkt WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);
        //console.log(result);

        result.kategorie = produktkategorieDao.loadById(result.kategorieid);
        delete result.kategorieid;
        result.mehrwertsteuer = mehrwertsteuerDao.loadById(result.mehrwertsteuerid);
        delete result.mehrwertsteuerid;
        result.naehrwerte = produktnaehwerteDao.loadById(result.naehwerteid);
        //delete result.
        if (helper.isNull(result.datenblattid)) {
            result.datenblatt = null;
        } else {
            result.datenblatt = downloadDao.loadById(result.datenblattid);
        }
        delete result.datenblattid;
        result.bilder = produktbildDao.loadByParent(result.id);
        for (var i = 0; i < result.bilder.length; i++) {
            delete result.bilder[i].produktid;
        }

        result.mehrwertsteueranteil = helper.round((result.nettopreis / 100) * result.mehrwertsteuer.steuersatz);

        result.bruttopreis = helper.round(result.nettopreis + result.mehrwertsteueranteil);

        return result;
    }

    loadByName(name) {
        const produktkategorieDao = new ProduktkategorieDao(this._conn);
        var categories = produktkategorieDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();
        const downloadDao = new DownloadDao(this._conn);
        
        var name = "%"+name+"%";

        var sql = "SELECT * FROM Produkt WHERE Bezeichnung LIKE ?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(name);

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);
        
        //console.log(result.length);
        for (var i = 0; i < result.length; i++) {

            for (var element of categories) {
                if (element.id == result[i].kategorieid) {
                    result[i].kategorie = element;
                    break;
                }
            }
            delete result[i].kategorieid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            if (helper.isNull(result[i].datenblattid)) {
                result[i].datenblatt = null;
            } else {
                result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            }
            delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.produkt.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].mehrwertsteueranteil = helper.round((result[i].nettopreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttopreis = helper.round(result[i].nettopreis + result[i].mehrwertsteueranteil);
        }

        return result;
    }

    loadAll() {
        const produktkategorieDao = new ProduktkategorieDao(this._conn);
        var categories = produktkategorieDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();
        const downloadDao = new DownloadDao(this._conn);

        var sql = "SELECT * FROM Produkt";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of categories) {
                if (element.id == result[i].kategorieid) {
                    result[i].kategorie = element;
                    break;
                }
            }
            delete result[i].kategorieid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            if (helper.isNull(result[i].datenblattid)) {
                result[i].datenblatt = null;
            } else {
                result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            }
            delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.produkt.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].mehrwertsteueranteil = helper.round((result[i].nettopreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttopreis = helper.round(result[i].nettopreis + result[i].mehrwertsteueranteil);
        }

        return result;
    }

    loadByKategorieID(id) {
        const produktkategorieDao = new ProduktkategorieDao(this._conn);
        var categories = produktkategorieDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();
        const downloadDao = new DownloadDao(this._conn);

        var sql = "SELECT * FROM Produkt WHERE KategorieID = ?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);
        console.log(result);

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of categories) {
                if (element.id == result[i].kategorieid) {
                    result[i].kategorie = element;
                    break;
                }
            }
            delete result[i].kategorieid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            if (helper.isNull(result[i].datenblattid)) {
                result[i].datenblatt = null;
            } else {
                result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            }
            delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.produkt.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].mehrwertsteueranteil = helper.round((result[i].nettopreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttopreis = helper.round(result[i].nettopreis + result[i].mehrwertsteueranteil);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Produkt WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    // request.body.Artikelname, request.body.KategorieID, request.body.MwstID, request.body.Nettopreis, request.body.Beschreibung, request.body.Naehrwerte, request.body.BildURL
    create(Artikelname = "", KategorieID = 0, MwstID = 1, Nettopreis = 1, Beschreibung="", Naehrwerte=[], BildURL="") {
        const produktnaehwerteDao = new ProduktnaehwerteDao(this._conn);
        var result = produktnaehwerteDao.create(Naehrwerte);

        var sql = "INSERT INTO Produkt (KategorieID,Bezeichnung,Beschreibung,MehrwertsteuerID,Nettopreis,BildURL,NaehwerteID) VALUES (?,?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [KategorieID, Artikelname, Beschreibung, MwstID, Nettopreis, BildURL, result.lastInsertRowid];
        result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    // request.body.Artikelname, request.body.KategorieID, request.body.Nettopreis, request.body.Beschreibung, request.body.Naehrwerte
    update(ArtikelID=0, Artikelname="", KategorieID=0, Nettopreis=0.0, Beschreibung="", Naehrwerte=[], BildURL="") {
        const produktnaehwerteDao = new ProduktnaehwerteDao(this._conn);
        produktnaehwerteDao.update(Naehrwerte);

        var sql = "UPDATE Produkt SET KategorieID=?,Bezeichnung=?,Beschreibung=?,Nettopreis=?,BildURL=?,NaehwerteID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [KategorieID, Artikelname, Beschreibung, Nettopreis, BildURL, Naehrwerte["id"], ArtikelID]; // Naehrwerte[0] = the ID
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(ArtikelID);
        return updatedObj;
    }

    delete(id) {
        try {
            const produktbildDao = new ProduktbildDao(this._conn);
            produktbildDao.deleteByParent(id);

            var sql = "DELETE FROM Produkt WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("ProduktDao [_conn=" + this._conn + "]");
    }
}

exports.loadById = (id) => {
    return id;
}

module.exports = ProduktDao;