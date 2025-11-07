import db from "../connect.js";

export const getTestfester = (req, res) => {
  const bruker = req.user; // Kommer fra verifyToken hvis innlogget

  let query = `
    SELECT 
      t.TestfestID,
      t.Dato,
      t.Status,
      t.ProgramID,
      t.BrukerID,
      b.Navn AS BedriftNavn
    FROM Testfester t
    LEFT JOIN Brukere b ON t.BrukerID = b.BrukerID
  `;
  
  const params = [];

  // Hvis ikke innlogget → vis alle
  if (!bruker) {
    console.log("Ikke innlogget - viser alle testfester");
  }
  // Vanlig bruker → vis kun egne
  else if (!bruker.ErSuperbruker) {
    query += " WHERE t.BrukerID = ?";
    params.push(bruker.BrukerID);
  }

  query += " ORDER BY t.Dato DESC";

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error("Feil ved henting av testfester:", err);
      return res.status(500).json({ error: "Serverfeil" });
    }
    res.json(rows);
  });
};

// Hent testfest etter ID
export const getTestfesterByID = (req, res) => {
  const testfestID = req.params.TestfestID;
  const q = `
    SELECT 
      t.TestfestID,
      t.Dato,
      t.Status,
      t.ProgramID,
      t.BrukerID,
      b.Navn AS BedriftNavn
    FROM Testfester t
    LEFT JOIN Brukere b ON t.BrukerID = b.BrukerID
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
    const Dato = data[0].Dato;
    let correctDato = Dato;

    if (Dato instanceof Date) {
      // Konverter til lokal tid og behold kun YYYY-MM-DD
      const localTid = new Date(Dato.getTime() - Dato.getTimezoneOffset() * 60000);
      correctDato = localTid.toISOString().split("T")[0];
    }
    data[0].Dato = correctDato;
    return res.json(data[0]);
  });
};

// Tildel program (kun admin)
export const updateProgramForTestfest = (req, res) => {
  const { TestfestID } = req.params;
  const { ProgramID } = req.body;
  const bruker = req.user;

  // Sjekk at bruker er admin
  if (!bruker || !bruker.ErSuperbruker) {
    return res.status(403).json({ error: "Kun superbruker kan tilordne program" });
  }

  db.query(
    "UPDATE Testfester SET ProgramID = ? WHERE TestfestID = ?",
    [ProgramID, TestfestID],
    (err, result) => {
      if (err) {
        console.error("Feil ved tilordning av program:", err);
        return res.status(500).json({ error: "Serverfeil ved tilordning av program" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Testfest ikke funnet" });
      }

      res.json({ success: true, message: "Program tilordnet" });
    }
  );
};

// Legg til en testfest, må være innlogget
export const addTestfester =  (req, res) => {
  const bruker = req.user;
  if (!bruker) return res.status(401).json({ error: "Ikke innlogget" });

  const { Dato, Status } = req.body;

  db.query(
    "INSERT INTO Testfester (Dato, Status, BrukerID) VALUES (?, ?, ?)",
    [Dato, Status, bruker.BrukerID],
    (err, result) => {
      if (err) {
        console.error("Feil ved opprettelse:", err);
        return res.status(500).json({ error: "Serverfeil" });
      }
      res.status(201).json({
      message: "Testfest opprettet",
      TestfestID: result.insertId
});
    }
  );
};

//Redigere en testfest
export const updateTestfester = (req, res) => {
  const { TestfestID } = req.params;
  const { Dato, Status } = req.body;
  const bruker = req.user;

  if (!bruker) {
    return res.status(401).json({ error: "Ikke innlogget" });
  }

  // Admin kan redigere alle, vanlige brukere bare sine egne
  let query = "UPDATE Testfester SET Dato = ?, Status = ? WHERE TestfestID = ?";
  let params = [Dato, Status, TestfestID];

  if (bruker.ErSuperbruker !== 1) {
    query += " AND BrukerID = ?";
    params.push(bruker.BrukerID);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Feil ved oppdatering:", err);
      return res.status(500).json({ error: "Kunne ikke oppdatere testfest" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Testfest ikke funnet eller ingen tilgang" 
      });
    }

    res.json({ message: "Testfest oppdatert!" });
  });
};

// Slett testfest (kun eier eller admin)
export const deleteTestfester = (req, res) => {
  const bruker = req.user;
  const { TestfestID } = req.params;

  db.query(
    "SELECT BrukerID FROM Testfester WHERE TestfestID = ?",
    [TestfestID],
    (err, rows) => {
      if (err) {
        console.error("Feil ved sletting:", err);
        return res.status(500).json({ error: "Serverfeil" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Testfest ikke funnet" });
      }

      const eierId = rows[0].BrukerID;

      if (Number(bruker.BrukerID) !== Number(eierId) && !erSuper) {
        return res.status(403).json({ error: "Du har ikke tillatelse til å slette denne testfesten." });
      }

      db.query("DELETE FROM Testfester WHERE TestfestID = ?", [TestfestID], (err) => {
        if (err) {
          console.error("Feil ved sletting:", err);
          return res.status(500).json({ error: "Serverfeil" });
        }
        res.json({ message: "Testfest slettet!" });
      });
    }
  );
};

 