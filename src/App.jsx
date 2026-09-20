import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast/Toast';
import Navbar from './components/Navbar/Navbar';

import Home from './pages/Home/Home';
import Salons from './pages/Salons/Salons';
import SalonDetails from './pages/SalonDetails/SalonDetails';
import Booking from './pages/Booking/Booking';
import BookingSuccess from './pages/BookingSuccess/BookingSuccess';
import MyBookings from './pages/MyBookings/MyBookings';
import Profile from './pages/Profile/Profile';

import OwnerLayout from './pages/owner/OwnerLayout/OwnerLayout';
import Dashboard from './pages/owner/Dashboard/Dashboard';
import Appointments from './pages/owner/Appointments/Appointments';
import OwnerCalendar from './pages/owner/Calendar/Calendar';
import Services from './pages/owner/Services/Services';
import Staff from './pages/owner/Staff/Staff';
import Customers from './pages/owner/Customers/Customers';
import SmartSlots from './pages/owner/SmartSlots/SmartSlots';
import Analytics from './pages/owner/Analytics/Analytics';
import OwnerSettings from './pages/owner/Settings/Settings';

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salons" element={<Salons />} />
            <Route path="/salon/:id" element={<SalonDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="calendar" element={<OwnerCalendar />} />
              <Route path="services" element={<Services />} />
              <Route path="staff" element={<Staff />} />
              <Route path="customers" element={<Customers />} />
              <Route path="smart-slots" element={<SmartSlots />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<OwnerSettings />} />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}
