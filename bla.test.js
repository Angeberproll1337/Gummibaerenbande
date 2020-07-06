const Database = require("better-sqlite3");
const dbOptions = {verbose: console.log};
const dbFile = "./db/db.sqlite";
const dbConnection = new Database(dbFile, dbOptions);

const ProduktDao = require("./dao/produktDao.js");
const ProduktkategorieDao = require("./dao/produktkategorieDao.js");
var dao = new ProduktDao(dbConnection);
var daoKat = new ProduktkategorieDao(dbConnection);

// Produkt
test('loadById', () => {
	const input = 32;
    const output = {"beschreibung": "orangetten mit belgischer dunkler Schokolade 200g ", "bezeichnung": "Duva kandierte Orangenschale überzogen mit Schokolade", "bilder": [], "bildurl": "img/artikel/17.jpg", "bruttopreis": 12.83, "datenblatt": null, "details": null, "id": 32, "kategorie": {"bezeichnung": "Schokolade", "id": 1}, "mehrwertsteuer": {"bezeichnung": "Reduziert", "id": 2, "steuersatz": 7}, "mehrwertsteueranteil": 0.84, "naehrwerte": {"brennwert": 899, "davonzucker": 100, "eiweiss": 3.8, "fett": 1, "fettsaueren": 2, "id": 11, "kohlenhydrate": 1.2, "salz": 3}, "naehwerteid": 11, "nettopreis": 11.99};

	expect(dao.loadById(input)).toEqual(output);
});

test('loadByName', () => {
	const input = "Ritter";
    const output =  [{"beschreibung": "Gefüllte Vollmilchschokolade mit Magermilch-Joghurt-Creme (45 %)", "bezeichnung": "Ritter Sport Joghurt", "bilder": [], "bildurl": "img/artikel/1.jpg", "bruttopreis": 21.39, "datenblatt": null, "details": "", "id": 19, "kategorie": {"bezeichnung": "Schokolade", "id": 1}, "mehrwertsteuer": {"bezeichnung": "Reduziert", "id": 2, "steuersatz": 7}, "mehrwertsteueranteil": 1.4, "naehwerteid": 1, "nettopreis": 19.99}];

	expect(dao.loadByName(input)).toEqual(output);
});

test('exists', () => {
	const input = 12;
    const output =  true;

	expect(dao.exists(input)).toEqual(output);
});
// ---

// Produkt Kategorie
test('loadById', () => {
	const input = 3;
	const output = { "bezeichnung": "Schlotzer", "id": 3 };

	expect(daoKat.loadById(input)).toEqual(output);
});

test('exists', () => {
	const input = 3;
    const output =  true;

	expect(daoKat.exists(input)).toEqual(output);
});
// ---
// This is a Test
