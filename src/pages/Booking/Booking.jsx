import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, CheckCircle, Calendar, Clock, User, Scissors } from 'lucide-react';
import { getSalonById } from '../../data/salons';
import { services as allServices } from '../../data/services';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import styles from './Booking.module.css';

const DATES = [
  { label: 'Today', value: new Date().toISOString().split('T')[0] },
  { label: 'Tomorrow', value: new Date(Date.now()+86400000).toISOString().split('T')[0] },
  { label: new Date(Date.now()+172800000).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}), value: new Date(Date.now()+172800000).toISOString().split('T')[0] },
  { label: new Date(Date.now()+259200000).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}), value: new Date(Date.now()+259200000).toISOString().split('T')[0] },
  { label: new Date(Date.now()+345600000).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}), value: new Date(Date.now()+345600000).toISOString().split('T')[0] },
];

const ALL_TIMES = [
  { time:'09:30', label:'9:30 AM', isSmartSlot:false, price:null },
  { time:'10:30', label:'10:30 AM', isSmartSlot:false, price:null },
  { time:'11:00', label:'11:00 AM', isSmartSlot:true, price:null },
  { time:'11:30', label:'11:30 AM', isSmartSlot:true, price:null },
  { time:'12:00', label:'12:00 PM', isSmartSlot:true, price:null },
  { time:'12:30', label:'12:30 PM', isSmartSlot:true, price:null },
  { time:'13:30', label:'1:30 PM', isSmartSlot:false, price:null },
  { time:'14:30', label:'2:30 PM', isSmartSlot:true, price:null },
  { time:'15:30', label:'3:30 PM', isSmartSlot:false, price:null },
  { time:'16:30', label:'4:30 PM', isSmartSlot:false, price:null },
  { time:'17:00', label:'5:00 PM', isSmartSlot:false, price:null },
  { time:'17:30', label:'5:30 PM', isSmartSlot:false, price:null },
  { time:'18:00', label:'6:00 PM', isSmartSlot:false, price:null },
];

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const salon = getSalonById(id);
  const { timeSlots, bookAppointment } = useApp();
  const { addToast } = useToast();

  const bookedTimes = timeSlots.filter(s => s.status === 'booked').map(s => s.time);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(DATES[0].value);
  const [selectedTime, setSelectedTime] = useState(null);

  const salonServices = salon ? allServices.filter(s => salon.services.includes(s.id)) : [];

  // Pre-select from URL params
  useEffect(() => {
    const serviceId = searchParams.get('service');
    const time = searchParams.get('time');
    if (serviceId) {
      const svc = allServices.find(s => s.id === serviceId);
      if (svc) { setSelectedService(svc); setStep(2); }
    }
    if (time) setSelectedTime(time);
  }, [searchParams]);

  if (!salon) return <div className={styles.notFound}><h2>Salon not found.</h2></div>;

  const isSmartSelected = selectedService?.hasSmartSlot && selectedTime && ALL_TIMES.find(t => t.time === selectedTime)?.isSmartSlot;
  const finalPrice = isSmartSelected ? selectedService.smartSlotPrice : selectedService?.regularPrice;
  const savings = isSmartSelected ? (selectedService.regularPrice - selectedService.smartSlotPrice) : 0;

  const handleConfirm = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      addToast('Please complete all steps.', 'error');
      return;
    }
    if (bookedTimes.includes(selectedTime) && id === 'salon-1') {
      addToast('This slot is already booked. Please choose another.', 'error');
      return;
    }
    const apt = {
      id: `apt-new-${Date.now()}`,
      customerId: 'cust-1',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 11111',
      salonId: id,
      salonName: salon.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      staffId: 'staff-1',
      staffName: 'Raj Kumar',
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      price: finalPrice,
      regularPrice: selectedService.regularPrice,
      isSmartSlot: isSmartSelected,
      status: 'confirmed',
      source: 'online',
      bookingId: `GRM-${Math.floor(2900 + Math.random() * 99)}`,
      createdAt: new Date().toISOString(),
    };
    bookAppointment(apt);
    navigate('/booking-success', { state: { appointment: apt, salon } });
  };

  const STEPS = ['Service', 'Date', 'Time', 'Review'];
  const fmt12 = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const p = h >= 12 ? 'PM' : 'AM';
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
  };
  const fmtDate = (d) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.back} onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}>
            <ArrowLeft size={16} /> {step > 1 ? 'Back' : 'Back to salon'}
          </button>
          <div className={styles.salonInfo}>
            <img src={salon.image} alt={salon.name} className={styles.salonThumb} />
            <div>
              <h2 className={styles.salonName}>{salon.name}</h2>
              <p className={styles.salonArea}>{salon.area}, {salon.city}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.progress}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.progressItem}>
              <div className={[styles.progressCircle, step > i + 1 ? styles.done : step === i + 1 ? styles.active : ''].join(' ')}>
                {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={[styles.progressLabel, step === i + 1 ? styles.activeLabel : ''].join(' ')}>{s}</span>
              {i < STEPS.length - 1 && <div className={[styles.progressLine, step > i + 1 ? styles.doneLine : ''].join(' ')} />}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>

            {/* Step 1: Service */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Choose a service</h3>
                <div className={styles.serviceList}>
                  {salonServices.map(svc => (
                    <div
                      key={svc.id}
                      className={[styles.serviceCard, selectedService?.id === svc.id ? styles.selectedCard : ''].join(' ')}
                      onClick={() => setSelectedService(svc)}
                    >
                      <div className={styles.serviceInfo}>
                        <div className={styles.serviceName}>{svc.name}</div>
                        <div className={styles.serviceDesc}>{svc.description}</div>
                        <div className={styles.serviceDuration}><Clock size={12} />{svc.duration} min</div>
                      </div>
                      <div className={styles.servicePrice}>
                        {svc.hasSmartSlot ? (
                          <>
                            <span className={styles.regular}>₹{svc.regularPrice}</span>
                            <span className={styles.smart}>₹{svc.smartSlotPrice}</span>
                            <span className={styles.smartBadge}><Zap size={10} />Smart</span>
                          </>
                        ) : (
                          <span className={styles.priceOnly}>₹{svc.regularPrice}</span>
                        )}
                      </div>
                      {selectedService?.id === svc.id && <div className={styles.checkIcon}><CheckCircle size={20} /></div>}
                    </div>
                  ))}
                </div>
                <button className={styles.nextBtn} disabled={!selectedService} onClick={() => setStep(2)}>
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Date */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Pick a date</h3>
                <div className={styles.dateGrid}>
                  {DATES.map(d => (
                    <button
                      key={d.value}
                      className={[styles.dateCard, selectedDate === d.value ? styles.selectedDate : ''].join(' ')}
                      onClick={() => setSelectedDate(d.value)}
                    >
                      <Calendar size={16} />
                      {d.label}
                    </button>
                  ))}
                </div>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 3: Time */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Choose a time slot</h3>
                {salon.hasSmartSlots && (
                  <div className={styles.smartHint}><Zap size={14} />Purple slots are Smart Slots — save money booking during off-peak hours!</div>
                )}
                <div className={styles.timeGrid}>
                  {ALL_TIMES.map(slot => {
                    const isBooked = id === 'salon-1' && bookedTimes.includes(slot.time);
                    const isSelected = selectedTime === slot.time;
                    const slotPrice = slot.isSmartSlot && selectedService?.hasSmartSlot
                      ? selectedService.smartSlotPrice
                      : selectedService?.regularPrice;
                    return (
                      <button
                        key={slot.time}
                        disabled={isBooked}
                        className={[
                          styles.timeSlot,
                          isBooked ? styles.timeBooked :
                          isSelected ? styles.timeSelected :
                          slot.isSmartSlot && selectedService?.hasSmartSlot ? styles.timeSmart : styles.timeAvail
                        ].join(' ')}
                        onClick={() => !isBooked && setSelectedTime(slot.time)}
                      >
                        <span className={styles.timeLabel}>{slot.label}</span>
                        {!isBooked && (
                          <span className={styles.timePrice}>
                            ₹{slotPrice}{slot.isSmartSlot && selectedService?.hasSmartSlot && <Zap size={10} />}
                          </span>
                        )}
                        {isBooked && <span className={styles.timeBookedTxt}>Booked</span>}
                      </button>
                    );
                  })}
                </div>
                <button className={styles.nextBtn} disabled={!selectedTime} onClick={() => setStep(4)}>
                  Review booking <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && selectedService && (
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Review your booking</h3>
                <div className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <img src={salon.image} alt={salon.name} className={styles.reviewImg} />
                    <div>
                      <div className={styles.reviewSalon}>{salon.name}</div>
                      <div className={styles.reviewArea}>{salon.area}, {salon.city}</div>
                    </div>
                  </div>
                  <div className={styles.reviewBody}>
                    {[
                      { icon: <Scissors size={16} />, label: 'Service', value: selectedService.name },
                      { icon: <Clock size={16} />, label: 'Duration', value: `${selectedService.duration} min` },
                      { icon: <Calendar size={16} />, label: 'Date', value: fmtDate(selectedDate) },
                      { icon: <Clock size={16} />, label: 'Time', value: fmt12(selectedTime) },
                      { icon: <User size={16} />, label: 'Staff', value: 'Raj Kumar' },
                    ].map(row => (
                      <div key={row.label} className={styles.reviewRow}>
                        <span className={styles.reviewRowIcon}>{row.icon}</span>
                        <span className={styles.reviewRowLabel}>{row.label}</span>
                        <span className={styles.reviewRowValue}>{row.value}</span>
                      </div>
                    ))}
                    <div className={styles.reviewPriceRow}>
                      <div>
                        <div className={styles.reviewPriceLabel}>Total</div>
                        {isSmartSelected && (
                          <div className={styles.reviewSavings}>You save ₹{savings} with Smart Slot!</div>
                        )}
                      </div>
                      <div className={styles.reviewPriceRight}>
                        {isSmartSelected && (
                          <span className={styles.reviewRegular}>₹{selectedService.regularPrice}</span>
                        )}
                        <span className={[styles.reviewFinal, isSmartSelected ? styles.smartFinal : ''].join(' ')}>
                          ₹{finalPrice}
                        </span>
                      </div>
                    </div>
                    {isSmartSelected && (
                      <div className={styles.smartNote}>
                        <Zap size={14} />Smart Slot — off-peak pricing applied automatically
                      </div>
                    )}
                  </div>
                </div>
                <button className={styles.confirmBtn} onClick={handleConfirm}>
                  <CheckCircle size={18} /> Confirm appointment
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
