import db from "../connect.js";
import bcrypt from "bcrypt";

// Hent alle brukere (uten passord!)
export const getUsers = (req, res) => {
  const q = "SELECT BrukerID, Brukernavn, Navn, ErSuperbruker, Opprettet, Oppdatert FROM Brukere ORDER BY Opprettet DESC";
  
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil ved henting av brukere:", err);
      return res.status(500).json({ error: "Kunne ikke hente brukere" });
    }
    return res.json(data);
  });
};

// Hent én bruker basert på ID
export const getUserById = (req, res) => {
  const userId = req.params.id;
  const q = "SELECT BrukerID, Brukernavn, Navn, ErSuperbruker, Opprettet, Oppdatert FROM Brukere WHERE BrukerID = ?";
  
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("SQL-feil ved henting av bruker:", err);
      return res.status(500).json({ error: "Kunne ikke hente bruker" });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Bruker ikke funnet" });
    }
    return res.json(data[0]);
  });
};

// Opprett ny bruker
export const addUser = async (req, res) => {
  try {
    const { username, name, password, isSuperUser } = req.body;

    // Validering
    if (!username || !name || !password) {
      return res.status(400).json({ error: "Brukernavn, navn og passord er påkrevd" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Passord må være minst 6 tegn" });
    }

    // Sjekk om brukernavn allerede eksisterer
    const checkQ = "SELECT BrukerID FROM Brukere WHERE Brukernavn = ?";
    db.query(checkQ, [username], async (err, data) => {
      if (err) {
        console.error("SQL-feil ved sjekk av brukernavn:", err);
        return res.status(500).json({ error: "Kunne ikke sjekke brukernavn" });
      }

      if (data.length > 0) {
        return res.status(409).json({ error: "Brukernavn er allerede i bruk" });
      }

      // Hash passord
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Sett inn ny bruker
      const insertQ = "INSERT INTO Brukere (Brukernavn, Navn, PassordHash, ErSuperbruker) VALUES (?, ?, ?, ?)";
      const values = [username, name, hashedPassword, isSuperUser || false];

      db.query(insertQ, values, (err, result) => {
        if (err) {
          console.error("SQL-feil ved oppretting av bruker:", err);
          return res.status(500).json({ error: "Kunne ikke opprette bruker" });
        }
        return res.status(201).json({ 
          message: "Bruker opprettet!",
          userId: result.insertId 
        });
      });
    });
  } catch (error) {
    console.error("Feil ved oppretting av bruker:", error);
    return res.status(500).json({ error: "Serverfeil ved oppretting av bruker" });
  }
};

// Oppdater bruker
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, password } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Navn er påkrevd" });
    }

    // Hvis passord er inkludert, hash det
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: "Passord må være minst 6 tegn" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const q = "UPDATE Brukere SET Navn = ?, PassordHash = ? WHERE BrukerID = ?";
      db.query(q, [name, hashedPassword, userId], (err, result) => {
        if (err) {
          console.error("SQL-feil ved oppdatering av bruker:", err);
          return res.status(500).json({ error: "Kunne ikke oppdatere bruker" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        return res.json({ message: "Bruker oppdatert!" });
      });
    } else {
      // Oppdater kun navn
      const q = "UPDATE Brukere SET Navn = ? WHERE BrukerID = ?";
      db.query(q, [name, userId], (err, result) => {
        if (err) {
          console.error("SQL-feil ved oppdatering av bruker:", err);
          return res.status(500).json({ error: "Kunne ikke oppdatere bruker" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        return res.json({ message: "Bruker oppdatert!" });
      });
    }
  } catch (error) {
    console.error("Feil ved oppdatering av bruker:", error);
    return res.status(500).json({ error: "Serverfeil ved oppdatering av bruker" });
  }
};

// Slett bruker
export const deleteUser = (req, res) => {
  const userId = req.params.id;
  
  // Forhindre sletting av siste superbruker
  const checkQ = "SELECT COUNT(*) as antallSuperbrukere FROM Brukere WHERE ErSuperbruker = TRUE";
  db.query(checkQ, (err, data) => {
    if (err) {
      console.error("SQL-feil ved sjekk av superbrukere:", err);
      return res.status(500).json({ error: "Kunne ikke sjekke antall superbrukere" });
    }

    const isSuperUserCheckQ = "SELECT ErSuperbruker FROM Brukere WHERE BrukerID = ?";
    db.query(isSuperUserCheckQ, [userId], (err, userData) => {
      if (err) {
        console.error("SQL-feil ved sjekk av bruker:", err);
        return res.status(500).json({ error: "Kunne ikke sjekke bruker" });
      }

      if (userData.length === 0) {
        return res.status(404).json({ error: "Bruker ikke funnet" });
      }

      if (userData[0].ErSuperbruker && data[0].antallSuperbrukere <= 1) {
        return res.status(403).json({ error: "Kan ikke slette siste superbruker" });
      }

      // Slett bruker
      const deleteQ = "DELETE FROM Brukere WHERE BrukerID = ?";
      db.query(deleteQ, [userId], (err, result) => {
        if (err) {
          console.error("SQL-feil ved sletting av bruker:", err);
          return res.status(500).json({ error: "Kunne ikke slette bruker" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Bruker ikke funnet" });
        }
        return res.json({ message: "Bruker slettet!" });
      });
    });
  });
};

// Login (autentisering)
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Brukernavn og passord er påkrevd" });
  }

  const q = "SELECT BrukerID, Brukernavn, Navn, PassordHash, ErSuperbruker FROM Brukere WHERE Brukernavn = ?";
  
  db.query(q, [username], async (err, data) => {
    if (err) {
      console.error("SQL-feil ved login:", err);
      return res.status(500).json({ error: "Serverfeil ved login" });
    }

    if (data.length === 0) {
      return res.status(401).json({ error: "Ugyldig brukernavn eller passord" });
    }

    const user = data[0];

    // Sammenlign passord
    const isMatch = await bcrypt.compare(password, user.PassordHash);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Ugyldig brukernavn eller passord" });
    }

    // Vellykket login - returner brukerdata (uten passord!)
    return res.json({
      success: true,
      user: {
        id: user.BrukerID,
        username: user.Brukernavn,
        name: user.Navn,
        isSuperUser: user.ErSuperbruker
      }
    });
  });
};