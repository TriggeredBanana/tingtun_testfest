import { useParams, useNavigate } from "react-router-dom";
import '../assets/styles/styles.css';
import '../assets/styles/testfest.css';
import '../assets/styles/testfest-pages.css';
import { useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true; //sender cookies automatisk

const TestfestDetaljer = () => {
  const { TestfestID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, ErSuperbruker, currentUser } = useAuth();
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
    
  const canEdit = isAuthenticated && (ErSuperbruker || (currentUser && Number(testfest.BrukerID) === Number(currentUser.BrukerID)));

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
              Rediger testfest
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
              <h4>{programmer.Navn || "Ukjent program"}</h4>
              <ul>
                <li>{programmer.Punkter || "Ingen punkter for dette programmet"}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default TestfestDetaljer;