import { Link } from 'react-router-dom';
import { Search, MapPin, Scissors, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonCard from '../../components/SalonCard/SalonCard';
import SmartSlotCard from '../../components/SmartSlotCard/SmartSlotCard';
import { getFeaturedSalons } from '../../data/salons';
import styles from './Home.module.css';

const SMART_DEALS = [
  { id: 1, salonId: 'salon-1', salon: 'The Groom Room', service: 'Haircut', regularPrice: 300, smartPrice: 199, time: '2:00 PM' },
  { id: 2, salonId: 'salon-1', salon: 'The Groom Room', service: 'Haircut + Beard', regularPrice: 450, smartPrice: 299, time: '3:30 PM' },
  { id: 3, salonId: 'salon-2', salon: 'Urban Cuts', service: 'Haircut', regularPrice: 300, smartPrice: 149, time: '1:00 PM' },
  { id: 4, salonId: 'salon-4', salon: 'The Barber House', service: 'Beard Trim', regularPrice: 150, smartPrice: 99, time: '11:30 AM' },
  { id: 5, salonId: 'salon-6', salon: 'Looks & Layers', service: 'Hair Spa', regularPrice: 900, smartPrice: 649, time: '12:00 PM' },
  { id: 6, salonId: 'salon-9', salon: 'The Craft Barber', service: 'Hot Towel Shave', regularPrice: 250, smartPrice: 179, time: '2:30 PM' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: 'Ahmedabad', service: '', date: 'Today' });
  const featuredSalons = getFeaturedSalons();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/salons');
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}><Zap size={13} /> Smart pricing for empty slots</div>
          <h1 className={styles.heroTitle}>
            Find your next salon.<br />Book the right time.
          </h1>
          <p className={styles.heroSubtitle}>
            Discover trusted salons around you, compare services and prices, and grab exclusive off-peak deals.
          </p>

          <form className={styles.searchBox} onSubmit={handleSearch}>
            <div className={styles.searchField}>
              <MapPin size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Location"
                value={search.location}
                onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              />
            </div>
            <div className={styles.searchDivider} />
            <div className={styles.searchField}>
              <Scissors size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Service (e.g. Haircut)"
                value={search.service}
                onChange={e => setSearch(s => ({ ...s, service: e.target.value }))}
              />
            </div>
            <div className={styles.searchDivider} />
            <div className={styles.searchField}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Date"
                value={search.date}
                onChange={e => setSearch(s => ({ ...s, date: e.target.value }))}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>Find salons</button>
          </form>

          <div className={styles.heroStats}>
            <div className={styles.stat}><strong>500+</strong><span>Salons</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><strong>12k+</strong><span>Bookings</span></div>
            <div className={styles.statDiv} />
            <div className={styles.stat}><strong>4.8 ⭐</strong><span>Avg Rating</span></div>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=85"
            alt="Premium salon"
            className={styles.heroImg}
          />
          <div className={styles.floatingCard}>
            <div className={styles.floatIcon}><Zap size={14} /></div>
            <div>
              <div className={styles.floatTitle}>Smart Slot saved!</div>
              <div className={styles.floatSub}>Haircut ₹199 · 2:00 PM today</div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Slots Section — MOST IMPORTANT */}
      <section className={styles.smartSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionLabel}><Zap size={14} /> Smart Slots</div>
              <h2 className={styles.sectionTitle}>Great prices when salons have more availability.</h2>
              <p className={styles.sectionSub}>Book off-peak slots and save big. Salons fill empty chairs — you get a better price.</p>
            </div>
            <Link to="/salons" className={styles.viewAll}>View all deals <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.smartGrid}>
            {SMART_DEALS.map(deal => (
              <SmartSlotCard key={deal.id} {...deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionLabel}><Star size={14} /> Featured</div>
              <h2 className={styles.sectionTitle}>Top-rated salons near you</h2>
            </div>
            <Link to="/salons" className={styles.viewAll}>See all <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.salonGrid}>
            {featuredSalons.map(salon => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      </section>

      {/* Why GROOMLY */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyHeader}>
            <h2 className={styles.sectionTitle}>Why GROOMLY?</h2>
            <p className={styles.sectionSub}>The smarter way to book salon appointments.</p>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon} style={{ background: '#EDE8FF', color: '#6C47FF' }}>
                <MapPin size={24} />
              </div>
              <h3>Discover</h3>
              <p>Find trusted salons near you with real ratings and reviews.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon} style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <Zap size={24} />
              </div>
              <h3>Save</h3>
              <p>Get better prices during low-demand hours with Smart Slots.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon} style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
                <CheckCircle size={24} />
              </div>
              <h3>Book</h3>
              <p>Choose a real available slot and confirm your appointment instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner CTA */}
      <section className={styles.ownerSection}>
        <div className={styles.container}>
          <div className={styles.ownerCard}>
            <div className={styles.ownerLeft}>
              <div className={styles.ownerTag}>For Salon Owners</div>
              <h2 className={styles.ownerTitle}>Turn empty chairs into revenue.</h2>
              <p className={styles.ownerDesc}>
                Manage online + offline bookings, fill low-demand slots with Smart Slots pricing, track customers, and understand your salon performance — all in one dashboard.
              </p>
              <div className={styles.ownerFeatures}>
                {['Manage online + offline bookings', 'Fill low-demand slots', 'Staff management', 'Track customers & no-shows', 'Real-time analytics'].map(f => (
                  <div key={f} className={styles.ownerFeature}><CheckCircle size={14} />{f}</div>
                ))}
              </div>
              <Link to="/owner" className={styles.ownerBtn}>View Owner Dashboard <ArrowRight size={16} /></Link>
            </div>
            <div className={styles.ownerRight}>
              <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=85" alt="Salon owner" className={styles.ownerImg} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}><Scissors size={16} strokeWidth={2.5} /></div>
                <span>GROOMLY</span>
              </div>
              <p className={styles.footerTagline}>Book smarter. Look better.</p>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Customers</div>
              <Link to="/salons" className={styles.footerLink}>Explore salons</Link>
              <Link to="/bookings" className={styles.footerLink}>My bookings</Link>
              <Link to="/profile" className={styles.footerLink}>Profile</Link>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Salon owners</div>
              <Link to="/owner" className={styles.footerLink}>Owner dashboard</Link>
              <Link to="/owner/smart-slots" className={styles.footerLink}>Smart Slots</Link>
              <Link to="/owner/analytics" className={styles.footerLink}>Analytics</Link>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.footerColTitle}>Company</div>
              <span className={styles.footerLink}>About</span>
              <span className={styles.footerLink}>Contact</span>
              <span className={styles.footerLink}>Privacy</span>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 GROOMLY. All rights reserved.</span>
            <span>Made with ❤️ for salon owners across India.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
