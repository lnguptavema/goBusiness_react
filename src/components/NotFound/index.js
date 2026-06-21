import {useState} from 'react'
import {Redirect} from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const [redirect, setRedirect] = useState(false)

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <div className="notfoundContainer">
      <h1>404</h1>
      <p>Page not found</p>
      <button
        className="backButton"
        onClick={() => setRedirect(true)}
      >
        Back To Dashboard
      </button>
    </div>
  )
}

export default NotFound