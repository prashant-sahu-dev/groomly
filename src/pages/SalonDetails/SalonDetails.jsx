import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { getSalonById } from '../../data/salons';
import { services as allServices } from '../../data/services';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge/Badge';
import styles from './SalonDetails.module.css';

const fmt12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
};

export default function SalonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = getSalonById(id);
  const { timeSlots } = useApp();
  const [imgIdx, setImgIdx] = useState(0);

  if (!salon) return (
    <div className={styles.notFound}>
      <h2>Salon not found.</h2>
      <Link to="/salons">← Back to salons</Link>
    </div>
  );

  const salonServices = allServices.filter(s => salon.services.includes(s.id));
  const allImages = [salon.image, ...salon.gallery].filter(Boolean);

  const slotList = id === 'salon-1' ? timeSlots : [
    { time: '10:00', label: '10:00 AM', status: 'available', isSmartSlot: false, price: salon.startingPrice },
    { time: '11:00', label: '11:00 AM', status: 'smart', isSmartSlot: true, price: Math.round(salon.startingPrice * 0.66) },
    { time: '12:00', label: '12:00 PM', status: 'smart', isSmartSlot: true, price: Math.round(salon.startingPrice * 0.66) },
    { time: '13:00', label: '1:00 PM', status: 'booked', isSmartSlot: false, price: salon.startingPrice },
    { time: '14:00', label: '2:00 PM', status: 'smart', isSmartSlot: true, price: Math.round(salon.startingPrice * 0.66) },
    { time: '15:00', label: '3:00 PM', status: 'available', isSmartSlot: false, price: salon.startingPrice },
    { time: '16:00', label: '4:00 PM', status: 'available', isSmartSlot: false, price: salon.startingPrice },
    { time: '17:00', label: '5:00 PM', status: 'booked', isSmartSlot: false, price: salon.startingPrice },
    { time: '18:00', label: '6:00 PM', status: 'available', isSmartSlot: false, price: salon.startingPrice },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button className={styles.back} onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImg}>
            <img src={allImages[imgIdx]} alt={salon.name} />
          </div>
          {allImages.length > 1 && (
            <div className={styles.thumbs}>
              {allImages.slice(0, 4).map((img, i) => (
                <div key={i} className={[styles.thumb, imgIdx === i ? styles.activeThumb : ''].join(' ')} onClick={() => setImgIdx(i)}>
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.layout}>
          {/* Left */}
          <div className={styles.main}>
            <div className={styles.salonHeader}>
              <div>
                <div className={styles.badges}>
                  <Badge variant={salon.category === 'Men' ? 'men' : salon.category === 'Women' ? 'women' : 'unisex'}>
                    {salon.category}
                  </Badge>
                  {salon.hasSmartSlots && <Badge variant="smart"><Zap size={11} /> Smart Slots Available</Badge>}
                </div>
                <h1 className={styles.salonName}>{salon.name}</h1>
                <div className={styles.meta}>
                  <span className={styles.metaItem}><Star size={15} fill="#F59E0B" color="#F59E0B" /><strong>{salon.rating}</strong><span className={styles.reviews}>({salon.reviewCount} reviews)</span></span>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}><MapPin size={14} />{salon.area}, {salon.city}</span>
                  <span className={styles.metaSep}>·</span>
                  <span className={styles.metaItem}><Clock size={14} />{salon.isOpen ? `Open until ${salon.closeTime}` : 'Closed'}</span>
                </div>
                <p className={styles.address}><Phone size={13} /> {salon.phone} &nbsp;·&nbsp; <MapPin size={13} /> {salon.address}</p>
              </div>
            </div>

            {/* About */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.about}>{salon.about}</p>
              <div className={styles.amenities}>
                {salon.amenities.map(a => <span key={a} className={styles.amenity}><CheckCircle size={13} />{a}</span>)}
              </div>
            </div>

            {/* Services */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Services</h2>
              <div className={styles.servicesList}>
                {salonServices.map(service => (
                  <div key={service.id} className={styles.serviceRow}>
                    <div className={styles.serviceInfo}>
                      <div className={styles.serviceName}>{service.name}</div>
                      <div className={styles.serviceDesc}>{service.description}</div>
                      <div className={styles.serviceDuration}>{service.duration} min</div>
                    </div>
                    <div className={styles.servicePrice}>
                      {service.hasSmartSlot ? (
                        <>
                          <span className={styles.regularPrice}>₹{service.regularPrice}</span>
                          <span className={styles.smartPrice}>₹{service.smartSlotPrice}</span>
                          <Badge variant="smart" size="sm"><Zap size={10} />Smart</Badge>
                        </>
                      ) : (
                        <span className={styles.price}>₹{service.regularPrice}</span>
                      )}
                    </div>
                    <Link to={`/booking/${salon.id}?service=${service.id}`} className={styles.bookBtn}>Book</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Available today</h2>
              <div className={styles.slotGrid}>
                {slotList.map(slot => (
                  <Link
                    key={slot.time}
                    to={slot.status !== 'booked' ? `/booking/${salon.id}?time=${slot.time}` : '#'}
                    className={[
                      styles.slot,
                      slot.status === 'booked' ? styles.slotBooked :
                      slot.status === 'smart' ? styles.slotSmart : styles.slotAvail
                    ].join(' ')}
                  >
                    <span className={styles.slotTime}>{slot.label}</span>
                    {slot.status === 'smart' && <span className={styles.slotPrice}>₹{slot.price} <Zap size={11} /></span>}
                    {slot.status === 'available' && <span className={styles.slotPrice}>₹{slot.price}</span>}
                    {slot.status === 'booked' && <span className={styles.slotBooked2}>Booked</span>}
                  </Link>
                ))}
              </div>
              <div className={styles.slotLegend}>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'var(--success)'}} />Available</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'var(--primary)'}} />Smart Slot</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'var(--border)'}} />Booked</span>
              </div>
            </div>
          </div>

          {/* Sticky Book CTA */}
          <div className={styles.bookingSidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.bookingPrice}>
                <span className={styles.from}>from</span>
                <span className={styles.priceMain}>₹{salon.startingPrice}</span>
              </div>
              {salon.hasSmartSlots && (
                <div className={styles.smartBanner}>
                  <Zap size={14} />Smart Slots available today
                </div>
              )}
              <Link to={`/booking/${salon.id}`} className={styles.bookNowBtn}>
                Book appointment
              </Link>
              <div className={styles.bookingMeta}>
                <div className={styles.bookingMetaItem}><Clock size={14} /><span>Open until {salon.closeTime}</span></div>
                <div className={styles.bookingMetaItem}><MapPin size={14} /><span>{salon.distance} away</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
