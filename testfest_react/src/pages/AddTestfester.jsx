import '../assets/styles/addTestfest.css';
import '../assets/styles/styles.css';
import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';


const AddTestfester = () => {
    const [testfester,setTestfester] = useState({
        Dato: "",
        Status: "Kommende",
        TjenesteeierID: "",
    });
    
    const [testfestID, setTestfestID] = useState();

    const [oppgaver, setOppgaver] = useState([
    { Tittel: "", Beskrivelse: "" }
    ]);

  

    const handleChange = (e) =>{
        setTestfester(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    const handleClick = async e => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8800/Testfester", testfester);
            setTestfestID(res.data.insertId); // lagre ID fra backend
            alert("Testfest opprettet! Du kan nå legge til oppgaver.");
        } catch (err) {
            console.log("Feil ved oppretting av testfest:", err);
        }
    }
    const handleSaveOppgaver = async () => {
  if (!testfestID) return alert("Opprett testfest først!");

    const oppgaverMedID = oppgaver.map(o => ({
        ...o,
        TestfestID: testfestID
    }));

    try {
        await axios.post("http://localhost:8800/Oppgaver", oppgaverMedID);
        alert("Oppgaver lagret!");
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

    const addOppgave = () => {
        setOppgaver([...oppgaver, { Tittel: "", Beskrivelse: "" }]);
    };

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
  <div className="form">
    <h1>Opprett Testfest</h1>

    <label>Dato:</label>
    <input
      type="date"
      onChange={handleDateChange}
      name="Dato"
      value={testfester.Dato}
      required
    />
    <input
      type="text"
      placeholder="TjenesteeierID"
      onChange={handleChange}
      name="TjenesteeierID"
    />

    {!testfestID ? (
      <button type="button" onClick={handleClick}>Opprett testfest</button>
    ) : (
      <>
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
            </div>
          ))}

          <button type="button" onClick={addOppgave} className="add-btn">
            + Legg til oppgave
          </button>

          <button type="button" onClick={handleSaveOppgaver}>
            Lagre oppgaver
          </button>
        </section>
      </>
    )}
  </div>
);
}

export default AddTestfester;