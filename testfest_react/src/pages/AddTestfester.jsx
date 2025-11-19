import '../assets/styles/addTestfest.css';
import '../assets/styles/styles.css';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from 'react-i18next';

axios.defaults.withCredentials = true; // Sender cookies automatisk

const AddTestfester = ({}) => {
  const { t } = useTranslation();
  const { currentUser, authLoading } = useAuth(); // Hent innlogget bruker
  const navigate = useNavigate();
  const { TestfestID } = useParams();

  const [testfester,setTestfester] = useState({
      Dato: "",
      Status: "",
    });
    
  const [testfestID, setTestfestID] = useState(null);
  const [oppgaver, setOppgaver] = useState([{ Tittel: "", Beskrivelse: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [savedOppgaver, setSavedOppgaver] = useState(new Set());
  const [individuallySavedIndices, setIndividuallySavedIndices] = useState(new Set());
  
  // hente testfest og oppgaver ved redigering
  useEffect(() => {
    const hentTestfest = async () => {
      if (!TestfestID) return; // kun hvis ID ikke finnes 
      
      try {
        //hent testfestdata
        const res = await axios.get(`http://localhost:8800/testfester/${TestfestID}`);
        const data = res.data;

        //konverter dato
        const Dato = data.Dato ? data.Dato.split("T")[0] : "";
        setTestfester({
        Dato: Dato,
        Status: data.Status || "",
        });

        setTestfestID(res.data.TestfestID);
        setIsEditing(true);

        //hent oppgaver til testfest
        const oppgaverRes = await axios.get(`http://localhost:8800/oppgaver/${TestfestID}`);
        if (oppgaverRes.data && oppgaverRes.data.length > 0) {
          const oppgaverString = oppgaverRes.data.map(oppgave => ({
            ...oppgave,
            Tittel: oppgave.Tittel || "",
            Beskrivelse: oppgave.Beskrivelse || ""
          }));
          setOppgaver(oppgaverString);
        }

      } catch (err) {
        console.error("Kunne ikke hente testfest:", err);
        alert(t('add.alert.testfest_error'));
      }
    };

    hentTestfest();
  }, [TestfestID]);

  // useEffect for å sjekke autentisering
  useEffect(() => {
    if (!authLoading && !currentUser) {
      alert("Du må være logget inn!");
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  //opprett eller oppdater testfest uten oppgaver
  const handleClick = async e => {
        e.preventDefault();
        if (!currentUser || !currentUser.BrukerID) {
            alert(t('add.alert.loggedin'));
            navigate('/login');
            return;
        }

        const testfestData = {
        Dato: testfester.Dato,
        Status: testfester.Status
      };

      try {
        if (TestfestID) {
          // Oppdater eksisterende
          await axios.put(`http://localhost:8800/testfester/${TestfestID}`, testfestData);
          alert(t('add.alert.testfest_updated'));
        } else {
          // Opprett ny
          const res = await axios.post("http://localhost:8800/testfester", testfestData);
          const newID = res.data.TestfestID;
          setTestfestID(newID);
          alert(t('add.alert.testfest_added'));

        }
      } catch (err) {
          console.log("Feil ved oppretting av testfest:", err);
          alert(t('add.alert.testfest_err'));
        }
    }

//lagre alle endringer fra redigering eller opprett samtidig
const handleSaveAll = async () => {
  try {
    const idToUse = testfestID || Number(TestfestID); // Bruk enten state eller param
    if (!idToUse) return alert(t('add.alert.chose_testfest'));

    // Oppdater testfest
    await axios.put(`http://localhost:8800/testfester/${idToUse}`, {
      Dato: testfester.Dato || "", 
      Status: testfester.Status
    });

    // del oppgaver i nye eller gamle, men ekskluder allerede lagrede
    const existing = oppgaver.filter((o, idx) => o.OppgaveID && !savedOppgaver.has(o.OppgaveID) && !individuallySavedIndices.has(idx));
    const newOppgaver = oppgaver.filter((o, idx) => !o.OppgaveID && !individuallySavedIndices.has(idx)); 

    // Oppdater eksisterende oppgaver som ikke er lagret
    for (const o of existing) {
      await axios.put(`http://localhost:8800/oppgaver/${o.OppgaveID}`, {
        Tittel: o.Tittel,
        Beskrivelse: o.Beskrivelse
      });
    }

    // legg til nye oppgaver (bare de som ikke allerede er lagret individuelt)
    if (newOppgaver.length > 0) {
      const nyMedID = newOppgaver.map(o => ({
        ...o,
        TestfestID: idToUse
      }));
      await axios.post("http://localhost:8800/oppgaver", nyMedID);
    }

    alert(t('add.alert.saved_changes'));
    // Clear the individually saved indices since everything is now saved
    setIndividuallySavedIndices(new Set());
    navigate(`/testfester/${idToUse}`);
  } catch (err) {
    console.error("Feil ved lagring:", err);
    alert(t('add.alert.saved_err'));
  }
};
    //oppdater felt for en oppgave
    const handleOppgaveChange = (index, field, value) => {
    const nyeOppgaver = [...oppgaver];
    nyeOppgaver[index] = {
      ...nyeOppgaver[index],
      [field]: value
    };
    setOppgaver(nyeOppgaver);
  };
    // Legg til ny Oppgave
    const addOppgave = () => {
        setOppgaver([...oppgaver, { Tittel: "", Beskrivelse: "" }]);
    };

    //fjerne oppgaver fra database og UI
    const removeOppgave = async (index) => {
    const oppgave = oppgaver[index];

    // Hvis oppgaven finnes i databasen
    if (oppgave.OppgaveID) {
      const bekreft = window.confirm(t('add.alert.confirm_delete'));
      if (!bekreft) return;

      try {
        await axios.delete(`http://localhost:8800/oppgaver/${oppgave.OppgaveID}`);
      } catch (err) {
        console.error("Feil ved sletting av oppgave:", err);
        alert(t('add.alert.delete_err'));
        return; 
      }
    }

    // Fjern fra UI uansett
    const nyeOppgaver = oppgaver.filter((_, i) => i !== index);
    setOppgaver(nyeOppgaver);
  };

    // Bestem status basert på dato
    const handleDateChange = (e) => {
    const dato = e.target.value;
    
    const valgtDato = new Date(dato);
    const iDag = new Date();
    iDag.setHours(0, 0, 0, 0);
    
    const status = valgtDato > iDag ? "Kommende" : "Tidligere";

    setTestfester(prev => ({
      ...prev,
      Dato: dato,
      Status: status
    }))};
    
    return (
    <div className="modal-task">
      <h1>{TestfestID ? t('testfester.edit_testfest') : t('testfester.add_testfest')}</h1>
      {/* Vis hvem som oppretter */}
            {currentUser && (
                <p>{t('add.created_by')} <strong>{currentUser.Navn}</strong></p>
            )}
      <label>Dato:</label>
      <input
        type="date"
        onChange={handleDateChange}
        onClick={(e) => e.target.showPicker?.()}
        name="Dato"
        value={testfester.Dato || ""} 
        required
      />
      
      {!testfestID ? (
        <div className="initial-buttons">
          <button type="button" onClick={() => navigate('/testfester')} className="cancel-btn" aria-label="Avbryt">
            {t('admin.form.cancel')}
          </button>
          <button type="button" onClick={handleClick} className="create-btn" aria-label={TestfestID ? "Oppdater testfest" : "Opprett testfest"}>
            {TestfestID ? t('add.update_testfest') : t('testfester.add_testfest')}
          </button>
        </div>
    ) : (<>
          <section className="oppgaver-section">
            <h2>{t('add.add_task')} </h2>

            {oppgaver.map((oppgave, index) => (
              <div key={index} className="oppgave-input">
                <h3>{t('add.form.task')} {index + 1}</h3>
                <label>{t('add.form.title')}</label>
                <input
                  type="text"
                  placeholder={t('add.form.task_title')}
                  value={oppgave.Tittel}
                  onChange={(e) =>
                    handleOppgaveChange(index, "Tittel", e.target.value)
                  }
                />

                <label>{t('add.form.description')}</label>
                <textarea
                  placeholder={t('add.form.description')}
                  value={oppgave.Beskrivelse}
                  onChange={(e) =>
                    handleOppgaveChange(index, "Beskrivelse", e.target.value)
                  }
                ></textarea>

                <div className="oppgave-button-group">
                  <button
                    type="button"
                    onClick={() => removeOppgave(index)}
                    className="remove-btn"
                    aria-label={`Fjern oppgave ${index + 1}`}
                  >
                    {t('add.form.remove_task')}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const oppgave = oppgaver[index];
                      const idToUse = testfestID || Number(TestfestID);
                      if (!idToUse) return alert(t('add.alert.chose_testfest'));
                      
                      try {
                        if (oppgave.OppgaveID) {
                          await axios.put(`http://localhost:8800/oppgaver/${oppgave.OppgaveID}`, {
                            Tittel: oppgave.Tittel,
                            Beskrivelse: oppgave.Beskrivelse
                          });
                          setSavedOppgaver(prev => new Set([...prev, oppgave.OppgaveID]));
                          setIndividuallySavedIndices(prev => new Set([...prev, index]));
                          alert(t('add.alert.task_updated'));
                        } else {
                          const res = await axios.post("http://localhost:8800/oppgaver", [{
                            ...oppgave,
                            TestfestID: idToUse
                          }]);
                          const newOppgaveID = res.data[0]?.OppgaveID;
                          const nyeOppgaver = [...oppgaver];
                          nyeOppgaver[index] = { ...oppgave, OppgaveID: newOppgaveID };
                          setOppgaver(nyeOppgaver);
                          setSavedOppgaver(prev => new Set([...prev, newOppgaveID]));
                          setIndividuallySavedIndices(prev => new Set([...prev, index]));
                          alert(t('add.alert.task_saved'));
                        }
                      } catch (err) {
                        console.error("Feil ved lagring av oppgave:", err);
                        alert(t('add.alert.task_err'));
                      }
                    }}
                    className="save-btn"
                    aria-label={`Lagre oppgave ${index + 1}`}
                  >
                    {t('add.form.save_task')}
                  </button>
                </div>
              </div>
            ))}
          </section>
          <div className="action-buttons-container">
            <button type="button" onClick={addOppgave} className="add-btn" aria-label="Legg til ny oppgave">
              {t('add.form.add_tasks')}
            </button>
            <div className="button-row">
              <button type="button" onClick={() => navigate('/testfester')} className="cancel-btn" aria-label="Avbryt og gå tilbake">
                {t('admin.form.cancel')}
              </button>
              <button type="button" onClick={handleSaveAll} className="save-all-btn" aria-label="Lagre testfest">
                {t('add.form.save_testfest')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
);
}

export default AddTestfester;