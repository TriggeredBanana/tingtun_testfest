import { useParams } from "react-router-dom";
import '../assets/styles/styles.css';
import { useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; //sender cookies automatisk

const TestfestDetaljer = () => {
  const { TestfestID } = useParams();
  const [testfest, setTestfester] = useState({});
  const [oppgaver, setOppgaver] = useState([]);
  const [programmer, setProgram] = useState({});

  useEffect(()=> {
       const fetchData = async ()=>{
        try{
            const testfestRes = await axios.get(`http://localhost:8800/testfester/${TestfestID}`);
            setTestfester(testfestRes.data);

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
    

  return (
    <div className="container">
      <div className="testfest-detail">
 
        <h1>{testfest.BedriftNavn || "Ukjent testfest"}</h1>
        <div className="testfest-info">
        <p><strong>Dato:</strong> {new Date(testfest.Dato).toLocaleDateString("no-NO")}</p>
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
    </div>
  );
}

export default TestfestDetaljer;