const helper = require("../helper.js");

class ProduktnaehwerteDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = "SELECT * FROM Naehrwert WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        //result.produkt = { "id": result.produktid };
        //delete result.produktid;

        return result;
    }

    update(NaehrwerteObj=[]){
        var sql = "UPDATE Naehrwert SET Brennwert=?,Eiweiss=?,Kohlenhydrate=?,davonZucker=?,Fett=?,Fettsaueren=?,Salz=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [NaehrwerteObj["brennwert"], NaehrwerteObj["eiweiss"], NaehrwerteObj["kohlenhydrate"], NaehrwerteObj["davonzucker"], NaehrwerteObj["fett"], NaehrwerteObj["fettsaueren"], NaehrwerteObj["salz"], NaehrwerteObj["id"]];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(NaehrwerteObj["id"]);
        return updatedObj;
    }

    create(NaehrwerteObj=[]){
        var sql = "INSERT INTO Naehrwert (Brennwert,Eiweiss,Kohlenhydrate,davonZucker,Fett,Fettsaueren,Salz) VALUES(?,?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [NaehrwerteObj["brennwert"], NaehrwerteObj["eiweiss"], NaehrwerteObj["kohlenhydrate"], NaehrwerteObj["davonzucker"], NaehrwerteObj["fett"], NaehrwerteObj["fettsaueren"], NaehrwerteObj["salz"]];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert Record. Data: " + params);

        console.log(result);
        return result;
    }
}

module.exports = ProduktnaehwerteDao;