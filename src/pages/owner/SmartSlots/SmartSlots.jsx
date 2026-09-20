import { useState } from 'react';
import { Zap, Plus, X, Info } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import styles from './SmartSlots.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SERVICES = ['Haircut', 'Beard Trim', 'Haircut + Beard', 'Hair Spa', 'Facial', 'Hair Color', 'Hot Towel Shave'];

export default function SmartSlots() {
  const { smartSlotRules, smartSlotsEnabled, toggleSmartSlotRule, addSmartSlotRule } = useApp();
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ day: 'Monday', startTime: '11:00', endTime: '16:00', service: 'Haircut', regularPrice: 300, smartPrice: 199 });
  const [globalEnabled, setGlobalEnabled] = useState(smartSlotsEnabled);

  const totalEarned = 23 * 102;
  const totalBookings = 23;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = (e) => {
    e.preventDefault();
    addSmartSlotRule({
      id: `sr-new-${Date.now()}`,
      ...form,
      regularPrice: Number(form.regularPrice),
      smartPrice: Number(form.smartPrice),
      enabled: true,
    });
    addToast('Smart Slot rule added!', 'success');
    setShowAdd(false);
  };

  const discount = (reg, smart) => Math.round((1 - smart / reg) * 100);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}><Zap size={24} style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /> Smart Slots</h1>
          <p className={styles.subtitle}>Set off-peak pricing to fill empty appointment slots automatically.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={16} />Add Rule
        </button>
      </div>

      {/* How it works */}
      <div className={styles.infoBox}>
        <div className={styles.infoIcon}><Info size={18} /></div>
        <div>
          <div className={styles.infoTitle}>How Smart Slots work</div>
          <div className={styles.infoDesc}>
            You define time windows when your salon is typically quiet. GROOMLY automatically shows customers a discounted price for those slots. When a customer books a Smart Slot, you get revenue from what was otherwise an empty chair.
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: 'var(--primary)' }}>{totalBookings}</div>
          <div className={styles.statLabel}>Smart Slot bookings this week</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal} style={{ color: 'var(--success)' }}>₹{totalEarned.toLocaleString('en-IN')}</div>
          <div className={styles.statLabel}>Additional revenue generated</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{smartSlotRules.filter(r => r.enabled).length}</div>
          <div className={styles.statLabel}>Active rules</div>
        </div>
      </div>

      {/* Global toggle */}
      <div className={styles.globalToggle}>
        <div>
          <div className={styles.toggleTitle}>Smart Slots {globalEnabled ? 'enabled' : 'disabled'}</div>
          <div className={styles.toggleSub}>{globalEnabled ? 'Active rules are visible to customers on GROOMLY.' : 'Smart Slots are paused — no discounts shown to customers.'}</div>
        </div>
        <button
          className={[styles.toggleBtn, globalEnabled ? styles.toggleOn : styles.toggleOff].join(' ')}
          onClick={() => { setGlobalEnabled(v => !v); addToast(`Smart Slots ${globalEnabled ? 'disabled' : 'enabled'}`, 'info'); }}
        >
          {globalEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Rules */}
      <div className={styles.rulesSection}>
        <h2 className={styles.rulesTitle}>Pricing rules</h2>
        <div className={styles.rulesList}>
          {smartSlotRules.map(rule => (
            <div key={rule.id} className={[styles.ruleCard, !rule.enabled ? styles.ruleDisabled : ''].join(' ')}>
              <div className={styles.ruleLeft}>
                <div className={styles.ruleDay}>{rule.day}</div>
                <div className={styles.ruleTime}>{rule.startTime} – {rule.endTime}</div>
                <div className={styles.ruleService}>{rule.service}</div>
              </div>
              <div className={styles.ruleCenter}>
                <div className={styles.ruleDiscount}>-{discount(rule.regularPrice, rule.smartPrice)}% off</div>
                <div className={styles.rulePricing}>
                  <span className={styles.ruleRegular}>₹{rule.regularPrice}</span>
                  <span className={styles.ruleSmart}>₹{rule.smartPrice}</span>
                </div>
              </div>
              <div className={styles.ruleRight}>
                <button
                  className={[styles.ruleToggle, rule.enabled ? styles.ruleOn : styles.ruleOff].join(' ')}
                  onClick={() => { toggleSmartSlotRule(rule.id); addToast(`Rule ${rule.enabled ? 'disabled' : 'enabled'}`, 'info'); }}
                >
                  {rule.enabled ? 'Active' : 'Paused'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add rule modal */}
      {showAdd && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Smart Slot Rule</h2>
              <button className={styles.closeBtn} onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Day</label>
                  <select className={styles.input} value={form.day} onChange={e => set('day', e.target.value)}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Service</label>
                  <select className={styles.input} value={form.service} onChange={e => set('service', e.target.value)}>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Start time</label>
                  <input className={styles.input} type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>End time</label>
                  <input className={styles.input} type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Regular price (₹)</label>
                  <input className={styles.input} type="number" required value={form.regularPrice} onChange={e => set('regularPrice', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Smart Slot price (₹)</label>
                  <input className={styles.input} type="number" required value={form.smartPrice} onChange={e => set('smartPrice', e.target.value)} />
                </div>
              </div>
              {form.regularPrice && form.smartPrice && (
                <div className={styles.previewRow}>
                  <Zap size={14} />
                  Customers save <strong>₹{form.regularPrice - form.smartPrice}</strong> ({discount(form.regularPrice, form.smartPrice)}% off) during this window
                </div>
              )}
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn}>Add rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
