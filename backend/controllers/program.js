import db from "../connect.js";

//Hent spesifikke program
export const getProgrambyID = (req, res) => {
  const programID = Number(req.params.ProgramID);
  
  // Validate ProgramID
  if (isNaN(programID) || programID <= 0) {
    return res.status(400).json({ error: "Ugyldig ProgramID" });
  }

  const q = "SELECT * FROM Program where ProgramID = ?";
    db.query(q, [programID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Program ikke funnet" });
    }
    return res.json(data[0]);
  });
};

// Hent alle program
export const getProgram = (req, res) => {
  const q = "SELECT * FROM Program";
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
};

//legg til program
export const addProgram = (req, res) => {
  const { Navn, Punkter } = req.body;

  // Validate input
  if (!Navn || !Punkter) {
    return res.status(400).json({ error: "Navn og Punkter er påkrevd" });
  }

  const q = "INSERT INTO Program (Navn, Punkter) VALUES (?, ?)";
  const values = [Navn, Punkter];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({insertId: data.insertId });
  });
};

