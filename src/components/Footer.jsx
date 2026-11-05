function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <a className="wordmark footer-wordmark" href="/" onClick={(event) => navigate(event, '/') }>
        <span className="wordmark-icon" aria-hidden="true">cg</span>
        <span>common ground<span className="wordmark-sub">PROJECT</span></span>
      </a>
      <p>Good food grows when we grow it together.</p>
      <div className="footer-links">
        <a href="/" onClick={(event) => navigate(event, '/')}>Home</a>
        <a href="/about" onClick={(event) => navigate(event, '/about')}>Our story</a>
        <a href="/#get-involved" onClick={(event) => navigate(event, '/#get-involved')}>Get involved</a>
      </div>
      <span className="copyright">A community project, rooted in care.</span>
    </footer>
  )
}

export default Footer
