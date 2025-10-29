import { useState } from 'react';
import deltakereImg from '../assets/images/deltakere.jpg';
import '../assets/styles/styles.css';
import '../assets/styles/faq.css';

const faqData = [
	{
		q: '1. Hvordan kan jeg navigere til Testfest verktøyet (Testfest Feedback) fra Chrome med tastaturet?',
		a: (
			<>
				<p>
					På Chrome må du bruke F6 tasten for å komme til bokmerkeraden. Deretter navigere videre blant bokmerkene med
					piltastene til du finner Testfest verktøyet. I Firefox kan man bruke Tabulator tasten som vanlig for komme inn
					på bokmerkeraden.
				</p>
			</>
		),
	},
	{
		q: '2. Hvordan kan jeg installere Testfest verktøyet på min mobil?',
		a: (
			<>
				<div className="media-link">
					<a href="https://tingtun.no/static/videos//TF-installasjon-paa-mobil.MOV">
						Trykk her for å spille av video som viser installasjon
					</a>
				</div>
				<br />
				<p>Takk til Andreas Havsberg som laget videoen.</p>
				<p>Kommer snart: Tekstbeskrivelse av videoen</p>
			</>
		),
	},
	{
		q: '3. Hvordan kan jeg sende inn en tilbakemelding om jeg ikke bruker Testfest verktøyet?',
		a: (
			<>
				<p>
					Da kan du åpne en nettside med samme tilbakemeldingsskjema i en fane og nettsiden som skal testes i en annen
					fane i nettleseren. Hver testfest har sin egen startside med lenker til tjenestene som skal testes og til
					skjema for å melde fra om feil for hver enkelt tjeneste.
				</p>
			</>
		),
	},
	{
		q: '4. Hvordan kan jeg åpne en ny fane i nettleseren?',
		a: <p>Kommer: beskrive for Chrome, Edge og Safari, på desktop og på mobil</p>,
	},
	{
		q: '5. Hvordan kan jeg bytte mellom faner i nettleseren?',
		a: <p>Kommer: beskrive for Chrome, Edge og Safari, på desktop og på mobil</p>,
	},
	{
		q: '6. Hvorfor blir ikke kartet med i skjermbildet?',
		a: (
			<p>
				For å beskytte persondata vil innhold fra andre nettadresser ikke bli inkludert i skjermbildet. Se og{' '}
				<a href="https://html2canvas.hertzen.com/faq">HTML2Canvas spørsmål og svar</a>.
			</p>
		),
	},
	{
		q: '7. Hvorfor startet dere med Testfester?',
		a: (
			<p>
				Mange nettsteder har tilbakemeldingsfunksjoner. Selv om muligheten finnes, så er det veldig få brukere som
				sender tilbakemeldinger til nettstedseierne når de opplever hindringer. Med Testfestene ønsker vi utvikle og
			etablere en metode og et verktøy som gjør de enklere å komme sammen for å finne og forstå og løse problemene.
				Dette er ment som et praktisk steg mot et mer likestilt samfunn.
			</p>
		),
	},
];

const FAQ = () => {
	const [open, setOpen] = useState(Array(faqData.length).fill(false));

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
					<h1>Spørsmål og svar</h1>

					<div className="checklist-section">
						<ol>
							{faqData.map((item, i) => {
								const answerId = `faq-answer-${i}`;
								return (
									<li key={i} className="expandable-item">
										<button
											className="expand-button"
											onClick={() => toggle(i)}
											aria-expanded={open[i]}
											aria-controls={answerId}
										>
											<b>{item.q.replace(/^\d+\.\s*/, '')}</b>
											<span className="expand-icon">{open[i] ? '−' : '+'}</span>
										</button>
										<div
											id={answerId}
											className={`expandable-content ${open[i] ? 'open' : ''}`}
											hidden={!open[i]}
										>
											{item.a}
										</div>
									</li>
								);
							})}
						</ol>
					</div>

					<div className="faq-resources">
						<h3>Mer informasjon om universell utforming</h3>
						<p>
							Her følger noen lenker til mer informasjon om universell utforming av nettsider og applikasjoner.
						</p>
						<ul>
							<li>
								<a href="https://www.w3.org/Translations/WCAG21-no/">
									Retningslinjer for universell utforming av nettinnhold (WCAG)
								</a>
							</li>
							<li>
								<a href="https://www.uutilsynet.no/">Tilsyn for universell utforming (uutilsynet)</a>
							</li>
							<li>
								<a href="https://www.uutilsynet.no/webdirektivet-wad/eus-webdirektiv-wad/265">
									uuTilsynet om EUs Webdirektiv (WAD)
								</a>
							</li>
							<li>
								<a href="https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX:32016L2102">
									Webdirektivet fra EU (svensk oversettelse)
								</a>
							</li>
							<li>
								<a href="https://www.nkom.no/aktuelt/standarden-en-301-549-er-na-tilgjengelig-pa-norsk/">
									Standard for Universell utforming
								</a>
							</li>
							<li>
								<a href="https://testfest.no/PDF/Testfest-oversikt.pdf">
									Presentasjon om Testfestprosjektet
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="side">
					<div className="intro-image">
						<img src={deltakereImg} alt="Deltakere fra Testfest" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FAQ;