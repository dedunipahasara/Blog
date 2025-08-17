import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verify from "./pages/Auth/Verify";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Feed from "./pages/Dashboard/Feed";
import Explore from "./pages/Dashboard/Explore";
import UploadPin from "./pages/Dashboard/UploadPin";
import PinDetail from "./pages/Dashboard/PinDetail";
import ViewProfile from "./pages/Profile/ViewProfile";
import EditProfile from "./pages/Profile/EditProfile";
import Settings from "./pages/Dashboard/Settings"; // <-- import Settings

export default function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Feed />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/upload" element={<UploadPin />} />
            <Route path="/pin/:id" element={<PinDetail />} />
            <Route path="/profile/:username" element={<ViewProfile />} />
            <Route path="/profile/:username/edit" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} /> {/* <-- Settings route */}
          </Route>

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
