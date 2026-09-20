import { useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { customers } from '../../../data/customers';
import styles from './Customers.module.css';

export default function Customers() {
  const [search, setSearch] = useState('');
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>{filtered.length} customers found</p>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Visits</th>
              <th>Total Spent</th>
              <th>Smart Savings</th>
              <th>Last Visit</th>
              <th>No-shows</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className={styles.row}>
                <td>
                  <div className={styles.customerCell}>
                    <img src={c.avatar} alt={c.name} className={styles.avatar} />
                    <div>
                      <div className={styles.customerName}>{c.name}</div>
                      <div className={styles.favouriteService}>{c.favouriteService}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contact}><Phone size={12}/>{c.phone}</div>
                  <div className={styles.contact}><Mail size={12}/>{c.email}</div>
                </td>
                <td className={styles.num}>{c.visits}</td>
                <td className={styles.num}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                <td>
                  <span className={styles.savings}>₹{c.smartSlotSavings.toLocaleString('en-IN')}</span>
                </td>
                <td className={styles.date}>{c.lastVisit}</td>
                <td>
                  <span className={c.noShows > 0 ? styles.noShow : styles.noShowOk}>{c.noShows}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
