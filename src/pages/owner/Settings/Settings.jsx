import { useState } from 'react';
import { Save, Bell, Clock, MapPin, Phone, Globe } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import styles from './Settings.module.css';

export default function Settings() {
  const { addToast } = useToast();
  const [salon, setSalon] = useState({
    name: 'The Groom Room',
    phone: '+91 98765 43210',
    address: 'Shop 12, Prahlad Nagar Garden Road, Ahmedabad — 380015',
    openTime: '09:00',
    closeTime: '21:00',
    website: '',
    about: "The Groom Room is Ahmedabad's premium grooming destination.",
  });
  const [notifs, setNotifs] = useState({ newBooking: true, cancellations: true, dailySummary: true, noShows: true });

  const set = (k, v) => setSalon(s => ({ ...s, [k]: v }));
  const setN = (k, v) => setNotifs(n => ({ ...n, [k]: v }));

  const handleSave = () => addToast('Settings saved!', 'success');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <button className={styles.saveBtn} onClick={handleSave}><Save size={16}/>Save changes</button>
      </div>

      {/* Salon info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Salon Information</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Salon name</label>
            <div className={styles.inputWrap}>
              <Globe size={15} className={styles.inputIcon} />
              <input className={styles.input} value={salon.name} onChange={e => set('name', e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <div className={styles.inputWrap}>
              <Phone size={15} className={styles.inputIcon} />
              <input className={styles.input} value={salon.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>Address</label>
            <div className={styles.inputWrap}>
              <MapPin size={15} className={styles.inputIcon} />
              <input className={styles.input} value={salon.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Opening time</label>
            <div className={styles.inputWrap}>
              <Clock size={15} className={styles.inputIcon} />
              <input className={styles.input} type="time" value={salon.openTime} onChange={e => set('openTime', e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Closing time</label>
            <div className={styles.inputWrap}>
              <Clock size={15} className={styles.inputIcon} />
              <input className={styles.input} type="time" value={salon.closeTime} onChange={e => set('closeTime', e.target.value)} />
            </div>
          </div>
          <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label}>About</label>
            <textarea className={styles.textarea} rows={3} value={salon.about} onChange={e => set('about', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <div className={styles.notifList}>
          {[
            { key: 'newBooking', label: 'New online booking', desc: 'Get notified when a customer books via GROOMLY' },
            { key: 'cancellations', label: 'Cancellations', desc: 'Alert when a customer cancels an appointment' },
            { key: 'noShows', label: 'No-shows', desc: 'Track when customers do not show up' },
            { key: 'dailySummary', label: 'Daily summary', desc: 'Receive a daily recap of appointments and revenue' },
          ].map(n => (
            <div key={n.key} className={styles.notifRow}>
              <Bell size={18} className={styles.notifIcon} />
              <div className={styles.notifInfo}>
                <div className={styles.notifLabel}>{n.label}</div>
                <div className={styles.notifDesc}>{n.desc}</div>
              </div>
              <button
                className={[styles.toggle, notifs[n.key] ? styles.toggleOn : styles.toggleOff].join(' ')}
                onClick={() => setN(n.key, !notifs[n.key])}
              >
                <div className={styles.toggleThumb} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Demo note */}
      <div className={styles.demoNote}>
        ⚠️ This is a demo dashboard. Settings are not persisted to a server.
      </div>
    </div>
  );
}
