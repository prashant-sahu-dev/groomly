import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import styles from './AddWalkInModal.module.css';

const SERVICES = [
  { value: 's1', label: 'Haircut', price: 300, duration: 30 },
  { value: 's2', label: 'Beard Trim', price: 150, duration: 15 },
  { value: 's3', label: 'Haircut + Beard', price: 450, duration: 45 },
  { value: 's4', label: 'Hair Spa', price: 900, duration: 60 },
  { value: 's5', label: 'Facial', price: 600, duration: 45 },
  { value: 's8', label: 'Hot Towel Shave', price: 250, duration: 30 },
];

const STAFF_LIST = [
  { value: 'staff-1', label: 'Raj Kumar' },
  { value: 'staff-3', label: 'Aman Patel' },
  { value: 'staff-5', label: 'Kiran Mehta' },
];

const ALL_TIMES = [
  '09:30','10:00','10:30','11:00','11:30','12:00',
  '12:30','13:00','13:30','14:00','14:30','15:00',
  '15:30','16:00','16:30','17:00','17:30','18:00',
];

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2,'0')} ${p}`;
};

export default function AddWalkInModal({ onClose }) {
  const { addWalkin, timeSlots } = useApp();
  const { addToast } = useToast();
  const bookedTimes = timeSlots.filter(s => s.status === 'booked').map(s => s.time);

  const [form, setForm] = useState({
    customerName: '', phone: '', serviceId: 's1', staffId: 'staff-1', time: '15:30',
  });

  const selectedService = SERVICES.find(s => s.value === form.serviceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookedTimes.includes(form.time)) {
      addToast('That slot is already booked. Choose another time.', 'error');
      return;
    }
    const walkin = {
      id: `walkin-${Date.now()}`,
      customerId: null,
      customerName: form.customerName || 'Walk-in Customer',
      customerPhone: form.phone || '',
      salonId: 'salon-1',
      salonName: 'The Groom Room',
      serviceId: form.serviceId,
      serviceName: selectedService?.label,
      staffId: form.staffId,
      staffName: STAFF_LIST.find(s => s.value === form.staffId)?.label,
      date: new Date().toISOString().split('T')[0],
      time: form.time,
      duration: selectedService?.duration || 30,
      price: selectedService?.price || 300,
      regularPrice: selectedService?.price || 300,
      isSmartSlot: false,
      status: 'confirmed',
      source: 'walk-in',
      bookingId: `GRM-${Math.floor(2900 + Math.random() * 99)}`,
      createdAt: new Date().toISOString(),
    };
    addWalkin(walkin);
    addToast('Walk-in added successfully!', 'success');
    onClose();
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap}><UserPlus size={18} /></div>
            <div>
              <h2 className={styles.title}>Add Walk-in</h2>
              <p className={styles.subtitle}>Add a customer who is here right now</p>
            </div>
          </div>
          <button className={styles.close} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Customer Name <span className={styles.opt}>(optional)</span></label>
              <input className={styles.input} placeholder="e.g. Ravi Shah" value={form.customerName} onChange={e => set('customerName', e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone <span className={styles.opt}>(optional)</span></label>
              <input className={styles.input} placeholder="+91 98765 00000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Service</label>
            <select className={styles.select} value={form.serviceId} onChange={e => set('serviceId', e.target.value)}>
              {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label} — ₹{s.price}</option>)}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Staff</label>
              <select className={styles.select} value={form.staffId} onChange={e => set('staffId', e.target.value)}>
                {STAFF_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Time</label>
              <select className={styles.select} value={form.time} onChange={e => set('time', e.target.value)}>
                {ALL_TIMES.map(t => (
                  <option key={t} value={t} disabled={bookedTimes.includes(t)}>
                    {fmt(t)}{bookedTimes.includes(t) ? ' — Booked' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedService && (
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span>Duration</span><span>{selectedService.duration} min</span></div>
              <div className={styles.summaryRow}><span>Price</span><strong>₹{selectedService.price}</strong></div>
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Add Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
