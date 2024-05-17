import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Campaign from "./pages/Campaign";
import Offer from "./pages/Offer";
import DashboardLayout from "./components/layout/DashboardLayout";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="campaign" element={<Campaign />} />
              <Route path="offer" element={<Offer />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
