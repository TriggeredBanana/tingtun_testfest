import '../assets/styles/testfest-pages.css';
import { useTranslation } from 'react-i18next';

const UiO = () => {
  const { t } = useTranslation();
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <div className="testfest-header">
                    <h1>{t('uio.title')}</h1>
                    <p>{t('uio.intro1')}</p>
                </div>
                
                <div className="uio-link">
                    <p>{t('uio.link_text')} <a href="https://minestudier.uio.no/nb/student?demo=5">{t('uio.link_label')}</a></p>
                </div>
  
                <div className="task-grid">
                    <div className="task-item academic-task">
                        <h2>{t('uio.task1.title')}</h2>
                        <p>{t('uio.task1.p1')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task1.a')}</p>
                            <p>{t('uio.task1.b')}</p>
                            <p>{t('uio.task1.c')}</p>
                        </div>
                    </div>
  
                    <div className="task-item academic-task">
                        <h2>{t('uio.task2.title')}</h2>
                        <p>{t('uio.task2.p1')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task2.a')}</p>
                            <p>{t('uio.task2.b')}</p>
                            <p>{t('uio.task2.c')}</p>
                        </div>
                        <p>{t('uio.task2.p2')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task2.d')}</p>
                            <p>{t('uio.task2.e')}</p>
                        </div>
                    </div>
  
                    <div className="task-item academic-task">
                        <h2>{t('uio.task3.title')}</h2>
                        <p>{t('uio.task3.p1')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task3.a')}</p>
                        </div>
                        <p>{t('uio.task3.p2')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task3.b')}</p>
                            <p>{t('uio.task3.c')}</p>
                        </div>
                        <p>{t('uio.task3.p3')}</p>
                        <div className="sub-tasks">
                            <p>{t('uio.task3.d')}</p>
                            <p>{t('uio.task3.e')}</p>
                        </div>
                    </div>

                    <div className="task-item extra-tasks">
                        <h2>{t('uio.extra.title')}</h2>
                        <p>{t('uio.extra.p1')}</p>
                        <p>{t('uio.extra.p2')}</p>
                    </div>
                </div>
            </div>
		
            <div className="side">
                <div className="program-schedule">
                    <h3>{t('uio.program.title')}</h3>
                    <ul>
                        <li>{t('uio.program.item1')}</li>
                        <li>{t('uio.program.item2')}</li>
                        <li>{t('uio.program.item3')}</li>
                        <li>{t('uio.program.item4')}</li>
                        <li>{t('uio.program.item5')}</li>
                        <li>{t('uio.program.item6')}</li>
                    </ul>
                </div>
        </div>
      </div>
    </div>
  );
};

export default UiO;