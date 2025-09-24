import '../assets/styles/testfest-pages.css';

const Storebrand = () => {
  return (
    <div className="container main-content">
      <div className="row">
        <div className="main">
          <div class="testfest-header">
                    <h1>Testfest 3. September - Storebrand</h1>
                    <p>Fint om du kan 'tenke høyt' mens du tester for å vise hvordan tjenesten fungerer (eller ikke).</p>
                    <p>Send gjerne skriftlig tilbakemelding fra lenken under hver oppgave.</p>
                </div>
  
                <div class="task-grid">
                    <div class="task-item financial-task">
                        <h2>Oppgave 1: Pensjonssparing</h2>
                        <p>Kan du finne ut hvilke pensjonssparingmuligheter Storebrand tilbyr?</p>
                    </div>
  
                    <div class="task-item financial-task">
                        <h2>Oppgave 2: Reiseforsikring</h2>
                        <p>Du skal ut å reise i 3 måneder og trenger reiseforsikring. Hva vil det koste deg hos Storebrand?</p>
                    </div>
  
                    <div class="task-item financial-task">
                        <h2>Oppgave 3: Leie av bil</h2>
                        <p>Du skal leie bil under reiser, se om reiseforsikringen dekker evt skader på denne og hva egenandel da vil koste?</p>
                    </div>

                    <div class="task-item financial-task">
                        <h2>Oppgave 4: Leie av bil - vilkår</h2>
                        <p>Reiseforsikringen har mange vilkår, disse vises i en pdf, kan du finne pdfen og se om du finner ut hvilke utgifter forsikringen ikke dekker?</p>
                    </div>

                    <div class="task-item financial-task">
                        <h2>Oppgave 5: Kundeservice</h2>
                        <p>Du er usikker på om du forstår dekningene og ønsker å kontakte kundeservice. Hva gjør du?</p>
                    </div>
                </div>
            </div>
		
            <div class="side">
                <div class="program-schedule">
                    <h3>Oslo kommune og Storebrand<br/>Punkter for kveldens program:</h3>
                    <ul>
                        <li>Velkommen – Pizza er servert (Christian)</li>
                        <li>Introduksjon til Testfest (Mikael og Joschua)</li>
                        <li>Vi setter igang med testene</li>
                        <li>Pause med påfyll</li>
                        <li>Videre testing og deling av erfaringer</li>
                        <li>Avslutning og oppsummering (Alle)</li>
                    </ul>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Storebrand;