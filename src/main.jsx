import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import QRCodeExample from './QRCodeExample'
import { BrowserRouter, Routes, Route } from "react-router";
import QRCodePage from './QRCodePage.jsx';
import DriveFiles from './DriveFiles.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />

                <Route path="/DriveFiles" element={<DriveFiles />} />

                <Route path="/QRCodePage" element={<QRCodePage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
