import { useParams, useNavigate } from "react-router-dom";
import '../assets/styles/styles.css';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true; // cookies sent automatically

const TestfestDetaljer = () => {
  const { TestfestID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, ErSuperbruker, currentUser } = useAuth();
  const [testfest, setTestfester] = useState({});
  const [oppgaver, setOppgaver] = useState([]);
  const [programmer, setProgram] = useState({});
  const [logg, setLogg] = useState("");
  const [savingLogg, setSavingLogg] = useState(false);
  const [editingLogg, setEditingLogg] = useState(false);

  // From your AuthContext - note: it's currentUser, not user
  const { currentUser, isAuthenticated } = useAuth();

  // Check if current user can see/edit the log
  const canAccessLog = () => {
    if (!isAuthenticated || !currentUser) return false;
    
    // Superuser can always access
    if (currentUser.ErSuperbruker) return true;
    
    // Owner can access their own testfest
    // Convert both to numbers to ensure comparison works
    if (testfest.BrukerID && Number(currentUser.BrukerID) === Number(testfest.BrukerID)) return true;
    
    return false;
  };

  // Debug: Log the values to see what's happening
  console.log("currentUser:", currentUser);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("Testfest:", testfest);
  console.log("Testfest.BrukerID:", testfest.BrukerID);
  if (currentUser) {
    console.log("currentUser.BrukerID:", currentUser.BrukerID);
    console.log("currentUser.ErSuperbruker:", currentUser.ErSuperbruker);
  }
  console.log("Can access log:", canAccessLog());

  // Fetch testfest + oppgaver
  useEffect(() => {
    const fetchData = async () => {
      try {
        const testfestRes = await axios.get(`http://localhost:8800/testfester/${TestfestID}`);
        setTestfester(testfestRes.data || {});
        setLogg((testfestRes.data && testfestRes.data.Logg) ? testfestRes.data.Logg : "");
        
        const oppgaverRes = await axios.get(`http://localhost:8800/oppgaver/${TestfestID}`);
        setOppgaver(oppgaverRes.data || []);
      } catch (err) {
        console.error("Feil ved henting av testfest/oppgaver:", err);
      }
    };
    fetchData();
  }, [TestfestID]);

  // Fetch program if programID exists
  useEffect(() => {
    if (!testfest.ProgramID) return;
    const fetchProgram = async () => {
      try {
        const programRes = await axios.get(`http://localhost:8800/program/${testfest.ProgramID}`);
        setProgram(programRes.data || {});
      } catch (err) {
        console.log("Feil ved henting av program:", err);
      }
    };
    fetchProgram();
  }, [testfest.ProgramID]);

  // Save log (PUT)
  const handleSaveLogg = async () => {
    try {
      setSavingLogg(true);
      await axios.put(
        `http://localhost:8800/testfester/${TestfestID}/logg`,
        { Logg: logg },
        { withCredentials: true }
      );

      // Update local copy so UI is in sync
      setTestfester(prev => ({ ...prev, Logg: logg }));
      setEditingLogg(false); // <-- close edit mode so saved log is shown
      alert("Logg oppdatert!");
    } catch (err) {
      console.error("Feil ved lagring av logg:", err);
      alert(err.response?.data?.error || "Kunne ikke lagre logg. Sjekk console for mer info.");
    } finally {
      setSavingLogg(false);
    }
  };
 
  return (
    <div className="container">
      <div className="testfest-detail">
        <h1>{testfest.BedriftNavn || "Ukjent testfest"}</h1>
        <div className="testfest-info">
          <p><strong>Dato:</strong> {testfest.Dato ? new Date(testfest.Dato).toLocaleDateString("no-NO") : ""}</p>
        </div>

        <section className="oppgaver-section">
          <h2>Oppgaver</h2>
          {oppgaver.length > 0 ? (
            <div className="oppgaver-list">
              {oppgaver.map((oppgave) => (
                <div key={oppgave.OppgaveID} className="oppgave-card">
                  <h3>{oppgave.Tittel}</h3>
                  <p>{oppgave.Beskrivelse}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Ingen oppgaver for denne testfesten</p>
          )}
        </section>

        <div className="side">
          <div className="program-schedule">
            <h3>Punkter for kveldens program:</h3>
            <h3>{programmer.Navn || "ukjent program"}</h3>
            <ul>
              <li>{programmer.Punkter || "ingen punkter for dette programmet"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== LOGG SECTION =====
          - Only visible to the testfest owner or superusers.
          - Other authenticated users will see a message that they don't have access.
          - Unauthenticated visitors see a prompt to login.
      */}
      {canAccessLog() ? (
        <section className="logg-section">
          <h2>Logg for testfesten</h2>
          
          {/* If logg exists and isnt editing, show just the saved logg */}
          {testfest.Logg && !editingLogg ? (
            <div className="vis-logg" style={{ padding: "1rem", background: "#f8f8f8", borderRadius: "4px", marginBottom: "1rem" }}>
              <div style={{ whiteSpace: "pre-wrap", color: "#333", marginBottom: "1rem" }}>
                {testfest.Logg}
              </div>
              <button onClick={() => setEditingLogg(true)}>
                Rediger logg
              </button>
            </div>
          ) : (
            /* If no logg or editing, show textarea */
            <>
              <textarea
                value={logg}
                onChange={(e) => setLogg(e.target.value)}
                placeholder="Skriv hvordan testfesten gikk og hva som kunne vært bedre..."
                rows={6}
                className="logg-textarea"
                disabled={savingLogg}
              />
              <button onClick={handleSaveLogg} disabled={savingLogg}>
                {savingLogg ? "Lagrer..." : "Lagre logg"}
              </button>
              {/* If editing, show avbryt(cancel)-button */}
              {editingLogg && (
                <button
                  type="button"
                  style={{ marginLeft: "1rem" }}
                  onClick={() => {
                    setEditingLogg(false);
                    setLogg(testfest.Logg || "");
                  }}
                >
                  Avbryt
                </button>
              )}
            </>
          )}
        </section>
      ) : isAuthenticated ? (
        <p style={{ marginTop: "1rem", color: "#555" }}>
          Du har ikke tilgang til å se logg for denne testfesten. Kun eieren av testfesten og administratorer kan se og redigere logg.
        </p>
      ) : (
        <p style={{ marginTop: "1rem", color: "#555" }}>
          Logg er kun tilgjengelig for innloggede brukere. Vennligst logg inn for å se og skrive logg.
        </p>
      )}
    </div>
  );
};

export default TestfestDetaljer;