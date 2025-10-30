import db from "../connect.js";

export const getTestfester = (req, res) => {
  const q = `
    SELECT 
      t.TestfestID,
      t.Dato,
      t.Status,
      t.ProgramID,
      t.TjenesteeierID,
      tj.Bedrift AS BedriftNavn
    FROM Testfester t
    LEFT JOIN Tjenesteeier tj ON t.TjenesteeierID = tj.TjenesteeierID
  `;
  
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    console.log("Spørring kjørt, rader funnet:", data.length);
    return res.json(data);
  });
};

export const getTestfesterByID = (req, res) => {
  const testfestID = req.params.TestfestID;
  const q = `
    SELECT 
      t.TestfestID,
      t.Dato,
      t.Status,
      t.ProgramID,
      t.TjenesteeierID,
      tj.Bedrift AS BedriftNavn
    FROM Testfester t
    LEFT JOIN Tjenesteeier tj ON t.TjenesteeierID = tj.TjenesteeierID
    WHERE t.TestfestID = ?
  `;

  db.query(q, [testfestID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Testfest ikke funnet" });
    }
    console.log("Testfest funnet:", data[0]);
    return res.json(data[0]);
  });
}

//Koble Program med Testfest
export const updateProgramForTestfest = (req, res) => {
  const q = "UPDATE Testfester SET ProgramID = ? WHERE TestfestID = ?";
  const values = [req.body.ProgramID, req.params.TestfestID];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Feil ved oppdatering av program:", err);
      return res.status(500).json({ error: "Kunne ikke oppdatere program" });
    }
    return res.json({ message: "Program koblet til testfest!" });
  });
}; 

export const addTestfester = (req, res) => {
  const q = "INSERT INTO Testfester (Dato, Status, TjenesteeierID) VALUES (?, ?, ?)";
  const values = [req.body.Dato, req.body.Status, req.body.TjenesteeierID];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    console.log("Testfest opprettet med ID:", data.insertId);
    return res.status(201).json({insertId: data.insertId });
  });
};

export const deleteTestfester = (req, res) => {
  const testfesterID = req.params.TestfestID;
  const q = "DELETE FROM Testfester WHERE TestfestID = ?";

  db.query(q, [testfesterID], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Testfest er slettet!");
  });
};