import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/styles/veiledning.css';
import deltakereImg from '../assets/images/deltakere.jpg';

const Veiledning = () => {
  const { t } = useTranslation();

  const serviceOwner = t('veiledning.service_owner', { returnObjects: true });
  const tester = t('veiledning.tester', { returnObjects: true });

  const serviceOwnerSteps = Array.isArray(serviceOwner?.steps) ? serviceOwner.steps : [];
  const testerSteps = Array.isArray(tester?.steps) ? tester.steps : [];

  const [openServiceOwner, setOpenServiceOwner] = useState(Array(serviceOwnerSteps.length).fill(false));
  const [openTester, setOpenTester] = useState(Array(testerSteps.length).fill(false));

  const toggleServiceOwner = (i) => {
    setOpenServiceOwner(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const toggleTester = (i) => {
    setOpenTester(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <h1>{t('veiledning.title')}</h1>
          
          <div className="method-intro">
            <p>{t('veiledning.intro1')}</p>
            <p>{t('veiledning.intro2')}</p>
          </div>

          <div className="role-section service-owner">
            <div className="checklist-section">
              <h2>{serviceOwner?.title}</h2>
              <p>{serviceOwner?.intro1}</p>
              <p>{serviceOwner?.intro2}</p>
              <ol>
                {serviceOwnerSteps.map((step, i) => (
                  <li key={i} className="expandable-item">
                    <button 
                      className="expand-button"
                      onClick={() => toggleServiceOwner(i)}
                      aria-expanded={openServiceOwner[i]}
                      aria-controls={`service-owner-content-${i}`}
                    >
                      <b>{step.title}</b>
                      <span className="expand-icon">{openServiceOwner[i] ? '−' : '+'}</span>
                    </button>
                    <div 
                      id={`service-owner-content-${i}`}
                      className={`expandable-content ${openServiceOwner[i] ? 'open' : ''}`}
                      hidden={!openServiceOwner[i]}
                    >
                      {step.content && <p>{step.content}</p>}
                      {step.p && <p>{step.p}</p>}
                      {Array.isArray(step.items) && step.items.length > 0 && (
                        <ul>
                          {step.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {step.p2 && <p>{step.p2}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="role-section tester">
            <div className="checklist-section">
              <h2>{tester?.title}</h2>
              <p>{tester?.intro1}</p>
              <p>{tester?.intro2}</p>
              <ol>
                {testerSteps.map((step, i) => (
                  <li key={i} className="expandable-item">
                    <button 
                      className="expand-button"
                      onClick={() => toggleTester(i)}
                      aria-expanded={openTester[i]}
                      aria-controls={`tester-content-${i}`}
                    >
                      <b>{step.title}</b>
                      <span className="expand-icon">{openTester[i] ? '−' : '+'}</span>
                    </button>
                    <div 
                      id={`tester-content-${i}`}
                      className={`expandable-content ${openTester[i] ? 'open' : ''}`}
                      hidden={!openTester[i]}
                    >
                      {step.content && <p>{step.content}</p>}
                      {step.p && <p>{step.p}</p>}
                      {Array.isArray(step.items) && step.items.length > 0 && (
                        <ul>
                          {step.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {step.p2 && <p>{step.p2}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        
        <div className="side">
          <div className="intro-image">
            <img src={deltakereImg} alt={t('veiledning.image_alt')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Veiledning;