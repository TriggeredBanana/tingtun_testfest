import db from "../connect.js";

//Hent spesifikke program
export const getProgrambyID = (req, res) => {
  const { ProgramID } = req.params;
  const q = "SELECT * FROM Program where ProgramID = ?";
    db.query(q, [ProgramID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Program ikke funnet" });
    }
    console.log("Testfest funnet:", data[0]);
    return res.json(data[0]);
  });
};

//hent alle program
export const getProgram = (req, res) => {
  const q = "SELECT * FROM Program";
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    console.log("Spørring kjørt, rader funnet:", data.length);
    return res.json(data);
  });
};

//legg til program
export const addProgram = (req, res) => {
  const q = "INSERT INTO Program (Navn, Punkter) VALUES (?, ?, ?)";
  const values = [req.body.Navn, req.body.Punkter];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    console.log("Testfest opprettet med ID:", data.insertId);
    return res.status(201).json({insertId: data.insertId });
  });
};

