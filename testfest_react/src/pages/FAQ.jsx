import { useState } from 'react';
import deltakereImg from '../assets/images/deltakere.jpg';
import '../assets/styles/styles.css';
import '../assets/styles/faq.css';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(Array(7).fill(false));

  // Bytt åpen/lukket for valgt element
  const toggle = (i) => {
    setOpen((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <h1>{t('faq.title')}</h1>

          <div className="checklist-section">
            <ol>
              {Array.from({ length: 7 }).map((_, i) => {
                const answerId = `faq-answer-${i}`;
                return (
                  <li key={i} className="expandable-item">
                    <button
                      className="expand-button"
                      onClick={() => toggle(i)}
                      aria-expanded={open[i]}
                      aria-controls={answerId}
                    >
                      <b>{t(`faq.q${i + 1}`)}</b>
                      <span className="expand-icon">{open[i] ? '−' : '+'}</span>
                    </button>
                    <div
                      id={answerId}
                      className={`expandable-content ${open[i] ? 'open' : ''}`}
                      hidden={!open[i]}
                    >
                      {/* Gjør det mulig å inkludere lenker i svarene */}
                      <div className="faq-answer-inner">
                        {i === 0 && <p>{t('faq.a1')}</p>}
                        {i === 1 && (
                          <>
                            <div className="media-link">
                              <a href="https://tingtun.no/static/videos//TF-installasjon-paa-mobil.MOV">{t('faq.a2_link')}</a>
                            </div>
                            <br />
                            <p>{t('faq.a2_thanks')}</p>
                            <p>{t('faq.a2_desc')}</p>
                          </>
                        )}
                        {i === 2 && <p>{t('faq.a3')}</p>}
                        {i === 3 && <p>{t('faq.a4')}</p>}
                        {i === 4 && <p>{t('faq.a5')}</p>}
                        {i === 5 && (
                          <p>
                            {t('faq.a6_prefix')}{' '}
                            <a href="https://html2canvas.hertzen.com/faq">{t('faq.a6_link_text')}</a>.
                          </p>
                        )}
                        {i === 6 && <p>{t('faq.a7')}</p>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="faq-resources">
            <h3>{t('faq.resources_title')}</h3>
            <p>{t('faq.resources_intro')}</p>
            <ul>
              <li>
                <a href="https://www.w3.org/Translations/WCAG21-no/">{t('faq.link_wcag')}</a>
              </li>
              <li>
                <a href="https://www.uutilsynet.no/">{t('faq.link_uutilsynet')}</a>
              </li>
              <li>
                <a href="https://www.uutilsynet.no/webdirektivet-wad/eus-webdirektiv-wad/265">{t('faq.link_wad')}</a>
              </li>
              <li>
                <a href="https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32016L2102">{t('faq.link_wad_eu')}</a>
              </li>
              <li>
                <a href="https://www.nkom.no/aktuelt/standarden-en-301-549-er-na-tilgjengelig-pa-norsk/">{t('faq.link_standard')}</a>
              </li>
              <li>
                <a href="https://testfest.no/PDF/Testfest-oversikt.pdf">{t('faq.link_presentation')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="side">
          <div className="intro-image">
            <img src={deltakereImg} alt={t('home.image_alt_participants')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;