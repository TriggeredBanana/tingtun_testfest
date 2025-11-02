import '../assets/styles/testfest-pages.css';
import { useTranslation } from 'react-i18next';

const Storebrand = () => {
  const { t } = useTranslation();
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <div className="testfest-header">
                    <h1>{t('storebrand.title')}</h1>
                    <p>{t('storebrand.intro1')}</p>
                    <p>{t('storebrand.intro2')}</p>
                </div>
  
                <div className="task-grid">
                    <div className="task-item financial-task">
                        <h2>{t('storebrand.task1.title')}</h2>
                        <p>{t('storebrand.task1.text')}</p>
                    </div>
  
                    <div className="task-item financial-task">
                        <h2>{t('storebrand.task2.title')}</h2>
                        <p>{t('storebrand.task2.text')}</p>
                    </div>
  
                    <div className="task-item financial-task">
                        <h2>{t('storebrand.task3.title')}</h2>
                        <p>{t('storebrand.task3.text')}</p>
                    </div>

                    <div className="task-item financial-task">
                        <h2>{t('storebrand.task4.title')}</h2>
                        <p>{t('storebrand.task4.text')}</p>
                    </div>

                    <div className="task-item financial-task">
                        <h2>{t('storebrand.task5.title')}</h2>
                        <p>{t('storebrand.task5.text')}</p>
                    </div>
                </div>
            </div>
		
            <div className="side">
                <div className="program-schedule">
                    <h3>{t('storebrand.program.title')}</h3>
                    <ul>
                        <li>{t('storebrand.program.item1')}</li>
                        <li>{t('storebrand.program.item2')}</li>
                        <li>{t('storebrand.program.item3')}</li>
                        <li>{t('storebrand.program.item4')}</li>
                        <li>{t('storebrand.program.item5')}</li>
                        <li>{t('storebrand.program.item6')}</li>
                    </ul>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Storebrand;