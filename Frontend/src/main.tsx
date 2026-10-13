import ReactDOM from "react-dom/client";
import App from './App.tsx';
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)
