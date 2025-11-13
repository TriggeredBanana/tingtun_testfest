import '../assets/styles/addTestfest.css';
import '../assets/styles/styles.css';
import axios from 'axios';
import React from 'react';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

axios.defaults.withCredentials = true; // Sender cookies automatisk

const AddTestfester = ({ onClose }) => {
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
        alert("Kunne ikke hente testfest-data.");
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
            alert("Du må være logget inn for å opprette en testfest!");
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
          alert("Testfest oppdatert!");
        } else {
          // Opprett ny
          const res = await axios.post("http://localhost:8800/testfester", testfestData);
          const newID = res.data.TestfestID;
          setTestfestID(newID);
          alert("Testfest opprettet! Du kan nå legge til oppgaver.");

        }
      } catch (err) {
          console.log("Feil ved oppretting av testfest:", err);
          alert("Kunne ikke opprette testfest. Prøv igjen.");
        }
    }

//lagre alle endringer fra redigering eller opprett samtidig
const handleSaveAll = async () => {
  try {
    const idToUse = testfestID || Number(TestfestID); // Bruk enten state eller param
    if (!idToUse) return alert("Ingen testfest valgt.");

    // Oppdater testfest
    await axios.put(`http://localhost:8800/testfester/${idToUse}`, {
      Dato: testfester.Dato || "", 
      Status: testfester.Status
    });

    // del oppgaver i nye eller gamle
    const existing = oppgaver.filter(o => o.OppgaveID);
    const newOppgaver = oppgaver.filter(o => !o.OppgaveID); 

    // Oppdater eksisterende oppgaver
    for (const o of existing) {
      await axios.put(`http://localhost:8800/oppgaver/${o.OppgaveID}`, {
        Tittel: o.Tittel,
        Beskrivelse: o.Beskrivelse
      });
    }

    // legg til nye oppgaver
    if (newOppgaver.length > 0) {
      const nyMedID = newOppgaver.map(o => ({
        ...o,
        TestfestID: idToUse
      }));
      await axios.post("http://localhost:8800/oppgaver", nyMedID);
    }

    alert("Alle endringer ble lagret!");
    navigate(`/testfester/${idToUse}`);
  } catch (err) {
    console.error("Feil ved lagring:", err);
    alert("Noe gikk galt under lagring.");
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
      const bekreft = window.confirm("Er du sikker på at du vil slette denne oppgaven?");
      if (!bekreft) return;

      try {
        await axios.delete(`http://localhost:8800/oppgaver/${oppgave.OppgaveID}`);
      } catch (err) {
        console.error("Feil ved sletting av oppgave:", err);
        alert("Kunne ikke slette oppgaven.");
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
      <h1>{TestfestID ? "Rediger Testfest" : "Opprett Testfest"}</h1>
      {/* Vis hvem som oppretter */}
            {currentUser && (
                <p>Opprettes av: <strong>{currentUser.Navn}</strong></p>
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
            Avbryt
          </button>
          <button type="button" onClick={handleClick} className="create-btn" aria-label={TestfestID ? "Oppdater testfest" : "Opprett testfest"}>
            {TestfestID ? "Oppdater testfest" : "Opprett testfest"}
          </button>
        </div>
    ) : (<>
          <section className="oppgaver-section">
            <h2>Legg til oppgaver</h2>

            {oppgaver.map((oppgave, index) => (
              <div key={index} className="oppgave-input">
                <h3>Oppgave {index + 1}</h3>
                <label>Tittel:</label>
                <input
                  type="text"
                  placeholder="Oppgave tittel"
                  value={oppgave.Tittel}
                  onChange={(e) =>
                    handleOppgaveChange(index, "Tittel", e.target.value)
                  }
                />

                <label>Beskrivelse:</label>
                <textarea
                  placeholder="Beskrivelse"
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
                    Fjern oppgave
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const oppgave = oppgaver[index];
                      const idToUse = testfestID || Number(TestfestID);
                      if (!idToUse) return alert("Ingen testfest valgt.");
                      
                      try {
                        if (oppgave.OppgaveID) {
                          await axios.put(`http://localhost:8800/oppgaver/${oppgave.OppgaveID}`, {
                            Tittel: oppgave.Tittel,
                            Beskrivelse: oppgave.Beskrivelse
                          });
                          alert("Oppgave oppdatert!");
                        } else {
                          const res = await axios.post("http://localhost:8800/oppgaver", [{
                            ...oppgave,
                            TestfestID: idToUse
                          }]);
                          const nyeOppgaver = [...oppgaver];
                          nyeOppgaver[index] = { ...oppgave, OppgaveID: res.data[0]?.OppgaveID };
                          setOppgaver(nyeOppgaver);
                          alert("Oppgave lagret!");
                        }
                      } catch (err) {
                        console.error("Feil ved lagring av oppgave:", err);
                        alert("Kunne ikke lagre oppgaven.");
                      }
                    }}
                    className="save-btn"
                    aria-label={`Lagre oppgave ${index + 1}`}
                  >
                    Lagre oppgave
                  </button>
                </div>
              </div>
            ))}
          </section>
          <div className="action-buttons-container">
            <button type="button" onClick={addOppgave} className="add-btn" aria-label="Legg til ny oppgave">
              + Legg til oppgave
            </button>
            <div className="button-row">
              <button type="button" onClick={() => navigate('/testfester')} className="cancel-btn" aria-label="Avbryt og gå tilbake">
                Avbryt
              </button>
              <button type="button" onClick={handleSaveAll} className="save-all-btn" aria-label="Lagre testfest">
                Lagre testfest
              </button>
            </div>
          </div>
        </>
      )}
    </div>
);
}

export default AddTestfester;