import { BarChart2, TrendingUp, Users, Zap, Star } from 'lucide-react';
import styles from './Analytics.module.css';

const WEEKLY_REVENUE = [4200, 5800, 3900, 6850, 7200, 5100, 4600];
const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_REV = Math.max(...WEEKLY_REVENUE);

const MONTHLY_DATA = [
  { month: 'Apr', revenue: 62000, bookings: 87 },
  { month: 'May', revenue: 71000, bookings: 102 },
  { month: 'Jun', revenue: 68000, bookings: 94 },
  { month: 'Jul', revenue: 79000, bookings: 118 },
  { month: 'Aug', revenue: 85000, bookings: 125 },
  { month: 'Sep', revenue: 52000, bookings: 73 },
];
const MAX_MONTHLY = Math.max(...MONTHLY_DATA.map(d => d.revenue));

const TOP_SERVICES = [
  { name: 'Haircut', bookings: 48, revenue: 9552, pct: 100 },
  { name: 'Haircut + Beard', bookings: 32, revenue: 9568, pct: 90 },
  { name: 'Facial', bookings: 21, revenue: 9429, pct: 72 },
  { name: 'Hair Spa', bookings: 14, revenue: 9086, pct: 55 },
  { name: 'Beard Trim', bookings: 18, revenue: 2700, pct: 45 },
];

export default function Analytics() {
  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = MONTHLY_DATA.reduce((s, d) => s + d.bookings, 0);
  const smartRevenue = Math.round(totalRevenue * 0.31);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Performance overview — last 6 months</p>
      </div>

      {/* Summary KPIs */}
      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#EDE8FF', color: 'var(--primary)' }}><TrendingUp size={20}/></div>
          <div className={styles.kpiVal}>₹{(totalRevenue / 1000).toFixed(0)}K</div>
          <div className={styles.kpiLabel}>Total revenue</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#DBEAFE', color: '#1D4ED8' }}><Users size={20}/></div>
          <div className={styles.kpiVal}>{totalBookings}</div>
          <div className={styles.kpiLabel}>Total bookings</div>
        </div>
        <div className={styles.kpi} style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE8FF)' }}>
          <div className={styles.kpiIcon} style={{ background: 'var(--primary)', color: '#fff' }}><Zap size={20}/></div>
          <div className={styles.kpiVal} style={{ color: 'var(--primary)' }}>₹{(smartRevenue / 1000).toFixed(0)}K</div>
          <div className={styles.kpiLabel}>From Smart Slots 🎉</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiIcon} style={{ background: '#FEF3C7', color: '#D97706' }}><Star size={20}/></div>
          <div className={styles.kpiVal}>4.7</div>
          <div className={styles.kpiLabel}>Avg rating</div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>This week — daily revenue</h2>
        <div className={styles.barChart}>
          {WEEKLY_REVENUE.map((rev, i) => (
            <div key={i} className={styles.barGroup}>
              <div className={styles.barLabel}>₹{(rev / 1000).toFixed(1)}K</div>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ height: `${(rev / MAX_REV) * 100}%`, background: i === 3 ? 'var(--primary)' : 'var(--primary-light)' }}
                />
              </div>
              <div className={styles.dayLabel}>{DAYS_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly revenue bars */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Monthly revenue (last 6 months)</h2>
        <div className={styles.monthChart}>
          {MONTHLY_DATA.map((d, i) => (
            <div key={i} className={styles.monthRow}>
              <div className={styles.monthName}>{d.month}</div>
              <div className={styles.monthBarWrap}>
                <div
                  className={styles.monthBar}
                  style={{ width: `${(d.revenue / MAX_MONTHLY) * 100}%` }}
                />
              </div>
              <div className={styles.monthVal}>₹{(d.revenue / 1000).toFixed(0)}K</div>
              <div className={styles.monthBookings}>{d.bookings} bookings</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top services */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Top services by bookings</h2>
        <div className={styles.serviceList}>
          {TOP_SERVICES.map((s, i) => (
            <div key={i} className={styles.serviceRow}>
              <div className={styles.serviceRank}>#{i + 1}</div>
              <div className={styles.serviceInfo}>
                <div className={styles.serviceName}>{s.name}</div>
                <div className={styles.serviceBarWrap}>
                  <div className={styles.serviceBar} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
              <div className={styles.serviceMeta}>
                <span className={styles.serviceBookings}>{s.bookings} bookings</span>
                <span className={styles.serviceRevenue}>₹{s.revenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
