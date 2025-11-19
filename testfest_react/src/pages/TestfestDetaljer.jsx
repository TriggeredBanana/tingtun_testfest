import '../assets/styles/styles.css';
import '../assets/styles/testfest-pages.css';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

axios.defaults.withCredentials = true; //sender cookies automatisk

const TestfestDetaljer = () => {
  const { t } = useTranslation();
  const { TestfestID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, ErSuperbruker, currentUser } = useAuth();
  const [testfest, setTestfester] = useState({});
  const [oppgaver, setOppgaver] = useState([]);
  const [programmer, setProgram] = useState({});
  const [logg, setLogg] = useState("");
  const [savingLogg, setSavingLogg] = useState(false);
  const [editingLogg, setEditingLogg] = useState(false);

  useEffect(()=> {
       const fetchData = async ()=>{
        try{
            const testfestRes = await axios.get(`http://localhost:8800/testfester/${TestfestID}`);
            setTestfester(testfestRes.data);
            setLogg((testfestRes.data && testfestRes.data.Logg) ? testfestRes.data.Logg : "");

            // Hent oppgaver for denne testfesten
            const oppgaverRes = await axios.get(`http://localhost:8800/oppgaver/${TestfestID}`);
            setOppgaver(oppgaverRes.data);
        } catch(err){
            console.log(err);
        }
       } 
       fetchData();
    }, [TestfestID]);
      
    
    useEffect(() => {
      if (!testfest.ProgramID) {
        console.log("Ingen ProgramID funnet for denne testfesten.");
        return;
      } // vent til programID finnes
      const fetchProgram = async () => {
        try {
          const programRes = await axios.get(`http://localhost:8800/program/${testfest.ProgramID}`);
          setProgram(programRes.data);
        } catch (err) {
          console.log("Feil ved henting av program:", err);
        }
      };
      fetchProgram();
}, [testfest.ProgramID]);
    
  const canEdit = isAuthenticated && (ErSuperbruker || (currentUser && Number(testfest.BrukerID) === Number(currentUser.BrukerID)));

  // Check if current user can see/edit the log
  const canAccessLog = () => {
    if (!isAuthenticated || !currentUser) return false;
    
    // Superuser can always access
    if (currentUser.ErSuperbruker) return true;
    
    // Owner can access their own testfest
    if (testfest.BrukerID && Number(currentUser.BrukerID) === Number(testfest.BrukerID)) return true;
    
    return false;
  };

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
      setEditingLogg(false);
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
        <div className="testfest-header-row">
          <p className="testfest-date"><strong>Dato:</strong> {new Date(testfest.Dato).toLocaleDateString("no-NO")}</p>
          {canEdit && (
            <button 
              className="edit-testfest-btn" 
              onClick={() => navigate(`/addTestfester/${TestfestID}`)}
              aria-label="Rediger testfest"
            >
              {t('testfester.edit_testfest')}
            </button>
          )}
        </div>
        <div className="testfest-content-grid">
          <section className="oppgaver-section">
            <h2>Oppgaver</h2>
            {oppgaver.length > 0 ? (
              <div className="oppgaver-list">
                {oppgaver.map((oppgave, index) => (
                  <div key={oppgave.OppgaveID} className="oppgave-card">
                    <h3>Oppgave {index + 1}: {oppgave.Tittel}</h3>
                    <p>{oppgave.Beskrivelse}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Ingen oppgaver for denne testfesten</p>
            )}
          </section>
          <aside className="program-sidebar">
            <div className="program-schedule">
              <h3>Kveldens program</h3>
              <h4>{programmer.Navn || "Ingen program for denne Testfesten"}</h4>
              <ul>
                <li>{programmer.Punkter || "Ingen punkter for dette programmet"}</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ===== LOGG SECTION ===== */}
        {canAccessLog() ? (
          <section className="logg-section">
            <h2>Logg for testfesten</h2>
            
            {testfest.Logg && !editingLogg ? (
              <div className="vis-logg">
                <div className="logg-content">
                  {testfest.Logg}
                </div>
                <button 
                  className="edit-logg-btn"
                  onClick={() => setEditingLogg(true)}
                  aria-label="Rediger logg"
                >
                  Rediger logg
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={logg}
                  onChange={(e) => setLogg(e.target.value)}
                  placeholder="Skriv hvordan testfesten gikk og hva som kunne vært bedre..."
                  rows={6}
                  className="logg-textarea"
                  disabled={savingLogg}
                />
                <div className="logg-buttons">
                  <button 
                    className="save-logg-btn"
                    onClick={handleSaveLogg} 
                    disabled={savingLogg}
                    aria-label="Lagre logg"
                  >
                    {savingLogg ? "Lagrer..." : "Lagre logg"}
                  </button>
                  {editingLogg && (
                    <button
                      type="button"
                      className="cancel-logg-btn"
                      onClick={() => {
                        setEditingLogg(false);
                        setLogg(testfest.Logg || "");
                      }}
                      aria-label="Avbryt redigering"
                    >
                      Avbryt
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        ) : isAuthenticated ? (
          <p className="logg-message">
            Du har ikke tilgang til å se logg for denne testfesten. Kun eieren av testfesten og administratorer kan se og redigere logg.
          </p>
        ) : (
          <p className="logg-message">
            Logg er kun tilgjengelig for innloggede brukere. Vennligst logg inn for å se og skrive logg.
          </p>
        )}
      </div>
    </div>
  );
}

export default TestfestDetaljer;