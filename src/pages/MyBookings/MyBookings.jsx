import { useState } from 'react';
import { Calendar, Package } from 'lucide-react';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useApp } from '../../context/AppContext';
import styles from './MyBookings.module.css';

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

export default function MyBookings() {
  const { appointments, currentUserId } = useApp();
  const [activeTab, setActiveTab] = useState('Upcoming');

  const myBookings = appointments.filter(a => a.customerId === currentUserId);
  const today = new Date().toISOString().split('T')[0];

  const upcoming = myBookings.filter(a => a.status === 'confirmed' || (a.status !== 'cancelled' && a.status !== 'completed' && a.date >= today));
  const completed = myBookings.filter(a => a.status === 'completed');
  const cancelled = myBookings.filter(a => a.status === 'cancelled');

  const tabData = { 'Upcoming': upcoming, 'Completed': completed, 'Cancelled': cancelled };
  const current = tabData[activeTab] || [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>Manage your upcoming and past appointments</p>
        </div>

        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={[styles.tab, activeTab === tab ? styles.activeTab : ''].join(' ')}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className={styles.count}>{tabData[tab].length}</span>
            </button>
          ))}
        </div>

        {current.length > 0 ? (
          <div className={styles.list}>
            {current.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)}
          </div>
        ) : (
          <EmptyState
            icon={<Calendar size={28} />}
            title={`No ${activeTab.toLowerCase()} appointments`}
            description={activeTab === 'Upcoming' ? "Your upcoming appointments will appear here." : `No ${activeTab.toLowerCase()} appointments yet.`}
            cta={activeTab === 'Upcoming' ? 'Explore salons' : undefined}
            ctaLink="/salons"
          />
        )}
      </div>
    </div>
  );
}
