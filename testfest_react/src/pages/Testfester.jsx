import '../assets/styles/testfest.css';
import '../assets/styles/styles.css';
import { Link } from 'react-router-dom';

const Testfester = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <h2>Tidligere Testfester</h2>
          <ul className="testfester-list">
            <li><Link to="/oslokommune" className="list-link">Oslo kommune</Link></li>
            <li><Link to="/storebrand" className="list-link">Storebrand</Link></li>
            <li><Link to="/uio" className="list-link">Universitet i Oslo</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Testfester;