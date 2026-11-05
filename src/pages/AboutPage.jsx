import Footer from '../components/Footer.jsx'
import lexisImage from '../assets/lexis.webp'
import aboutContent from '../data/about.json'

function AboutPage({ navigate }) {
  const { hero, story, bio, values, cta } = aboutContent

  return (
    <>
      <main>
        <section className="about-hero">
          <div className="about-hero-copy"><p className="eyebrow"><span /> {hero.eyebrow}</p><h1>{hero.heading}<br /><em>{hero.accent}</em></h1><p>{hero.intro}</p></div>
          <div className="about-photo"><img src={lexisImage} alt={hero.imageAlt} /><span>{hero.imageCaption.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</span></div>
          <div className="about-side-note">{hero.sideNote.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</div>
        </section>
        <section className="about-story section-wrap">
          <div className="section-index">{story.index} <span>/ {story.label}</span></div>
          <div className="about-story-content"><h2>{story.heading}</h2><p className="about-lede">{story.lede}</p>{story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
        <section className="about-bio-section">
          <div className="section-wrap about-bio">
            <div>
              <div className="section-index">{bio.index} <span>/ {bio.label}</span></div>
              <h2>{bio.heading}<br /><em>{bio.accent}</em></h2>
              <p>{bio.intro}</p>
            </div>
            <dl className="bio-details">
              {bio.details.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>
        </section>
        <section className="values-section">
          <div className="section-wrap values-inner"><div className="values-title"><div className="section-index">{values.index} <span>/ {values.label}</span></div><h2>{values.heading}<br /><em>{values.accent}</em></h2></div>
            <div className="values-list">{values.items.map(({ title, description }, index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
          </div>
        </section>
        <section className="about-cta section-wrap"><div><p className="eyebrow"><span /> {cta.eyebrow}</p><h2>{cta.heading}<br />{cta.secondLine} <em>{cta.accent}</em></h2></div><a className="button button-dark" href="/#get-involved" onClick={(event) => navigate(event, '/#get-involved')}>{cta.button} <span aria-hidden="true">↗</span></a></section>
      </main>
      <Footer navigate={navigate} />
    </>
  )
}

export default AboutPage
