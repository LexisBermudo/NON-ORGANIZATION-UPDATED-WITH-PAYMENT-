function Navigation({ page, navigate }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" onClick={(event) => navigate(event, '/')} aria-label="Common Ground Project home">
        <span className="wordmark-icon" aria-hidden="true">cg</span>
        <span>common ground<span className="wordmark-sub">PROJECT</span></span>
      </a>
      <nav aria-label="Main navigation">
        <a className={page === 'home' ? 'nav-link active' : 'nav-link'} href="/" onClick={(event) => navigate(event, '/')}>Home</a>
        <a className={page === 'about' ? 'nav-link active' : 'nav-link'} href="/about" onClick={(event) => navigate(event, '/about')}>About</a>
      </nav>
      <a className="header-cta" href="/#get-involved" onClick={(event) => navigate(event, '/#get-involved')}>Get involved <span aria-hidden="true">↗</span></a>
    </header>
  )
}

export default Navigation
