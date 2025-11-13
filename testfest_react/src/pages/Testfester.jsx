import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; //sender cookies sendes automatisk

const Testfester = () => {
    const { t } = useTranslation();
    const [testfester,setTestfester] = useState([]);
    const [programmer, setProgrammer] = useState([]);
    const [loadingAssign, setLoadingAssign] = useState({});
    const { isAuthenticated, ErSuperbruker, currentUser, authLoading } = useAuth();
    const navigate = useNavigate();


useEffect(() => {
  const fetchAllTestfester = async () => {
    if (authLoading) return;
    try {
      let url = "http://localhost:8800/testfester"; 

      if (isAuthenticated && currentUser && currentUser.BrukerID) {
        // Innlogget bruker
      } else if (isAuthenticated) {
        // Venter på brukerdata
        return; 
      }

      const res = await axios.get(url);
      setTestfester(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAllTestfester();
}, [isAuthenticated, currentUser, authLoading]);


  //slette testfest, kun for brukere og admin
  const handleDelete = async (TestfestID) => {
    if (!window.confirm("Er du sikker på at du vil slette denne testfesten?")) return;

    try {
      await axios.delete(`http://localhost:8800/testfester/${TestfestID}`, {
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
          const res = await axios.get("http://localhost:8800/program");
          setProgrammer(res.data);
        } catch (err) {
          console.error("Feil ved henting av programmer:", err);
        }
      };
      fetchProgrammer();
    }
  }, [ErSuperbruker]);

    const handleAssignProgram = async (TestfestID, ProgramID) => {
      try {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: true }));
        await axios.put(`http://localhost:8800/testfester/${TestfestID}/program`, { 
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

if (currentUser === null && isAuthenticated) {
  return <p>Laster brukerdata...</p>;
}
   return (
    <div className="container main-content testfester-page">
      <h1>Testfester</h1>

      {/* === SUPERBRUKER-VISNING === */}
      {ErSuperbruker && (
        <section>
          <h2>Alle Testfester (Admin)</h2>
          {testfester.length > 0 ? (
            <ul className="testfester-list">
              {testfester.map(testfest => (
                <li className="testfester-item" key={testfest.TestfestID}>
                  <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    <div className="testfest-info">
                      {testfest.BedriftNavn || "Ukjent"} – {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </div>
                    <div className="item-actions">
                      <div className="assign-program" onClick={(e) => e.preventDefault()}>
                        <label htmlFor={`program-select-${testfest.TestfestID}`}>
                          Program:
                        </label>
                        <select
                          id={`program-select-${testfest.TestfestID}`}
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
                      </div>
                      <button className="button-edit" aria-label={`Rediger testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); navigate(`/addTestfester/${testfest.TestfestID}`); }}>
                        Rediger
                      </button>
                      <button className="button-delete" aria-label={`Slett testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); handleDelete(testfest.TestfestID); }}>
                        Slett
                      </button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen Testfester registrert</p>
          )}
        </section>
      )}
            {/* === BRUKER-VISNING === */}
      {!ErSuperbruker && isAuthenticated && (
        <>
        <section>
          <h2>Dine Testfester</h2>
          {egneTestfester.length > 0 ? (
            <ul className="testfester-list">
              {egneTestfester.map(testfest => (
                <li className="testfester-item" key={testfest.TestfestID}>
                  <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    <div className="testfest-info">
                      {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")} – {testfest.Status}
                    </div>
                    <div className="item-actions">
                      <button className="button-edit" aria-label={`Rediger din testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); navigate(`/addTestfester/${testfest.TestfestID}`); }}>
                        Rediger
                      </button>
                      <button className="button-delete" aria-label={`Slett din testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); handleDelete(testfest.TestfestID); }}>
                        Slett
                      </button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Du har ingen egne Testfester</p>
          )}
          </section>
          <section>
          <h2>Andre Testfester</h2>
          {andresTestfester.length > 0 ? (
            <ul className="testfester-list">
              {andresTestfester.map(testfest => (
                <li className="testfester-item" key={testfest.TestfestID}>  
                  <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    <div className="testfest-info">
                      {testfest.BedriftNavn || "Ukjent"} – {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen andre Testfester</p>
          )}
          </section>
        </>
      )}
            {/* === IKKE INNLOGGET-VISNING === */}
      {!isAuthenticated && (
        <>
        <section>
          <h2>Kommende Testfester</h2>
          {kommende.length > 0 ? (
             <ul className="testfester-list">
              {kommende.map(testfest => (
                <li className="testfester-item" key={testfest.TestfestID}>
                  <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    <div className="testfest-info">
                      {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen kommende testfester</p>
          )}
          </section>
          <section>
          <h2>Tidligere Testfester</h2>
          {tidligere.length > 0 ? (
            <ul className="testfester-list">
              {tidligere.map(testfest => (
                <li className="testfester-item" key={testfest.TestfestID}>
                  <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                    <div className="testfest-info">
                      {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ingen tidligere Testfester</p>
          )}
          </section>
        </>
      )}
      {/* Opprett ny testfest – bare hvis innlogget */}
      {isAuthenticated && (
        <button className="button-link" onClick={() => navigate(`/addTestfester`)}>
          Opprett Testfest
        </button>
      )} 
    </div>
  ); 
};

export default Testfester;