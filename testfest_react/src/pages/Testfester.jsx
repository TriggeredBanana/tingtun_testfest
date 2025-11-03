import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';

const Testfester = () => {
    const { t } = useTranslation();
    const [testfester,setTestfester] = useState([]);
    const [programmer, setProgrammer] = useState([]);
    const [loadingAssign, setLoadingAssign] = useState({});

    useEffect(()=> {
       const fetchAllTestfester = async ()=>{
        try{
            const res = await axios.get("http://localhost:8800/Testfester");
            setTestfester(res.data);
        } catch(err){
            console.log(err);
        }
       } 
       fetchAllTestfester();
    }, []);

    const handleDelete = async (TestfestID) => {
      // Vis bekreftelsesdialog før sletting
      const bekreft = window.confirm("Er du sikker på at du vil slette denne testfesten?");

      if (!bekreft) {
        return; // Avbryt sletting
      }

      try {
        await axios.delete(`http://localhost:8800/Testfester/${TestfestID}`);
        alert("Testfest slettet!");
        window.location.reload();
      } catch (err) {
        console.error("Feil ved sletting:", err);
        alert("Kunne ikke slette testfesten. Prøv igjen senere.");
      }
    };

    useEffect(() => {
    const fetchProgrammer = async () => {
      try {
        const res = await axios.get("http://localhost:8800/Program");
        setProgrammer(res.data);
      } catch (err) {
        console.error("Feil ved henting av programmer:", err);
      }
    };
    fetchProgrammer();
  }, []);

    const handleAssignProgram = async (TestfestID, ProgramID) => {
      try {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: true }));
        await axios.put(`http://localhost:8800/Testfester/${TestfestID}/program`, { ProgramID });
        // Oppdater state lokalt slik at UI viser nytt valg uten reload
        setTestfester(prev => prev.map(t => t.TestfestID === TestfestID ? { ...t, ProgramID } : t));
      } catch (err) {
        console.error("Kunne ikke tilordne program:", err);
        alert("Noe gikk galt ved tilordning av program. Sjekk console.");
      } finally {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: false }));
      }
    };
  const kommendeTestfester = testfester.filter(t => t.Status === "Kommende");
  const tidligereTestfester = testfester.filter(t => t.Status === "Tidligere");

   return (
    <div className="container main-content">
      <h1>Testfester</h1>

      {/* Kommende testfester */}
      <div className="upcoming-section">
        <h2>Kommende Testfester</h2>
        {kommendeTestfester.length > 0 ? (
          kommendeTestfester.map(testfest => (
            <div className="testfester-list" key={testfest.TestfestID}>
              <h2>
                <ul className="testfester-list">
                  <li>
                    <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                      {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </Link>
                  </li>
                </ul>
              </h2>
          <div className="assign-program">
                <label>
                  {/* Vis nåværende programnavn */}
                  <div style={{ marginBottom: 6 }}>
                    Nåværende program:{" "}
                    {testfest.ProgramID
                      ? (programmer.find(p => p.ProgramID === testfest.ProgramID)?.Navn || `ID ${testfest.ProgramID}`)
                      : "Ingen"}
                  </div>

                  <select
                    value={testfest.ProgramID ?? ""}
                    onChange={(e) => handleAssignProgram(testfest.TestfestID, e.target.value ? Number(e.target.value) : null)}
                    disabled={loadingAssign[testfest.TestfestID]}
                  >
                    <option value="">Velg program </option>
                    {programmer.map(program => (
                      <option key={program.ProgramID} value={program.ProgramID}>
                        {program.Navn}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="delete" onClick={() => handleDelete(testfest.TestfestID)}>
                Slett
              </button>

            </div>
          ))
        ) : (
          <p>Ingen kommende testfester</p>
        )}
      </div>

      {/* Tidligere testfester */}
      <div className="previous-section">
        <h2>Tidligere Testfester</h2>
        {tidligereTestfester.length > 0 ? (
          tidligereTestfester.map(testfest => (
            <div className="testfester-list" key={testfest.TestfestID}>
              <h2>
                <ul className="testfester-list">
                  <li>
                    <Link to={`/testfester/${testfest.TestfestID}`} className="list-link">
                      {testfest.BedriftNavn || "Ukjent bedrift"} {new Date(testfest.Dato).toLocaleDateString("no-NO")}
                    </Link>
                  </li>
                </ul>
              </h2>
              <button className="delete" onClick={() => handleDelete(testfest.TestfestID)}>
                Slett
              </button>
            </div>
          ))
        ) : (
          <p>Ingen tidligere testfester</p>
        )}
      </div>

      {/* Statisk seksjon med tidligere testfester */}
      <div className="previous-section">
        <h2>Tidligere Testfester</h2>
        <ul className="testfester-list">
          <li><Link to="/oslokommune" className="list-link">Oslo kommune</Link></li>
          <li><Link to="/storebrand" className="list-link">Storebrand</Link></li>
          <li><Link to="/uio" className="list-link">Universitet i Oslo</Link></li>
        </ul>
      </div>

      {/* Knapp nederst */}
      <Link to="/addTestfester" className="button-link">
        Opprett testfest
      </Link>
    </div>
  );
};

export default Testfester;