import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import AppointmentStatusBadge from '../../../components/AppointmentStatusBadge/AppointmentStatusBadge';
import AddWalkInModal from '../../../components/AddWalkInModal/AddWalkInModal';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import { Plus, AlertTriangle } from 'lucide-react';
import styles from './Appointments.module.css';

const STATUS_OPTIONS = ['all', 'confirmed', 'arrived', 'in-service', 'completed', 'cancelled', 'no-show'];

const fmt12 = (t) => { if(!t) return ''; const [h,m]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; const hr=h>12?h-12:h===0?12:h; return `${hr}:${m.toString().padStart(2,'0')} ${p}`; };

export default function Appointments() {
  const { ownerAppointments, updateAppointmentStatus, cancelAppointment } = useApp();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [noShowId, setNoShowId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = ownerAppointments
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => !search || a.customerName.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.createdAt?.localeCompare(a.createdAt || ''));

  const handleStatus = (id, status) => {
    updateAppointmentStatus(id, status);
    addToast(`Status updated to ${status}`, 'success');
    setSelected(null);
  };

  const STATUS_ACTIONS = {
    confirmed: [
      { label: 'Mark Arrived', status: 'arrived' },
      { label: 'Start Service', status: 'in-service' },
      { label: 'No-show', status: 'no-show', danger: true },
    ],
    arrived: [{ label: 'Start Service', status: 'in-service' }, { label: 'No-show', status: 'no-show', danger: true }],
    'in-service': [{ label: 'Complete', status: 'completed' }],
  };

  const apt = selected ? ownerAppointments.find(a => a.id === selected) : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Appointments</h1>
          <p className={styles.subtitle}>{filtered.length} appointments</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowWalkIn(true)}><Plus size={16}/>Add Walk-in</button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon}/>
          <input className={styles.searchInput} placeholder="Search customer or service..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className={styles.statusFilters}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} className={[styles.chip, statusFilter===s?styles.activeChip:''].join(' ')} onClick={()=>setStatusFilter(s)}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date &amp; Time</th>
              <th>Staff</th>
              <th>Source</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className={[styles.row, selected===a.id ? styles.selectedRow : ''].join(' ')} onClick={()=>setSelected(a.id===selected?null:a.id)}>
                <td>
                  <div className={styles.customerName}>{a.customerName}</div>
                  <div className={styles.customerPhone}>{a.customerPhone}</div>
                </td>
                <td className={styles.service}>{a.serviceName}</td>
                <td>
                  <div className={styles.date}>{a.date}</div>
                  <div className={styles.time}>{fmt12(a.time)}</div>
                </td>
                <td className={styles.staff}>{a.staffName}</td>
                <td>
                  <span className={[styles.sourceBadge, a.source==='walk-in'?styles.walkIn:styles.online].join(' ')}>
                    {a.source==='walk-in'?'Walk-in':'Online'}
                  </span>
                </td>
                <td className={styles.price}>₹{a.price}</td>
                <td><AppointmentStatusBadge status={a.status}/></td>
                <td>
                  <div className={styles.rowActions}>
                    {(STATUS_ACTIONS[a.status]||[]).map(action => (
                      <button
                        key={action.status}
                        className={[styles.actionBtn, action.danger?styles.dangerBtn:''].join(' ')}
                        onClick={e=>{e.stopPropagation(); action.status==='no-show'?setNoShowId(a.id):handleStatus(a.id,action.status);}}
                      >{action.label}</button>
                    ))}
                    {a.status==='confirmed' && (
                      <button className={[styles.actionBtn, styles.dangerBtn].join(' ')} onClick={e=>{e.stopPropagation();setCancelId(a.id);}}>Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div className={styles.empty}><Search size={32}/><p>No appointments found.</p></div>
        )}
      </div>

      {noShowId && (
        <ConfirmationModal
          title="Mark as no-show?"
          description="This customer did not arrive for their appointment."
          confirmLabel="Mark No-show"
          confirmVariant="warning"
          warning="Customer has 1 recorded no-show."
          icon={<AlertTriangle size={24}/>}
          onConfirm={()=>{handleStatus(noShowId,'no-show');setNoShowId(null);addToast('Marked as no-show','warning');}}
          onCancel={()=>setNoShowId(null)}
        />
      )}
      {cancelId && (
        <ConfirmationModal
          title="Cancel this appointment?"
          description="This will free the slot and notify the customer."
          confirmLabel="Cancel appointment"
          confirmVariant="danger"
          onConfirm={()=>{cancelAppointment(cancelId);setCancelId(null);addToast('Appointment cancelled','info');}}
          onCancel={()=>setCancelId(null)}
        />
      )}
      {showWalkIn && <AddWalkInModal onClose={()=>setShowWalkIn(false)}/>}
    </div>
  );
}
