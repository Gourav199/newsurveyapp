import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SurveyForm from './Surveyform/SurveyForm';
import AdminLogin from './Admin/AdminLogin';
import Dashboard from './Admin/Dashboard';
import UserDetails from './Admin/UserDetails';
import EmployeeDetails from './Admin/EmployeeDetails';
import Details from './Admin/Details';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/survey-form" element={<SurveyForm />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey-details" element={<UserDetails />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/details/:id" element={<Details />} />

      </Routes>
    </Router>

  );
}

export default App;
