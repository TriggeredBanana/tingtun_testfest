import '../assets/styles/addTestfest.css';
import '../assets/styles/styles.css';
import axios from 'axios';
import React from 'react';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const AddTestfester = ({ onClose, onAdded }) => {
  const { currentUser } = useAuth(); // Hent innlogget bruker
  const navigate = useNavigate();
  const { TestfestID } = useParams();

  const [testfester,setTestfester] = useState({
      Dato: "",
      Status: "Kommende",
      BrukerID: "",
    });
    
  const [testfestID, setTestfestID] = useState(null);

  // useEffect for å hente testfest ved redigering
  useEffect(() => {
    const hentTestfest = async () => {
      if (!TestfestID) return; // Bare ved redigering
      
      try {
        const res = await axios.get(`http://localhost:8800/testfester/${TestfestID}`, {
          withCredentials: true
        });
        setTestfester(res.data);
        setTestfestID(res.data.TestfestID);
        console.log("Redigerer testfest:", res.data);
      } catch (err) {
        console.error("Kunne ikke hente testfest:", err);
        alert("Kunne ikke hente testfest-data.");
      }
    };

    hentTestfest();
  }, [TestfestID]);

  // useEffect for å sjekke autentisering
  useEffect(() => {
    if (!currentUser) {
      alert("Du må være logget inn!");
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) =>{
     setTestfester(prev=>({...prev, [e.target.name]: e.target.value}))
    }
  const handleClick = async e => {
        e.preventDefault();
        if (!currentUser || !currentUser.BrukerID) {
            alert("Du må være logget inn for å opprette en testfest!");
            navigate('/login');
            return;
        }

        const testfestData = {
        ...testfester,
        BrukerID: currentUser.BrukerID
      };

      try {
        if (TestfestID) {
          //Oppdater eksisterende
          await axios.put(`http://localhost:8800/Testfester/${TestfestID}`, testfestData, 
            {withCredentials: true}
          );
          alert("Testfest oppdatert!");
          if (onAdded) onAdded(); 
          if (onClose) onClose();
        } else {
          // Opprett ny
          const res = await axios.post("http://localhost:8800/Testfester", testfestData, 
            {withCredentials: true}
          );
          const newID = (res.data.insertId || res.data.TestfestID);
          setTestfestID(newID);
          alert("Testfest opprettet! Du kan nå legge til oppgaver.");

        }
      } catch (err) {
          console.log("Feil ved oppretting av testfest:", err);
          alert("Kunne ikke opprette testfest. Prøv igjen.");
        }
    }

    const [oppgaver, setOppgaver] = useState([
    { Tittel: "", Beskrivelse: "" }
    ]);

    //lagre alle oppgaver
    const handleSaveOppgaver = async () => {
     if (!testfestID) 
      return alert("Opprett testfest først!");

    const oppgaverMedID = oppgaver.map(o => ({
        ...o,
        TestfestID: testfestID
    }));

    try {
        await axios.post("http://localhost:8800/Oppgaver", oppgaverMedID,
          {withCredentials: true}
        );
        alert("Oppgaver lagret!");
        navigate(`/testfester/${testfestID}`); 
    } catch (err) {
        console.log("Feil ved lagring av oppgaver:", err);
    }
    };
        
    const handleOppgaveChange = (index, field, value) => {
    const nyeOppgaver = [...oppgaver];
    nyeOppgaver[index] = {
      ...nyeOppgaver[index],
      [field]: value
    };
    setOppgaver(nyeOppgaver);
  };
    //legg til ny Oppgave
    const addOppgave = () => {
        setOppgaver([...oppgaver, { Tittel: "", Beskrivelse: "" }]);
    };
    //fjern oppgave
    const removeOppgave = (index) => {
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

    console.log(testfester)
    
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
        name="Dato"
        value={testfester.Dato}
        required
      />
      
      {!testfestID ? (
        <div>
          <button type="button" onClick={handleClick}>
            {TestfestID ? "Oppdater testfest" : "Opprett testfest"}
          </button>
          {onClose && (
            <button type="button" onClick={onClose}>Avbryt</button>
          )}
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
                  placeholder="Oppgavetittel"
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

                <button
                  type="button"
                  onClick={() => removeOppgave(index)}
                  className="remove-btn"
                >
                  Fjern oppgave
                </button>
                <div>
                <button type="button" onClick={addOppgave} className="add-btn">
              + Legg til oppgave
            </button>
            <button type="button" onClick={handleSaveOppgaver}>
              Lagre oppgaver
            </button>
            </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
);
}

export default AddTestfester;