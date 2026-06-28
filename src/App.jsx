import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProjectDetails from "./pages/ProjectDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccessDenied from "./pages/AccessDenied";

import ProtectedRoute from "./ProtectedRoute";

import PMDashboard from "./pages/PMDashboard";
import BDDashboard from "./pages/BDDashboard";
import QADashboard from "./pages/QADashboard";
import PSDashboard from "./pages/PSDashboard";

function App() {
  return (
    <>
      <Header />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* PROTECTED DASHBOARDS */}
        <Route path="/dashboard/pm" element={
          <ProtectedRoute><PMDashboard /></ProtectedRoute>
        } />

        <Route path="/dashboard/bd" element={
          <ProtectedRoute><BDDashboard /></ProtectedRoute>
        } />

        
        <Route path="/dashboard/qa" element={
          <ProtectedRoute><QADashboard /></ProtectedRoute>
        } />

        <Route path="/dashboard/ps" element={
          <ProtectedRoute><PSDashboard /></ProtectedRoute>
        } />

        {/* FALLBACK */}
        <Route path="*" element={<AccessDenied />} />
        <Route
  path="/project/:id"
  element={
    <ProtectedRoute>
      <ProjectDetails />
    </ProtectedRoute>
  }
/>

      </Routes>
    </>
  );
}

export default App;