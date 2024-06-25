import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Campaign from "./pages/Campaign";
import Offer from "./pages/Offer";
import DashboardLayout from "./components/layout/DashboardLayout";
import Settings from "./pages/AdminPages/Settings";
import Login from "./pages/Login";
import User from "./pages/User";
import PrivacyPolicy from "./pages/TermsPages/PrivacyPolicy";
import AdminCampaign from "./pages/AdminPages/AdminCampaign";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="campaign" element={<Campaign />} />
              <Route path="adminCampaign" element={<AdminCampaign />} />
              <Route path="offer" element={<Offer />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user" element={<User />} />
            </Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
