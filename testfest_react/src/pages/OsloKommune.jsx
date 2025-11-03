import '../assets/styles/testfest-pages.css';
import { useTranslation } from 'react-i18next';

const OsloKommune = () => {
  const { t } = useTranslation();
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
                <div className="testfest-header">
                    <h1>{t('oslo.title')}</h1>
                    <p>{t('oslo.intro1')}</p>
                    <p>{t('oslo.intro2')}</p>
                </div>
  
                <div className="task-grid">
                    <div className="task-item">
                        <h2>{t('oslo.task1.title')}</h2>
                        <p>{t('oslo.task1.text')}</p>
                    </div>
  
                    <div className="task-item">
                        <h2>{t('oslo.task2.title')}</h2>
                        <p>{t('oslo.task2.text')}</p>
                    </div>
  
                    <div className="task-item">
                        <h2>{t('oslo.task3.title')}</h2>
                        <p>{t('oslo.task3.text')}</p>
                    </div>

                    <div className="task-item">
                        <h2>{t('oslo.task4.title')}</h2>
                        <p>{t('oslo.task4.text')}</p>
                    </div>
                </div>
            </div>
		
            <div className="side">
                <div className="program-schedule">
                    <h3>{t('oslo.program.title')}</h3>
                    <ul>
                        <li>{t('oslo.program.item1')}</li>
                        <li>{t('oslo.program.item2')}</li>
                        <li>{t('oslo.program.item3')}</li>
                        <li>{t('oslo.program.item4')}</li>
                        <li>{t('oslo.program.item5')}</li>
                        <li>{t('oslo.program.item6')}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default OsloKommune;