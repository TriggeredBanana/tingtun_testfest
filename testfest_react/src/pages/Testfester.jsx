import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

axios.defaults.withCredentials = true; // sends cookies automatically

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
        // Logged in user
      } else if (isAuthenticated) {
        // Waiting for user data
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


  // delete testfest, only for users and admin
  const handleDelete = async (TestfestID) => {
    if (!window.confirm(t('testfester.alert.confirm_delete') )) return;

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
      alert(t('testfester.alert.delete_err'));
    }
  };

    // Fetch programs (only for admin)
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
        // Update state locally so UI shows new choice without reload
        setTestfester(prev => prev.map(t => t.TestfestID === TestfestID ? { ...t, ProgramID } : t));
      } catch (err) {
        console.error("Kunne ikke tilordne program:", err);
        alert(t('testfester.alert.program_err'));
      } finally {
        setLoadingAssign(prev => ({ ...prev, [TestfestID]: false }));
      }
    };

// filter based on status
const kommende = testfester.filter(t => t.Status === "Kommende");
const tidligere = testfester.filter(t => t.Status === "Tidligere");

// If logged in user: split own/others testfests
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

      {/* === SUPERUSER VIEW === */}
      {ErSuperbruker && (
        <section>
          <div className="section-header">
            <h2>{t('testfester.all_testfest')}</h2>
            <button className="button-link" onClick={() => navigate(`/addTestfester`)}>
              {t('testfester.add_testfest')}
            </button>
          </div>
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
                          <option value="">{t('testfester.chose_program')}</option>
                          {programmer.map(program => (
                            <option key={program.ProgramID} value={program.ProgramID}>
                              {program.Navn}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button className="button-edit" aria-label={`Rediger testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); navigate(`/addTestfester/${testfest.TestfestID}`); }}>
                        {t('common.edit')}
                      </button>
                      <button className="button-delete" aria-label={`Slett testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); handleDelete(testfest.TestfestID); }}>
                        {t('common.delete')}
                      </button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('testfester.no_testfest')}</p>
          )}
        </section>
      )}
            {/* === USER VIEW === */}
      {!ErSuperbruker && isAuthenticated && (
        <>
        <section>
          <div className="section-header">
            <h2>{t('testfester.own_testfest')}</h2>
            <button className="button-link" onClick={() => navigate(`/addTestfester`)}>
              {t('testfester.add_testfest')}
            </button>
          </div>
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
                        {t('common.edit')}
                      </button>
                      <button className="button-delete" aria-label={`Slett din testfest for ${testfest.BedriftNavn}`} onClick={(e) => { e.preventDefault(); handleDelete(testfest.TestfestID); }}>
                        {t('common.delete')}
                      </button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('testfester.no_own_testfest')}</p>
          )}
          </section>
          <section>
          <h2>{t('testfester.other_testfest')}</h2>
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
            <p>{t('testfester.no_other_testfest')}</p>
          )}
          </section>
        </>
      )}
            {/* === NOT LOGGED IN VIEW === */}
      {!isAuthenticated && (
        <>
        <section>
          <h2>{t('testfester.present_testfest')}</h2>
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
            <p>{t('testfester.no_present_testfest')}</p>
          )}
          </section>
          <section>
          <h2>{t('testfester.past_testfest')}</h2>
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
            <p>{t('testfester.no_past_testfest')}</p>
          )}
          </section>
        </>
      )}
    </div>
  ); 
};

export default Testfester;