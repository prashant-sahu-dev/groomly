import { useState } from 'react';
import { Plus, Users, Star, UserCheck, UserX } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import styles from './Staff.module.css';

export default function Staff() {
  const { ownerStaff, toggleStaffStatus, addStaff } = useApp();
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', workHours: '09:00 – 21:00' });

  const available = ownerStaff.filter(s => s.status === 'available').length;

  const handleAdd = (e) => {
    e.preventDefault();
    addStaff({
      id: `staff-new-${Date.now()}`,
      name: form.name,
      role: form.role,
      status: 'available',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70 + 1)}`,
      workHours: form.workHours,
    });
    addToast('Staff member added!', 'success');
    setShowAdd(false);
    setForm({ name: '', role: '', workHours: '09:00 – 21:00' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Staff</h1>
          <p className={styles.subtitle}>{available} of {ownerStaff.length} available today</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={16} />Add Staff
        </button>
      </div>

      <div className={styles.grid}>
        {ownerStaff.map(member => (
          <div key={member.id} className={styles.card}>
            <div className={styles.cardTop}>
              <img src={member.avatar} alt={member.name} className={styles.avatar} />
              <div className={[styles.statusDot, member.status === 'available' ? styles.available : styles.onLeave].join(' ')} />
            </div>
            <div className={styles.name}>{member.name}</div>
            <div className={styles.role}>{member.role}</div>
            <div className={styles.hours}>{member.workHours}</div>
            <div className={[styles.statusBadge, member.status === 'available' ? styles.availBadge : styles.leaveBadge].join(' ')}>
              {member.status === 'available' ? <><UserCheck size={12}/> Available</> : <><UserX size={12}/> On Leave</>}
            </div>
            <button
              className={styles.toggleBtn}
              onClick={() => { toggleStaffStatus(member.id); addToast(`${member.name} status updated`, 'info'); }}
            >
              {member.status === 'available' ? 'Mark On Leave' : 'Mark Available'}
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Add Staff Member</h2>
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.field}>
                <label>Full name</label>
                <input className={styles.input} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Suresh Patel" />
              </div>
              <div className={styles.field}>
                <label>Role</label>
                <select className={styles.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="Barber">Barber</option>
                  <option value="Senior Barber">Senior Barber</option>
                  <option value="Beautician">Beautician</option>
                  <option value="Senior Beautician">Senior Beautician</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Working hours</label>
                <input className={styles.input} value={form.workHours} onChange={e => setForm(f => ({ ...f, workHours: e.target.value }))} placeholder="09:00 – 21:00" />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Add member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
