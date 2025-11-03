import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import AddTestfester from "./AddTestfester";
import { useNavigate } from "react-router-dom";

const Testfester = () => {
    const { t } = useTranslation();
    const [testfester,setTestfester] = useState([]);
    const [programmer, setProgrammer] = useState([]);
    const [loadingAssign, setLoadingAssign] = useState({});
    const { isAuthenticated, ErSuperbruker, currentUser, authLoading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


useEffect(() => {
  const fetchAllTestfester = async () => {
    try {
      let url = "http://localhost:8800/Testfester"; 

      if (isAuthenticated && currentUser && currentUser.BrukerID) {
        console.log("Innlogget bruker:", currentUser);
        url += `?BrukerID=${currentUser.BrukerID}`;
      } else if (isAuthenticated) {
        console.log("Auth OK, men ingen brukerdata ennå → venter...");
        return; 
      } else {
        console.log("Ingen bruker logget inn → henter ALLE testfester");
      }

      console.log("API-kall:", url);

      const res = await axios.get(url);
      console.log("Data mottatt:", res.data);

      console.log("CurrentUser.BrukerID:", currentUser?.BrukerID, typeof currentUser?.BrukerID);
      res.data.forEach(t => {
        console.log(`Testfest ${t.TestfestID}: BrukerID=${t.BrukerID} (${typeof t.BrukerID}), matcher=${Number(t.BrukerID) === Number(currentUser?.BrukerID)}`);
      });
      
      setTestfester(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAllTestfester();
}, [isAuthenticated, currentUser]);


  //slette testfest, kun for brukere og admin
  const handleDelete = async (TestfestID) => {
    if (!window.confirm("Er du sikker på at du vil slette denne testfesten?")) return;

    try {
      await axios.delete(`http://localhost:8800/Testfester/${TestfestID}`, {
        data: {
          BrukerID: currentUser?.BrukerID,
          ErSuperbruker: ErSuperbruker
        }
      });
      alert("Testfest slettet!");
      setTestfester(prev => prev.filter(t => t.TestfestID !== TestfestID));
    } catch (err) {
      console.error("Feil ved sletting:", err);
      alert("Kunne ikke slette testfesten.");
    }
  };

    //Hent programmer (kun for admin)
   useEffect(() => {
    if (ErSuperbruker) {
      const fetchProgrammer = async () => {
        try {
          const res = await axios.get("http://localhost:8800/Program");
          setProgrammer(res.data);
        } catch (err) {
          console.error("Feil ved henting av programmer:", err);
        }
      };
      fetchProgrammer();
    }
  }, [ErSuperbruker]);

  //Kun tilgjengelig for admin
    const handleAssignProgram = async (TestfestID, ProgramID) => {
      try {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: true }));
        await axios.put(`http://localhost:8800/Testfester/${TestfestID}/program`, { 
          ProgramID,
          BrukerID: isAuthenticated?.BrukerID,
          ErSuperbruker: ErSuperbruker
        });
        // Oppdater state lokalt slik at UI viser nytt valg uten reload
        setTestfester(prev => prev.map(t => t.TestfestID === TestfestID ? { ...t, ProgramID } : t));
      } catch (err) {
        console.error("Kunne ikke tilordne program:", err);
        alert("Noe gikk galt ved tilordning av program. Sjekk console.");
      } finally {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: false }));
      }
    };

//filtrer basert på status
const kommende = testfester.filter(t => t.Status === "Kommende");
const tidligere = testfester.filter(t => t.Status === "Tidligere");

// Hvis innlogget bruker: del egne/andres testfester
let egneTestfester = [];
let andresTestfester = [];

if (isAuthenticated && currentUser && !ErSuperbruker) {
egneTestfester = testfester.filter(t => Number(t.BrukerID) === Number(currentUser.BrukerID));
andresTestfester = testfester.filter(t => Number(t.BrukerID) !== Number(currentUser.BrukerID));
}

// Debug
console.log("IsAuthenticated:", isAuthenticated);
console.log("erSuperbruker:", ErSuperbruker);

if (currentUser === null && isAuthenticated) {
  return <p>Laster brukerdata...</p>;
}
   return (
    <div className="container main-content">
      <h1>Testfester</h1>

      {/* === SUPERBRUKER-VISNING === */}
      {ErSuperbruker && (
        <>
        <div className="previous-section">
          <h2>Alle Testfester (Admin)</h2>
          {testfester.length > 0 ? (
            testfester.map(testfest => (
              <div className="testfester-item" key={testfest.TestfestID}>
                <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                  {testfest.BedriftNavn || "Ukjent"} – {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                </Link>

                <div className="assign-program">
                  <label>
                    Nåværende program:{" "}
                    {testfest.ProgramID
                      ? (programmer.find(p => p.ProgramID === testfest.ProgramID)?.Navn || `ID ${testfest.ProgramID}`)
                      : "Ingen"}
                    <select
                      value={testfest.ProgramID ?? ""}
                      onChange={(e) => handleAssignProgram(testfest.TestfestID, Number(e.target.value) || null)}
                      disabled={loadingAssign[testfest.TestfestID]}
                    >
                      <option value="">Velg program</option>
                      {programmer.map(program => (
                        <option key={program.ProgramID} value={program.ProgramID}>
                          {program.Navn}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button className="rediger" onClick={() => navigate(`/addTestfester/${testfest.TestfestID}`)}>
                Rediger
              </button>
                <button className="delete" onClick={() => handleDelete(testfest.TestfestID)}>
                  Slett
                </button>
              </div>
            ))
          ) : (
            <p>Ingen Testfester registrert</p>
          )}
          </div>
        </>
      )}
            {/* === BRUKER-VISNING === */}
      {!ErSuperbruker && isAuthenticated && (
        <>
        <div className="previous-section">
          <h2>Dine Testfester</h2>
          {egneTestfester.length > 0 ? (
            egneTestfester.map(testfest => (
              <div className="testfester-item" key={testfest.TestfestID}>
                <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                 {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")} – {testfest.Status}
                </Link>
                <button className="rediger" onClick={() => navigate(`/testfester/${testfest.TestfestID}`)}>
                Rediger
              </button>
                <button className="delete" onClick={() => handleDelete(testfest.TestfestID)}>
                  Slett
                </button>
              </div>
            ))
          ) : (
            <p>Du har ingen egne Testfester</p>
          )}
          </div>
          <div className="previous-section">
          <h2>Andre Testfester</h2>
          {andresTestfester.length > 0 ? (
            andresTestfester.map(testfest => (
              <div className="testfester-list" key={testfest.TestfestID}>
                <ul className="testfester-list">
                <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                  {testfest.BedriftNavn || "Ukjent"} – {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                </Link>
                </ul>
              </div>
            ))
          ) : (
            <p>Ingen andre Testfester</p>
          )}
          </div>
        </>
      )}
            {/* === IKKE INNLOGGET-VISNING === */}
      {!isAuthenticated && (
        <>
        <div className="previous-section">
          <h2>Kommende Testfester</h2>
          {kommende.length > 0 ? (
            kommende.map(testfest => (
              <div className="testfester-item" key={testfest.TestfestID}>
                <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                </Link>
              </div>
            ))
          ) : (
            <p>Ingen kommende testfester</p>
          )}
          </div>
          <h2>Tidligere Testfester</h2>
          <div className="previous-section">
          {tidligere.length > 0 ? (
            tidligere.map(testfest => (
              <div className="testfester-item" key={testfest.TestfestID}>
                <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                </Link>
              </div>
            ))
          ) : (
            <p>Ingen tidligere Testfester</p>
          )}
          </div>
        </>
      )}
      {/* Opprett ny testfest – bare hvis innlogget */}
      {isAuthenticated && (
        <button className="button-link" onClick={() => setShowModal(true)}>
          Opprett Testfest
        </button>
      )}

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AddTestfester 
              onClose={() => setShowModal(false)} 
              onAdded={() => window.location.reload()} 
            />
        </div>
        </div>    
      )}
    </div>
  ); 
};

export default Testfester;