import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Patients from './pages/Patients';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/patients" element={<Patients />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;