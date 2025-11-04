import db from "../connect.js";
import Joi from "joi"; //valideringsbibliotek

//valideringskjema
const oppgaveSchema = Joi.object({
  Tittel: Joi.string().trim().required(),
  Beskrivelse: Joi.string().trim().required(),
  TestfestID: Joi.number().integer().required()
});

//hent oppgaver med testfestID
export const getOppgaverByTestfestID = (req, res) => {
  const testfestID = Number(req.params.TestfestID);
  if (isNaN(testfestID)) {
    return res.status(400).json({ error: "Ugyldig TestfestID" });
  }

  console.log("Henter oppgaver for TestfestID:", testfestID);
  const q = "SELECT * FROM Oppgaver WHERE TestfestID = ?";

  db.query(q, [testfestID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json({ error: "Serverfeil" });
    }
    return res.json(data);
  });
};

//legg til oppgaver
export const addOppgaver = (req, res) => {
  const oppgaver = req.body;

  if (!Array.isArray(oppgaver) || oppgaver.length === 0) {
    return res.status(400).json({ error: "Oppgaver må være en ikke-tom array" });
  }

  // Valider hvert objekt med Joi
  for (let i = 0; i < oppgaver.length; i++) {
    const { error } = oppgaveSchema.validate(oppgaver[i]);
    if (error) {
      return res.status(400).json({ 
        error: `Oppgave på index ${i} har feil: ${error.details[0].message}` 
      });
    }
  }

  let inserted = 0;
  let errors = [];

  oppgaver.forEach((oppgave) => {
    const q = "INSERT INTO Oppgaver (Tittel, Beskrivelse, TestfestID) VALUES (?, ?, ?)";
    const values = [oppgave.Tittel, oppgave.Beskrivelse, oppgave.TestfestID];

    db.query(q, values, (err) => {
      if (err) {
        errors.push(err.message);
      } else {
        inserted++;
      }

      // Sjekk om alle er prosessert
      if (inserted + errors.length === oppgaver.length) {
        if (errors.length > 0) {
          return res.status(500).json({ 
            error: "Noen oppgaver kunne ikke lagres", 
            details: errors 
          });
        }
        return res.status(201).json({ message: `${inserted} oppgaver lagret` });
      }
    });
  });
};

//slett oppgaver
export const deleteOppgaver = (req, res) => {
  const oppgaveID = Number(req.params.OppgaveID);
  if (isNaN(oppgaveID)) {
    return res.status(400).json({ error: "Ugyldig OppgaveID" });
  }

  const q = "DELETE FROM Oppgaver WHERE OppgaveID = ?";
  db.query(q, [oppgaveID], (err, result) => {
    if (err) {
      console.error("SQL-feil ved sletting:", err);
      return res.status(500).json({ error: "Serverfeil" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Oppgave ikke funnet" });
    }
    return res.json({ message: "Oppgave er slettet!" });
  });
};


