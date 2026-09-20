import { Link } from 'react-router-dom';
import { User, Mail, Phone, Star, Zap, Calendar, TrendingUp, Heart } from 'lucide-react';
import { currentUser } from '../../data/customers';
import { useApp } from '../../context/AppContext';
import { salons } from '../../data/salons';
import styles from './Profile.module.css';

export default function Profile() {
  const { appointments } = useApp();
  const myBookings = appointments.filter(a => a.customerId === currentUser.id);
  const upcoming = myBookings.filter(a => a.status === 'confirmed');
  const completed = myBookings.filter(a => a.status === 'completed');
  const favSalons = salons.filter(s => currentUser.favouriteSalons.includes(s.id));
  const totalSavings = myBookings.filter(a => a.isSmartSlot).reduce((sum, a) => sum + (a.regularPrice - a.price), 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Profile header */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <img src={currentUser.avatar} alt={currentUser.name} />
          </div>
          <div className={styles.info}>
            <h1 className={styles.name}>{currentUser.name}</h1>
            <p className={styles.memberSince}>Member since {new Date(currentUser.memberSince).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</p>
            <div className={styles.contactRow}>
              <span className={styles.contact}><Mail size={14}/>{currentUser.email}</span>
              <span className={styles.contact}><Phone size={14}/>{currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background:'#EDE8FF',color:'#6C47FF'}}><Calendar size={20}/></div>
            <div className={styles.statVal}>{currentUser.totalBookings}</div>
            <div className={styles.statLabel}>Total bookings</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background:'#F0FDF4',color:'#16A34A'}}><TrendingUp size={20}/></div>
            <div className={styles.statVal}>₹{(currentUser.totalSpent + myBookings.filter(a=>a.status==='confirmed').reduce((s,a)=>s+a.price,0)).toLocaleString('en-IN')}</div>
            <div className={styles.statLabel}>Total spent</div>
          </div>
          <div className={styles.statCard} style={{background:'linear-gradient(135deg,#EDE8FF,#F5F3FF)'}}>
            <div className={styles.statIcon} style={{background:'#6C47FF',color:'#fff'}}><Zap size={20}/></div>
            <div className={styles.statVal} style={{color:'#6C47FF'}}>₹{(currentUser.smartSlotSavings + totalSavings).toLocaleString('en-IN')}</div>
            <div className={styles.statLabel}>Smart Slot savings 🎉</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{background:'#FEF3C7',color:'#D97706'}}><Star size={20}/></div>
            <div className={styles.statVal}>{currentUser.noShows}</div>
            <div className={styles.statLabel}>No-shows</div>
          </div>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming appointments</h2>
              <Link to="/bookings" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.upcomingList}>
              {upcoming.slice(0,2).map(apt => (
                <div key={apt.id} className={styles.upcomingItem}>
                  <div className={styles.upcomingLeft}>
                    <div className={styles.upcomingService}>{apt.serviceName}</div>
                    <div className={styles.upcomingSalon}>{apt.salonName}</div>
                  </div>
                  <div className={styles.upcomingRight}>
                    <div className={styles.upcomingDate}>{apt.date}</div>
                    <div className={styles.upcomingTime}>{apt.time}</div>
                    <div className={styles.upcomingPrice}>₹{apt.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favourite salons */}
        {favSalons.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><Heart size={16}/> Favourite salons</h2>
            <div className={styles.favGrid}>
              {favSalons.map(salon => (
                <Link key={salon.id} to={`/salon/${salon.id}`} className={styles.favCard}>
                  <img src={salon.image} alt={salon.name} className={styles.favImg}/>
                  <div className={styles.favName}>{salon.name}</div>
                  <div className={styles.favArea}>{salon.area}</div>
                  <div className={styles.favRating}><Star size={12} fill="#F59E0B" color="#F59E0B"/>{salon.rating}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
