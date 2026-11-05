import { useState } from 'react'

function SignupForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="email-address">Your email address</label>
      <input id="email-address" type="email" placeholder="Your email address" required />
      <button type="submit">{submitted ? 'You’re on the list' : 'Keep me posted'} <span aria-hidden="true">→</span></button>
      {submitted && <p className="form-success" role="status">Thanks for reaching out. We’ll be in touch when the next garden day is planned.</p>}
    </form>
  )
}

export default SignupForm
