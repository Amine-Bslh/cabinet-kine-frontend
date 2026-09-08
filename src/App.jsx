import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Utilisateurs from './pages/Utilisateurs';
import RendezVousPage from './pages/RendezVous';
import SeancePage from './pages/Seance';
import PaiementPage from './pages/Paiement';
import PrestationPage from './pages/Prestation';
import CurePage from './pages/Cure';
import DiagnosticPage from './pages/Diagnostic';
import RouteProtegee from './components/RouteProtegee';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/patients" element={<RouteProtegee><Patients /></RouteProtegee>} />
                <Route path="/utilisateurs" element={<RouteProtegee><Utilisateurs /></RouteProtegee>} />
                <Route path="/rendezvous" element={<RouteProtegee><RendezVousPage /></RouteProtegee>} />
                <Route path="/seances" element={<RouteProtegee><SeancePage /></RouteProtegee>} />
                <Route path="/paiements" element={<RouteProtegee><PaiementPage /></RouteProtegee>} />
                <Route path="/prestations" element={<RouteProtegee><PrestationPage /></RouteProtegee>} />
                <Route path="/cures" element={<RouteProtegee><CurePage /></RouteProtegee>} />
                <Route path="/diagnostics" element={<RouteProtegee><DiagnosticPage /></RouteProtegee>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;