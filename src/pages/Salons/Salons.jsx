import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Zap, X } from 'lucide-react';
import SalonCard from '../../components/SalonCard/SalonCard';
import { salons } from '../../data/salons';
import styles from './Salons.module.css';

const CATEGORIES = ['All', 'Men', 'Women', 'Unisex'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Rating' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'distance', label: 'Distance' },
];

export default function Salons() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [smartOnly, setSmartOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState('recommended');

  const filtered = useMemo(() => {
    let list = [...salons];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') list = list.filter(s => s.category === category);
    if (smartOnly) list = list.filter(s => s.hasSmartSlots);
    if (openOnly) list = list.filter(s => s.isOpen);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'price') list.sort((a, b) => a.startingPrice - b.startingPrice);
    return list;
  }, [search, category, smartOnly, openOnly, sort]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Salons near you</h1>
            <p className={styles.subtitle}>Ahmedabad & Gandhinagar · {filtered.length} salons found</p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by name or area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={[styles.filterChip, category === cat ? styles.active : ''].join(' ')}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}

            <button
              className={[styles.filterChip, styles.smartChip, smartOnly ? styles.smartActive : ''].join(' ')}
              onClick={() => setSmartOnly(v => !v)}
            >
              <Zap size={13} /> Smart Slots
            </button>

            <button
              className={[styles.filterChip, openOnly ? styles.active : ''].join(' ')}
              onClick={() => setOpenOnly(v => !v)}
            >
              Open now
            </button>
          </div>

          <div className={styles.sortWrap}>
            <SlidersHorizontal size={15} className={styles.sortIcon} />
            <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(salon => <SalonCard key={salon.id} salon={salon} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <Search size={40} />
            <h3>No salons found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setSmartOnly(false); setOpenOnly(false); }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
