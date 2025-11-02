import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import deltakereImg from '../assets/images/deltakere.jpg';
import '../assets/styles/styles.css';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ensure we start at top when entering the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // go to Testfester page
  const handleTestfestClick = () => {
    navigate('/testfester');
  };

  // scroll to the welcome heading, account for sticky header
  const handleReadMoreClick = () => {
    const target = document.querySelector('.welcome-section h1');
    if (!target) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const scrollTop = Math.max(0, targetTop - headerHeight - 8); // small gap
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  };

  return (
    <div className="container main-content">
      {/* hero fills viewport so underlying content is hidden initially */}
      <div className="hero-section">
        <h1>{t('home.hero_title')}</h1>
        <div className="button-container">
          <button 
            className="main-button read-more"
            onClick={handleReadMoreClick}
          >
            {t('home.button_read_more')}
          </button>
          <button 
            className="main-button testfest"
            onClick={handleTestfestClick}
          >
            {t('home.button_testfest')}
          </button>
        </div>
        <p className="hero-quote">
          {/* Quote placeholder */}
          Your quote will go here
        </p>
      </div>
      
      {/* existing page content kept as before */}
      <div className="content-section">
        <div className="row">
          <div className="main">
            <div className="welcome-section">
              <h1>{t('home.welcome_title')}</h1>
              <p>{t('home.welcome_paragraph1')}</p>
              <p>{t('home.welcome_paragraph2')}</p>
              <p>
                {t('home.welcome_paragraph3_part1')}{' '}
                <a href="https://navikt.github.io/mangfold-i-mai/events/testfest.html" target="_blank" rel="noopener noreferrer">
                  {t('home.welcome_mim_link_text')}
                </a>
                {t('home.welcome_paragraph3_part2')}
              </p>
              <p>
                {t('home.welcome_paragraph4_part1')}{' '}
                <a href="https://www.linkedin.com/posts/tanyakovtun_last-week-i-had-the-opportunity-to-learn-activity-7267177431495557120-5xAE" target="_blank" rel="noopener noreferrer">
                  {t('home.welcome_summary_link_text')}
                </a>{' '}
                {t('home.welcome_paragraph4_part2')}{' '}
                <a href="https://ud2024.no/" target="_blank" rel="noopener noreferrer">
                  {t('home.welcome_ud_link_text')}
                </a>
                {t('home.welcome_paragraph4_part3')}
              </p>
            </div>

            <div className="highlight-box">
              <h3>{t('home.highlight_title')}</h3>
              <p>{t('home.highlight_text')}</p>
            </div>

            <div className="contact-info">
              <h2>{t('home.contact_title')}</h2>
              <p>{t('home.contact_phone_label')} 918 62 892</p>
              <p>{t('home.contact_email_label')} contact@tingtun.no</p>
            </div>
          </div>

          <div className="side">
            <div className="intro-image">
              <img src={deltakereImg} alt={t('home.image_alt_participants')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;