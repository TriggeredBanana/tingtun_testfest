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
  const bruker = req.user;

  if (!bruker || !bruker.ErSuperbruker) {
    return res.status(401).json({ error: "Ikke admin" });
  }

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

// Redigere en testfest
export const updateProgram = (req, res) => {
  const programID = Number(req.params.ProgramID);
  const { Navn , Punkter } = req.body;
  const bruker = req.user;

  // Validate ProgramID
  if (isNaN(programID) || programID <= 0) {
    return res.status(400).json({ error: "Ugyldig ProgramID" });
  }

  // Sjekk innlogging
  if (!bruker || !bruker.ErSuperbruker) {
    return res.status(401).json({ error: "Ikke innlogget eller admin" });
  }

  // Validate input
  if (!Navn || !Punkter) {
    return res.status(400).json({ error: "Navn og Punkter er påkrevd" });
  }

  const query = "UPDATE Program SET Navn = ?, Punkter = ? WHERE ProgramID = ?";
  const params = [Navn, Punkter, programID];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Feil ved oppdatering:", err);
      return res.status(500).json({ error: "Kunne ikke oppdatere program" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Program ikke funnet eller ingen tilgang" 
      });
    }

    res.json({ message: "Program oppdatert!" });
  });
};

// Slette et program (kun superbruker)
export const deleteProgram = (req, res) => {
  const bruker = req.user;
  const programID = Number(req.params.ProgramID);

  // Sjekk at programID er gyldig
  if (isNaN(programID) || programID <= 0) {
    return res.status(400).json({ error: "Ugyldig ProgramID" });
  }

  // Sjekk at bruker er innlogget
  if (!bruker || !bruker.ErSuperbruker) {
    return res.status(401).json({ error: "Ikke admin" });
  }

  // Slett programmet
  db.query("DELETE FROM Program WHERE ProgramID = ?", [programID], (err, result) => {
    if (err) {
      console.error("Feil ved sletting:", err);
      return res.status(500).json({ error: "Kunne ikke slette program" });
    }

    // Hvis program ikke ble funnet
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Program ikke funnet" });
    }
    res.json({ message: "Program slettet!" });
  });
};
