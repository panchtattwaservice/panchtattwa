import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import StarField from './StarField';
import { CheckCircle, Clock, FileText, Send, Award } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const JOURNEY_STEPS = [
  { key: 'Pending Confirmation', label: 'Enquiry Received', icon: Clock,       desc: 'Your consultation request has been received and is being reviewed.' },
  { key: 'Confirmed',           label: 'Booking Confirmed', icon: CheckCircle, desc: 'Your consultation has been scheduled. Documents will be required.' },
  { key: 'In Progress',         label: 'Assessment Underway', icon: FileText,  desc: 'Your space is being analyzed through Vastu and Swara Astrology.' },
  { key: 'Report Sent',         label: 'Report Delivered', icon: Send,         desc: 'Your personalized Vastu report has been shared with you.' },
  { key: 'Completed',           label: 'Journey Complete', icon: Award,        desc: 'Your consultation is complete. Follow-up support is available.' },
];

function getStepStatus(bookingStatus, stepKey, stepIndex, activeIndex) {
  if (stepIndex < activeIndex) return 'done';
  if (stepIndex === activeIndex) return 'active';
  return 'pending';
}

export default function MyJourney({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`${API}/bookings`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setBookings)
      .catch(() => {});
  }, [user]);

  const latestBooking = bookings[0];
  const activeIndex = latestBooking
    ? JOURNEY_STEPS.findIndex(s => s.key === latestBooking.status)
    : -1;

  return (
    <section
      id="journey"
      data-testid="my-journey-section"
      style={{
        background: 'var(--bg-mid)',
        padding: 'clamp(40px,6vw,72px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={30} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading
            tag="Your Journey"
            title="Consultation Progress"
            subtitle={latestBooking
              ? `Tracking: ${latestBooking.service} · ${latestBooking.id}`
              : 'Book your first consultation to begin your journey toward harmonized living.'}
          />
        </div>

        {!latestBooking ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: 'italic', color: 'var(--cream-dim)' }}>
              No consultations yet. Your journey awaits.
            </p>
          </div>
        ) : (
          <div
            className="reveal-scale"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 4, padding: 40,
              position: 'relative',
            }}
          >
            {/* Progress line */}
            <div style={{
              position: 'absolute', left: 60, top: 60, bottom: 60, width: 1,
              background: 'linear-gradient(to bottom, var(--gold), var(--border))',
            }} />

            {JOURNEY_STEPS.map((step, i) => {
              const status = getStepStatus(latestBooking.status, step.key, i, activeIndex);
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  data-testid={`journey-step-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr auto',
                    gap: 20, alignItems: 'flex-start',
                    padding: '20px 0',
                    borderBottom: i < JOURNEY_STEPS.length - 1 ? '1px solid #1c1810' : 'none',
                  }}
                >
                  <div
                    className={`step-marker ${status}`}
                    style={{
                      ...(status === 'active' ? {
                        boxShadow: '0 0 0 4px rgba(200,136,58,0.12), 0 0 16px rgba(200,136,58,0.4)',
                        animation: 'none',
                      } : {}),
                    }}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 18, fontWeight: status === 'active' ? 500 : 400,
                      color: status === 'pending' ? '#5a4e40' : 'var(--cream)',
                      marginBottom: 4,
                    }}>
                      {step.label}
                    </p>
                    <p style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 12,
                      color: status === 'pending' ? '#3a3428' : 'var(--cream-dim)',
                      lineHeight: 1.6, fontWeight: 300,
                    }}>
                      {step.desc}
                    </p>
                  </div>

                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 9,
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 2,
                    background: status === 'done' ? 'rgba(200,136,58,0.15)'
                              : status === 'active' ? 'rgba(200,136,58,0.22)'
                              : 'transparent',
                    color: status === 'done' ? 'var(--gold-light)'
                          : status === 'active' ? 'var(--gold)'
                          : '#5a5045',
                    border: status === 'active' ? '1px solid var(--gold)' : '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}>
                    {status === 'done' ? 'Done' : status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
