import db from "../connect.js";
import bcrypt from "bcrypt";

export const getTjenesteeiere = (req, res) => {
  const q = "SELECT TjenesteeierID, Bedrift, Mail FROM Tjenesteeier";
  db.query(q, (err, data) => {
    if (err) {
      console.error("SQL-feil:", err);
      return res.status(500).json(err);
    }
    return res.json(data);
  });
};

export const addTjenesteeier = async (req, res) => {
  try {
    const { Bedrift, Mail, Passord } = req.body;

    // Validering
    if (!Bedrift || !Mail || !Passord) {
      return res.status(400).json({ error: "Bedrift, Mail og Passord er påkrevd" });
    }

    if (Passord.length < 6) {
      return res.status(400).json({ error: "Passord må være minst 6 tegn" });
    }

    // Hash passord
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Passord, saltRounds);

    const q = "INSERT INTO Tjenesteeier (Bedrift, Mail, Passord) VALUES (?, ?, ?)";
    const values = [Bedrift, Mail, hashedPassword];

    db.query(q, values, (err, result) => {
      if (err) {
        console.error("SQL-feil:", err);
        return res.status(500).json({ error: "Kunne ikke opprette tjenesteeier" });
      }
      return res.status(201).json({ 
        message: "Tjenesteeier opprettet!",
        TjenesteeierID: result.insertId 
      });
    });
  } catch (error) {
    console.error("Feil ved oppretting av tjenesteeier:", error);
    return res.status(500).json({ error: "Serverfeil" });
  }
};

export const deleteTjenesteeier = (req, res) => {
  const tjenesteeierID = req.params.TjenesteeierID;
  const q = "DELETE FROM Tjenesteeier WHERE TjenesteeierID = ?";

  db.query(q, [tjenesteeierID], (err) => {
    if (err) return res.status(500).json(err);
    return res.json("Tjenesteeier er slettet!");
  });
};
