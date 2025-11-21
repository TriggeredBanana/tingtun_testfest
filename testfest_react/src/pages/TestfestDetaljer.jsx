import '../assets/styles/styles.css';
import '../assets/styles/testfest-pages.css';
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

axios.defaults.withCredentials = true; // sends cookies automatically

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

            // Fetch tasks for this testfest
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
      } // wait until programID exists
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
      alert(t('testfester.alert.log_updated'));
    } catch (err) {
      console.error("Feil ved lagring av logg:", err);
      alert(err.response?.data?.error || t('testfester.alert.save_log_err'));
    } finally {
      setSavingLogg(false);
    }
  };

  return (
    <div className="container">
      <div className="testfest-detail">
        <h1>{testfest.BedriftNavn || "Ukjent testfest"}</h1>
        <div className="testfest-header-row">
          <p className="testfest-date"><strong>{t('common.date')}</strong> {new Date(testfest.Dato).toLocaleDateString("no-NO")}</p>
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
            <h2>{t('testfester.tasks')}</h2>
            {oppgaver.length > 0 ? (
              <div className="oppgaver-list">
                {oppgaver.map((oppgave, index) => (
                  <div key={oppgave.OppgaveID} className="oppgave-card">
                    <h3>{t('add.form.task')} {index + 1}: {oppgave.Tittel}</h3>
                    <p>{oppgave.Beskrivelse}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>{t('testfester.no_task')}</p>
            )}
          </section>
          <aside className="program-sidebar">
            <div className="program-schedule">
              <h3>{t('testfester.tonight_program')}</h3>
              <h4>{programmer.Navn || t('testfester.no_program')}</h4>
              <ul>
                <li>{programmer.Punkter || t('testfester.no_points')}</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ===== LOG SECTION ===== */}
        {canAccessLog() ? (
          <section className="logg-section">
            <h2>{t('testfester.log_testfest')}</h2>
            
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
                  {t('testfester.edit_log')}
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={logg}
                  onChange={(e) => setLogg(e.target.value)}
                  placeholder={t('testfester.placeholder_log')}
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
                    {savingLogg ? t('admin.form.save_loading') : t('testfester.save_log')}
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
                      {t('admin.form.cancel')}
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        ) : isAuthenticated ? (
          <p className="logg-message">
            {t('testfester.log_visibility')}
          </p>
        ) : (
          <p className="logg-message">
            {t('testfester.log_loggedin')}
          </p>
        )}
      </div>
    </div>
  );
}

export default TestfestDetaljer;