import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

const Client_id: string = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
console.log(Client_id)
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={Client_id}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>,
    </BrowserRouter>
  </GoogleOAuthProvider>
)
