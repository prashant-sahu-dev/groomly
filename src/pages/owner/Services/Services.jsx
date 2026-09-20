import { useState } from 'react';
import { Plus, Edit2, Zap, Power } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import styles from './Services.module.css';

export default function Services() {
  const { ownerServices, toggleService, addService, updateService } = useApp();
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', price:'', smartPrice:'', duration:'', enabled:true });

  const openAdd = () => { setForm({ name:'', price:'', smartPrice:'', duration:'', enabled:true }); setEditing(null); setShowAdd(true); };
  const openEdit = (svc) => { setForm({ name:svc.name, price:svc.price, smartPrice:svc.smartPrice||'', duration:svc.duration, enabled:svc.enabled }); setEditing(svc.id); setShowAdd(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateService(editing, { name:form.name, price:Number(form.price), smartPrice:form.smartPrice?Number(form.smartPrice):null, duration:Number(form.duration) });
      addToast('Service updated!', 'success');
    } else {
      addService({ id:`s-new-${Date.now()}`, name:form.name, price:Number(form.price), smartPrice:form.smartPrice?Number(form.smartPrice):null, duration:Number(form.duration), enabled:true });
      addToast('Service added!', 'success');
    }
    setShowAdd(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.subtitle}>{ownerServices.filter(s=>s.enabled).length} active services</p>
        </div>
        <button className={styles.addBtn} onClick={openAdd}><Plus size={16}/>Add Service</button>
      </div>

      <div className={styles.grid}>
        {ownerServices.map(svc => (
          <div key={svc.id} className={[styles.card, !svc.enabled ? styles.disabled : ''].join(' ')}>
            <div className={styles.cardTop}>
              <div>
                <div className={styles.svcName}>{svc.name}</div>
                <div className={styles.svcDuration}>{svc.duration} min</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.iconBtn} onClick={() => openEdit(svc)} title="Edit"><Edit2 size={15}/></button>
                <button className={[styles.iconBtn, !svc.enabled ? styles.offBtn : ''].join(' ')} onClick={() => { toggleService(svc.id); addToast(svc.enabled?'Service disabled':'Service enabled','info'); }} title={svc.enabled?'Disable':'Enable'}>
                  <Power size={15}/>
                </button>
              </div>
            </div>
            <div className={styles.pricing}>
              <div className={styles.priceBox}>
                <span className={styles.priceLabel}>Regular</span>
                <span className={styles.priceVal}>₹{svc.price}</span>
              </div>
              {svc.smartPrice && (
                <div className={[styles.priceBox, styles.smartBox].join(' ')}>
                  <span className={styles.priceLabel}><Zap size={10}/>Smart</span>
                  <span className={styles.smartVal}>₹{svc.smartPrice}</span>
                </div>
              )}
            </div>
            {!svc.enabled && <div className={styles.disabledBadge}>Disabled</div>}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className={styles.overlay} onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editing ? 'Edit Service' : 'Add Service'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Service name</label>
                <input className={styles.input} required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Hair Color"/>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Regular price (₹)</label>
                  <input className={styles.input} type="number" required value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="300"/>
                </div>
                <div className={styles.field}>
                  <label>Smart Slot price (₹)</label>
                  <input className={styles.input} type="number" value={form.smartPrice} onChange={e=>setForm(f=>({...f,smartPrice:e.target.value}))} placeholder="Optional"/>
                </div>
              </div>
              <div className={styles.field}>
                <label>Duration (minutes)</label>
                <input className={styles.input} type="number" required value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} placeholder="30"/>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>{editing ? 'Save changes' : 'Add service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
