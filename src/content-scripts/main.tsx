import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import '../index.css'

const root = document.createElement("div")
root.id = "crx-content-root"
document.body.append(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
