import { Routes, Route } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import CitizenHome from "./pages/citizen/CitizenHome";
import Services from "./pages/citizen/Services";
import QueuePreview from "./pages/citizen/QueuePreview";
import ActiveToken from "./pages/citizen/ActiveToken";
import PeakHours from "./pages/citizen/PeakHours";

import OperatorDashboard from "./pages/operator/OperatorDashboard";
import OperatorQueue from "./pages/operator/OperatorQueue";
import CounterControl from "./pages/operator/CounterControl";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Offices from "./pages/admin/Offices";
import AdminServices from "./pages/admin/Services";
import Counters from "./pages/admin/Counters";
import Staff from "./pages/admin/Staff";
import Analytics from "./pages/admin/Analytics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/citizen" element={<CitizenHome />} />
      <Route
        path="/citizen/offices/:officeId/services"
        element={<Services />}
      />
      <Route
        path="/citizen/offices/:officeId/services/:serviceId/queue"
        element={<QueuePreview />}
      />
      <Route
        path="/citizen/token/:tokenId"
        element={<ActiveToken />}
      />
      <Route
        path="/citizen/offices/:officeId/crowd"
        element={<PeakHours />}
      />

      <Route path="/operator" element={<OperatorDashboard />} />
      <Route path="/operator/queue" element={<OperatorQueue />} />
      <Route
        path="/operator/counter"
        element={<CounterControl />}
      />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/offices" element={<Offices />} />
      <Route
        path="/admin/services"
        element={<AdminServices />}
      />
      <Route path="/admin/counters" element={<Counters />} />
      <Route path="/admin/staff" element={<Staff />} />
      <Route path="/admin/analytics" element={<Analytics />} />

    </Routes>
    
  );
}