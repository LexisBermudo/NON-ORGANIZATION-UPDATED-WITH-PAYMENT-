import Footer from '../components/Footer.jsx'
import DonationForm from '../components/DonationForm.jsx'
import SignupForm from '../components/SignupForm.jsx'

const heroImage = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=85'
const gardenImage = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1100&q=85'

function HomePage({ navigate }) {
  return (
    <>
      <main>
        <section className="home-hero" style={{ '--hero-image': `url("${heroImage}")` }}>
          <div className="hero-copy">
            <p className="eyebrow light-eyebrow"><span /> NEIGHBORHOOD GARDENS. SHARED TABLES.</p>
            <h1>Good things<br />grow <em>together.</em></h1>
            <p className="hero-description">We turn overlooked city spaces into welcoming community gardens, where neighbors grow fresh food and stronger connections side by side.</p>
            <div className="hero-actions">
              <a className="button button-lime" href="#get-involved">Find your way in <span aria-hidden="true">↗</span></a>
              <a className="text-link light-link" href="/about" onClick={(event) => navigate(event, '/about')}>Get to know us <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="image-caption"><span>01 / GROW HERE</span><span>A little more room for everyone.</span></div>
        </section>

        <section className="intro-section section-wrap">
          <div className="section-index">01 <span>/ WHAT WE DO</span></div>
          <div className="intro-copy">
            <h2>A garden is more than what grows in it.</h2>
            <p>It’s a place to learn by doing, share what you have, and feel at home in your neighborhood. Common Ground Project brings people together to make that kind of place possible, one shared growing space at a time.</p>
            <a className="text-link dark-link" href="/about" onClick={(event) => navigate(event, '/about')}>More about our approach <span aria-hidden="true">→</span></a>
          </div>
          <div className="intro-note"><span className="note-mark" aria-hidden="true">✳</span><p>Make room.<br />Plant something.<br />Pass it on.</p></div>
        </section>

        <section className="program-section">
          <div className="section-wrap program-heading">
            <div><div className="section-index">02 <span>/ THE WORK</span></div><h2>Small patches.<br /><em>Big possibility.</em></h2></div>
            <p>There’s no single way to be part of a garden. Start with what you’re curious about; we’ll figure out the rest together.</p>
          </div>
          <div className="program-grid">
            <article className="program-card program-card-green">
              <span className="program-number">01</span><span className="program-symbol" aria-hidden="true">↟</span>
              <h3>Grow food, together</h3><p>Help tend shared beds, learn the rhythms of the growing season, and bring home a little of what the neighborhood grows.</p>
              <a href="#get-involved" className="card-link">Join a garden day <span aria-hidden="true">↗</span></a>
            </article>
            <article className="program-card program-card-yellow">
              <span className="program-number">02</span><span className="program-symbol" aria-hidden="true">✳</span>
              <h3>Learn by doing</h3><p>Swap practical skills on soil, seeds, and seasonal cooking in a low-pressure space made for first-timers and old hands alike.</p>
              <a href="#get-involved" className="card-link">Learn with us <span aria-hidden="true">↗</span></a>
            </article>
            <article className="program-card program-card-pink">
              <span className="program-number">03</span><span className="program-symbol" aria-hidden="true">⌂</span>
              <h3>Make space to belong</h3><p>From a quick hello at the beds to a long afternoon outdoors, there’s room to show up as you are and get to know your neighbors.</p>
              <a href="#get-involved" className="card-link">Find your people <span aria-hidden="true">↗</span></a>
            </article>
          </div>
        </section>

        <section className="story-section section-wrap">
          <div className="story-image-wrap"><img src={gardenImage} alt="Hands tending fresh seedlings in a community garden" /><span className="photo-stamp">GROW<br />WITH US</span></div>
          <div className="story-copy"><div className="section-index">03 <span>/ OUR WHY</span></div><h2>Fresh food should feel close to home.</h2><p>In a city, it can be easy to feel disconnected from the people and places that feed us. We’re here to make that connection tangible: a patch of earth, a shared harvest, and a friendly face who knows your name.</p><a className="text-link dark-link" href="/about" onClick={(event) => navigate(event, '/about')}>Meet the project <span aria-hidden="true">→</span></a></div>
        </section>

        <section className="get-involved" id="get-involved">
          <div className="get-involved-inner">
            <div><p className="eyebrow light-eyebrow"><span /> THERE’S A PLACE FOR YOU</p><h2>Come grow<br /><em>something good.</em></h2><p className="involve-description">Bring your curiosity, a pair of gloves, or just yourself. Sign up and we’ll send you the next chance to get your hands in the soil.</p></div>
            <div className="involvement-panels">
              <div className="signup-panel"><div className="signup-label">A NOTE FROM THE GARDEN</div><SignupForm /><p className="privacy-note">Only garden news and invitations. No noise.</p></div>
              <DonationForm />
            </div>
          </div>
          <div className="involve-decoration" aria-hidden="true">✳</div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </>
  )
}

export default HomePage
