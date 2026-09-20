import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialAppointments, initialTimeSlots } from '../data/appointments';

const AppContext = createContext(null);

const initialState = {
  appointments: initialAppointments,
  timeSlots: initialTimeSlots,
  ownerAppointments: initialAppointments.filter(a => a.salonId === 'salon-1'),
  walkinCount: 1,
  onlineCount: 4,
  todayRevenue: 6850,
  isLoggedIn: true,
  currentUserId: 'cust-1',
  smartSlotsEnabled: true,
  smartSlotRules: [
    { id: 'sr-1', day: 'Monday', startTime: '11:00', endTime: '16:00', service: 'Haircut', regularPrice: 300, smartPrice: 199, enabled: true },
    { id: 'sr-2', day: 'Tuesday', startTime: '11:00', endTime: '16:00', service: 'Haircut', regularPrice: 300, smartPrice: 199, enabled: true },
    { id: 'sr-3', day: 'Wednesday', startTime: '11:00', endTime: '16:00', service: 'Haircut + Beard', regularPrice: 450, smartPrice: 299, enabled: true },
    { id: 'sr-4', day: 'Thursday', startTime: '11:00', endTime: '16:00', service: 'Haircut', regularPrice: 300, smartPrice: 199, enabled: false },
    { id: 'sr-5', day: 'Friday', startTime: '12:00', endTime: '15:00', service: 'Haircut + Beard', regularPrice: 450, smartPrice: 299, enabled: true },
  ],
  ownerServices: [
    { id: 's1', name: 'Haircut', price: 300, smartPrice: 199, duration: 30, enabled: true },
    { id: 's2', name: 'Beard Trim', price: 150, smartPrice: 99, duration: 15, enabled: true },
    { id: 's3', name: 'Haircut + Beard', price: 450, smartPrice: 299, duration: 45, enabled: true },
    { id: 's4', name: 'Hair Spa', price: 900, smartPrice: 649, duration: 60, enabled: true },
    { id: 's5', name: 'Facial', price: 600, smartPrice: 449, duration: 45, enabled: true },
    { id: 's6', name: 'Hair Color', price: 1800, smartPrice: 1299, duration: 90, enabled: true },
    { id: 's7', name: 'Manicure', price: 350, smartPrice: null, duration: 30, enabled: true },
    { id: 's8', name: 'Hot Towel Shave', price: 250, smartPrice: 179, duration: 30, enabled: true },
    { id: 's9', name: 'Threading', price: 80, smartPrice: null, duration: 15, enabled: true },
    { id: 's10', name: 'Pedicure', price: 400, smartPrice: 299, duration: 45, enabled: true },
  ],
  ownerStaff: [
    { id: 'staff-1', name: 'Raj Kumar', role: 'Senior Barber', status: 'available', avatar: 'https://i.pravatar.cc/150?img=11', workHours: '09:00 – 21:00' },
    { id: 'staff-3', name: 'Aman Patel', role: 'Barber', status: 'available', avatar: 'https://i.pravatar.cc/150?img=33', workHours: '10:00 – 21:00' },
    { id: 'staff-5', name: 'Kiran Mehta', role: 'Barber', status: 'available', avatar: 'https://i.pravatar.cc/150?img=55', workHours: '09:00 – 21:00' },
    { id: 'staff-2', name: 'Neha Shah', role: 'Beautician', status: 'available', avatar: 'https://i.pravatar.cc/150?img=20', workHours: '09:00 – 20:00' },
    { id: 'staff-4', name: 'Priya Desai', role: 'Senior Beautician', status: 'on-leave', avatar: 'https://i.pravatar.cc/150?img=44', workHours: '09:00 – 19:30' },
  ],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'BOOK_APPOINTMENT': {
      const newApt = action.payload;
      const updatedSlots = state.timeSlots.map(slot =>
        slot.time === newApt.time
          ? { ...slot, status: 'booked', appointmentId: newApt.id }
          : slot
      );
      return {
        ...state,
        appointments: [...state.appointments, newApt],
        ownerAppointments: newApt.salonId === 'salon-1'
          ? [...state.ownerAppointments, newApt]
          : state.ownerAppointments,
        timeSlots: updatedSlots,
        onlineCount: state.onlineCount + 1,
        todayRevenue: state.todayRevenue + newApt.price,
      };
    }

    case 'CANCEL_APPOINTMENT': {
      const { appointmentId } = action.payload;
      const apt = state.appointments.find(a => a.id === appointmentId);
      const updatedSlots = state.timeSlots.map(slot =>
        slot.appointmentId === appointmentId
          ? { ...slot, status: apt?.isSmartSlot ? 'smart' : 'available', appointmentId: null }
          : slot
      );
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        ),
        ownerAppointments: state.ownerAppointments.map(a =>
          a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        ),
        timeSlots: updatedSlots,
        todayRevenue: apt ? Math.max(0, state.todayRevenue - apt.price) : state.todayRevenue,
      };
    }

    case 'RESCHEDULE_APPOINTMENT': {
      const { appointmentId, newTime, newDate } = action.payload;
      const apt = state.appointments.find(a => a.id === appointmentId);
      const updatedSlots = state.timeSlots.map(slot => {
        if (slot.appointmentId === appointmentId) {
          return { ...slot, status: apt?.isSmartSlot ? 'smart' : 'available', appointmentId: null };
        }
        if (slot.time === newTime) {
          return { ...slot, status: 'booked', appointmentId };
        }
        return slot;
      });
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === appointmentId ? { ...a, time: newTime, date: newDate, status: 'confirmed' } : a
        ),
        ownerAppointments: state.ownerAppointments.map(a =>
          a.id === appointmentId ? { ...a, time: newTime, date: newDate, status: 'confirmed' } : a
        ),
        timeSlots: updatedSlots,
      };
    }

    case 'UPDATE_APPOINTMENT_STATUS': {
      const { appointmentId, status } = action.payload;
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === appointmentId ? { ...a, status } : a
        ),
        ownerAppointments: state.ownerAppointments.map(a =>
          a.id === appointmentId ? { ...a, status } : a
        ),
      };
    }

    case 'ADD_WALKIN': {
      const newWalkin = action.payload;
      const updatedSlots = state.timeSlots.map(slot =>
        slot.time === newWalkin.time
          ? { ...slot, status: 'booked', appointmentId: newWalkin.id }
          : slot
      );
      return {
        ...state,
        appointments: [...state.appointments, newWalkin],
        ownerAppointments: [...state.ownerAppointments, newWalkin],
        timeSlots: updatedSlots,
        walkinCount: state.walkinCount + 1,
        todayRevenue: state.todayRevenue + newWalkin.price,
      };
    }

    case 'TOGGLE_SMART_SLOT_RULE': {
      const { ruleId } = action.payload;
      return {
        ...state,
        smartSlotRules: state.smartSlotRules.map(r =>
          r.id === ruleId ? { ...r, enabled: !r.enabled } : r
        ),
      };
    }

    case 'ADD_SMART_SLOT_RULE': {
      return {
        ...state,
        smartSlotRules: [...state.smartSlotRules, action.payload],
      };
    }

    case 'TOGGLE_SERVICE': {
      const { serviceId } = action.payload;
      return {
        ...state,
        ownerServices: state.ownerServices.map(s =>
          s.id === serviceId ? { ...s, enabled: !s.enabled } : s
        ),
      };
    }

    case 'ADD_SERVICE': {
      return {
        ...state,
        ownerServices: [...state.ownerServices, action.payload],
      };
    }

    case 'UPDATE_SERVICE': {
      const { serviceId, updates } = action.payload;
      return {
        ...state,
        ownerServices: state.ownerServices.map(s =>
          s.id === serviceId ? { ...s, ...updates } : s
        ),
      };
    }

    case 'ADD_STAFF': {
      return {
        ...state,
        ownerStaff: [...state.ownerStaff, action.payload],
      };
    }

    case 'TOGGLE_STAFF_STATUS': {
      const { staffId } = action.payload;
      return {
        ...state,
        ownerStaff: state.ownerStaff.map(s =>
          s.id === staffId
            ? { ...s, status: s.status === 'available' ? 'on-leave' : 'available' }
            : s
        ),
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('groomly_state', JSON.stringify({
        appointments: state.appointments,
        walkinCount: state.walkinCount,
        onlineCount: state.onlineCount,
      }));
    } catch (e) { /* ignore */ }
  }, [state.appointments, state.walkinCount, state.onlineCount]);

  return (
    <AppContext.Provider value={{
      ...state,
      bookAppointment: (data) => dispatch({ type: 'BOOK_APPOINTMENT', payload: data }),
      cancelAppointment: (id) => dispatch({ type: 'CANCEL_APPOINTMENT', payload: { appointmentId: id } }),
      rescheduleAppointment: (id, time, date) => dispatch({ type: 'RESCHEDULE_APPOINTMENT', payload: { appointmentId: id, newTime: time, newDate: date } }),
      updateAppointmentStatus: (id, status) => dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { appointmentId: id, status } }),
      addWalkin: (data) => dispatch({ type: 'ADD_WALKIN', payload: data }),
      toggleSmartSlotRule: (ruleId) => dispatch({ type: 'TOGGLE_SMART_SLOT_RULE', payload: { ruleId } }),
      addSmartSlotRule: (rule) => dispatch({ type: 'ADD_SMART_SLOT_RULE', payload: rule }),
      toggleService: (serviceId) => dispatch({ type: 'TOGGLE_SERVICE', payload: { serviceId } }),
      addService: (service) => dispatch({ type: 'ADD_SERVICE', payload: service }),
      updateService: (serviceId, updates) => dispatch({ type: 'UPDATE_SERVICE', payload: { serviceId, updates } }),
      addStaff: (member) => dispatch({ type: 'ADD_STAFF', payload: member }),
      toggleStaffStatus: (staffId) => dispatch({ type: 'TOGGLE_STAFF_STATUS', payload: { staffId } }),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
