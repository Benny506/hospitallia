import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/color.css'
import './styles/font.css'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
