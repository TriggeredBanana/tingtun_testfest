import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Testfester = () => {
  const { t } = useTranslation();
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <h2>{t('testfester.title')}</h2>
          <ul className="testfester-list">
            <li><Link to="/oslokommune" className="list-link">{t('testfester.oslo_link')}</Link></li>
            <li><Link to="/storebrand" className="list-link">{t('testfester.storebrand_link')}</Link></li>
            <li><Link to="/uio" className="list-link">{t('testfester.uio_link')}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Testfester;