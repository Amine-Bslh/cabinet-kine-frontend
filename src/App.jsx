import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Patients from './pages/Patients';
import Utilisateurs from './pages/Utilisateurs';
import RouteProtegee from './components/RouteProtegee';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/patients"
                    element={
                        <RouteProtegee>
                            <Patients />
                        </RouteProtegee>
                    }
                />
                <Route
                    path="/utilisateurs"
                    element={
                        <RouteProtegee>
                            <Utilisateurs />
                        </RouteProtegee>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;