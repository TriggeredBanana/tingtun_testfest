import db from "../connect.js";
import Joi from "joi"; // Validation library

// Validation schema
const oppgaveSchema = Joi.object({
  Tittel: Joi.string().trim().required(),
  Beskrivelse: Joi.string().trim().required(),
  TestfestID: Joi.number().integer().required()
});

// Get tasks with testfestID
export const getOppgaverByTestfestID = (req, res) => {
  const testfestID = Number(req.params.TestfestID);
  if (isNaN(testfestID)) {
    return res.status(400).json({ error: "Ugyldig TestfestID" });
  }

  const q = "SELECT * FROM Oppgaver WHERE TestfestID = ?";

  db.query(q, [testfestID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json({ error: "Serverfeil" });
    }
    return res.json(data);
  });
};

// Add tasks
export const addOppgaver = async (req, res) => {
  const oppgaver = req.body;
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  if (!Array.isArray(oppgaver) || oppgaver.length === 0) {
    return res.status(400).json({ error: "Oppgaver må være en ikke-tom array" });
  }

  // Validate each object with Joi
  for (let i = 0; i < oppgaver.length; i++) {
    const { error } = oppgaveSchema.validate(oppgaver[i]);
    if (error) {
      return res.status(400).json({ 
        error: `Oppgave på index ${i} har feil: ${error.details[0].message}` 
      });
    }
  }

  try {
    // Use "Promise.all" for proper async handling
    const insertPromises = oppgaver.map((oppgave) => {
      return new Promise((resolve, reject) => {
        const q = "INSERT INTO Oppgaver (Tittel, Beskrivelse, TestfestID) VALUES (?, ?, ?)";
        const values = [oppgave.Tittel, oppgave.Beskrivelse, oppgave.TestfestID];

        db.query(q, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    await Promise.all(insertPromises);
    return res.status(201).json({ message: `${oppgaver.length} oppgaver lagret` });
  } catch (error) {
    console.error("Feil ved lagring av oppgaver:", error);
    return res.status(500).json({ error: "Kunne ikke lagre oppgaver" });
  }
};

// Update tasks
export const updateOppgaver = (req, res) => {
  const oppgaveID = Number(req.params.OppgaveID);
  const { Tittel, Beskrivelse } = req.body;
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  // Check if ID is not a number, and if it is a valid positive number
  if (isNaN(oppgaveID || oppgaveID <= 0)) {
    return res.status(400).json({ error: "Ugyldig OppgaveID" });
  }

  if (!Tittel || !Beskrivelse) {
    return res.status(400).json({ error: "Tittel og Beskrivelse er påkrevd" });
  }
  // First check if user owns the testfest (or is admin)
  const checkQ = `
    SELECT o.OppgaveID, t.BrukerID 
    FROM Oppgaver o
    JOIN Testfester t ON o.TestfestID = t.TestfestID
    WHERE o.OppgaveID = ?
  `;

  db.query(checkQ, [oppgaveID], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Serverfeil" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Oppgave ikke funnet" });
    }

    const eierId = rows[0].BrukerID;

    // Check authorization
    if (bruker.BrukerID !== eierId && !bruker.ErSuperbruker) {
      return res.status(403).json({ error: "Ikke autorisert til å oppdatere denne oppgaven" });
    }

    // Update the task
    const updateQ = "UPDATE Oppgaver SET Tittel = ?, Beskrivelse = ? WHERE OppgaveID = ?";
    const values = [Tittel, Beskrivelse, oppgaveID];

    db.query(updateQ, values, (err, result) => {
      if (err) {
        console.error("Feil ved oppdatering:", err);
        return res.status(500).json({ error: "Serverfeil ved oppdatering" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Oppgave ikke funnet" });
      }

      return res.json({ message: "Oppgave er oppdatert!" });
    });
  });
};


// Delete tasks
export const deleteOppgaver = (req, res) => {
  const oppgaveID = Number(req.params.OppgaveID);
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  if (isNaN(oppgaveID)) {
    return res.status(400).json({ error: "Ugyldig OppgaveID" });
  }

  // First check if user owns the testfest (or is admin)
  const checkQ = `
    SELECT o.OppgaveID, t.BrukerID 
    FROM Oppgaver o
    JOIN Testfester t ON o.TestfestID = t.TestfestID
    WHERE o.OppgaveID = ?
  `;

  db.query(checkQ, [oppgaveID], (err, rows) => {
    if (err) {
      console.error("SQL-feil ved sjekk:", err);
      return res.status(500).json({ error: "Serverfeil" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Oppgave ikke funnet" });
    }

    const eierId = rows[0].BrukerID;

    // Check authorization
    if (bruker.BrukerID !== eierId && !bruker.ErSuperbruker) {
      return res.status(403).json({ error: "Ikke autorisert til å slette denne oppgaven" });
    }

    // Delete the task
    const deleteQ = "DELETE FROM Oppgaver WHERE OppgaveID = ?";
    db.query(deleteQ, [oppgaveID], (err, result) => {
      if (err) {
        console.error("SQL-feil ved sletting:", err);
        return res.status(500).json({ error: "Serverfeil" });
      }
      return res.json({ message: "Oppgave er slettet!" });
    });
  });
};


