import logo from './logo.svg';
import './App.css';
import Login from './Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SurveyForm from './Surveyform/SurveyForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/survey-form" element={<SurveyForm />} />
      </Routes>
    </Router>

  );
}

export default App;
