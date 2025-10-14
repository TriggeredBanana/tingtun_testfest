import db from "../connect.js";

export const getTjenesteeiere = (req, res) => {
  const q = "SELECT * FROM Tjenesteeier";
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    console.log("Spørring kjørt, rader funnet:", data.length);
    return res.json(data);
  });
};

export const addTjenesteeier = (req, res) => {
  const q = "INSERT INTO Tjenesteeier (Bedrift, Mail, Passord) VALUES (?)";
  const values = [req.body.Bedrift, req.body.Mail, req.body.Passord];

  db.query(q, [values], (err) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json("Data fra client ble sendt!");
  });
};

export const deleteTjenesteeier = (req, res) => {
  const tjenesteeierID = req.params.TjenesteeierID;
  const q = "DELETE FROM Tjenesteeier WHERE TjenesteeierID = ?";

  db.query(q, [tjenesteeierID], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Tjenesteeier er slettet!");
  });
};
