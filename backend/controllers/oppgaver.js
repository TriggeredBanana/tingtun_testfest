import db from "../connect.js";

export const getOppgaverByTestfestID = (req, res) => {
  const testfestID = req.params.TestfestID;
  console.log("Henter oppgaver for TestfestID:", testfestID);
  const q = "SELECT * FROM Oppgaver WHERE TestfestID = ?";

  db.query(q, [testfestID], (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
};

export const addOppgaver = (req, res) => {
  // req.body er en array av oppgaver
  const oppgaver = req.body;
  
  if (!Array.isArray(oppgaver)) {
    return res.status(400).json({ error: "Oppgaver må være en array" });
  }

  let inserted = 0;
  let errors = [];

  oppgaver.forEach((oppgave) => {
    const q = "INSERT INTO Oppgaver (Tittel, Beskrivelse, TestfestID) VALUES (?, ?, ?)";
    const values = [oppgave.Tittel, oppgave.Beskrivelse, oppgave.TestfestID];

    db.query(q, values, (err) => {
      if (err) {
        errors.push(err);
      } else {
        inserted++;
      }

      if (inserted + errors.length === oppgaver.length) {
        if (errors.length > 0) {
          return res.status(500).json({ error: "Noen oppgaver kunne ikke lagres", errors });
        }
        return res.status(201).json({ message: `${inserted} oppgaver lagret` });
      }
    });
  });
};

export const deleteOppgaver = (req, res) => {
  const oppgaverID = req.params.OppgaveID;
  const q = "DELETE FROM Oppgaver WHERE OppgaveID = ?";

  db.query(q, [oppgaverID], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Oppgave er slettet!");
  });
};

