import db from "../connect.js";
import Joi from "joi"; // Valideringsbibliotek

// Valideringskjema
const oppgaveSchema = Joi.object({
  Tittel: Joi.string().trim().required(),
  Beskrivelse: Joi.string().trim().required(),
  TestfestID: Joi.number().integer().required()
});

// Hent oppgaver med testfestID
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

// Legg til oppgaver
export const addOppgaver = async (req, res) => {
  const oppgaver = req.body;
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

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

  try {
    // Bruker "Promise.all" for ordentlig async håndtering
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
//oppdater oppgaver
export const updateOppgaver = (req, res) => {
  const oppgaveID = Number(req.params.OppgaveID);
  const { Tittel, Beskrivelse } = req.body;
  const bruker = req.user;

  if (isNaN(oppgaveID)) {
    return res.status(400).json({ error: "Ugyldig OppgaveID" });
  }

  if (!Tittel || !Beskrivelse) {
    return res.status(400).json({ error: "Tittel og Beskrivelse er påkrevd" });
  }

  const q = "UPDATE Oppgaver SET Tittel = ?, Beskrivelse = ? WHERE OppgaveID = ?";
  const values = [Tittel, Beskrivelse, oppgaveID];

  db.query(q, values, (err, result) => {
    if (err) {
      console.error("Feil ved oppdatering:", err);
      return res.status(500).json({ error: "Kunne ikke oppdatere oppgave" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Oppgave ikke funnet" });
    }

    return res.json({ message: "Oppgave oppdatert!" });
  });
};

// Slett oppgaver
export const deleteOppgaver = (req, res) => {
  const oppgaveID = Number(req.params.OppgaveID);
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  if (isNaN(oppgaveID)) {
    return res.status(400).json({ error: "Ugyldig OppgaveID" });
  }

  // Først sjekk om bruker eier testfesten (eller er admin)
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

    // Sjekk autorisasjon
    if (bruker.BrukerID !== eierId && !bruker.ErSuperbruker) {
      return res.status(403).json({ error: "Ikke autorisert til å slette denne oppgaven" });
    }

    // Slett oppgaven
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


