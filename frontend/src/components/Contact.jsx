import { useState, useEffect } from 'react';
import StarField from './StarField';
import SectionHeading from './SectionHeading';
import { Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { authFetch } from '../utils/auth';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const SERVICES = ['Home Vastu', 'Office Vastu', 'Plot & Site Vastu', 'Astrology Reading', 'Online Consultation', 'Factory / Industrial'];
const PROMISES = ['Practical, effective solutions', 'No pressure to renovate', 'Simple DIY remedies', 'Holistic, cosmic perspective'];
const PHONE = '+91 775 091 3439';

export default function Contact({ user, onSignIn }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const isLoggedIn = !!user;

  // Pre-fill form from user
  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: f.name || user.name || '', email: f.email || user.email || '' }));
    }
  }, [user?.email]);

  // Load booking history
  useEffect(() => {
    if (!user) return;
    authFetch(`${API}/bookings`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setHistory(data))
      .catch(() => {});
  }, [user, sent]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await authFetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'Pending Confirmation') return 'var(--terra-light)';
    if (s === 'Confirmed') return 'var(--gold-light)';
    if (s === 'In Progress') return 'var(--gold)';
    if (s === 'Report Sent') return '#d8c8a8';
    if (s === 'Completed') return 'var(--cream)';
    return 'var(--cream-dim)';
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={80} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading
            tag="Reach Out"
            title="Book Your Consultation"
            subtitle={isLoggedIn
              ? `Welcome back, ${user.name?.split(' ')[0]}. Start your journey toward a balanced life.`
              : 'Sign in to book and track your consultations.'}
          />
        </div>

        {/* Not logged in: Sign-in prompt */}
        {!isLoggedIn && (
          <div className="reveal" style={{
            maxWidth: 560, margin: '0 auto',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 6, padding: 'clamp(32px,5vw,48px) 40px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />
            <div style={{
              width: 64, height: 64, margin: '0 auto 24px',
              border: '1px solid var(--gold)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', fontSize: 26,
              boxShadow: '0 0 24px rgba(200,136,58,0.18)',
            }}>◯</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: 28,
              fontWeight: 300, color: 'var(--cream)', marginBottom: 10,
            }}>
              Sign in to continue
            </h3>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 13,
              color: 'var(--cream-dim)', lineHeight: 1.8, fontWeight: 300,
              marginBottom: 28, maxWidth: 380, marginInline: 'auto',
            }}>
              An account lets us keep a clear record of your sessions, share your personalised reports, and follow up on every consultation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340, margin: '0 auto 24px', textAlign: 'left' }}>
              {['Track every booking in one place', 'Receive your personalised reports privately', 'Reschedule or follow up with ease'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <CheckCircle size={14} style={{ color: 'var(--terra-light)', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--cream-dim)', fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
            <button data-testid="contact-signin-btn" className="btn-primary" onClick={onSignIn} style={{ cursor: 'pointer', border: 'none' }}>
              Sign In to Book
            </button>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#5a4e40', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 20 }}>
              Prefer to talk first?{' '}
              <a href={`tel:${PHONE}`} style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>Call {PHONE}</a>
            </p>
          </div>
        )}

        {/* Logged in: Form + Contact info */}
        {isLoggedIn && (
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 56, alignItems: 'start' }}>
            {/* Left: Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 300, color: 'var(--cream)', marginBottom: 4 }}>Bindiya Agrawal</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'var(--terra-light)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Vastu Astro Consultant</p>
              </div>

              <a data-testid="contact-phone" href={`tel:${PHONE}`} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 44, height: 44, background: '#1c1710', border: '1px solid var(--border)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={18} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5a4e40', marginBottom: 4 }}>Call Us</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--cream)', fontWeight: 300 }}>{PHONE}</p>
                </div>
              </a>

              <a data-testid="contact-whatsapp" href={`https://wa.me/917750913439`} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: 44, height: 44, background: '#1c1710', border: '1px solid var(--border)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={18} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5a4e40', marginBottom: 4 }}>WhatsApp</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--cream)', fontWeight: 300 }}>Chat on WhatsApp</p>
                </div>
              </a>

              {/* Promise card */}
              <div style={{ padding: '28px 24px', background: '#161210', border: '1px solid var(--border)', borderRadius: 4 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontStyle: 'italic', color: 'var(--gold)', marginBottom: 12 }}>Our Promise</p>
                {PROMISES.map(p => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: 'var(--terra-light)', fontSize: 10 }}>✦</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: 'var(--cream-dim)', fontWeight: 300 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form or success + history */}
            <div>
              {sent ? (
                <div data-testid="booking-success" style={{
                  textAlign: 'center', padding: '60px 40px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4,
                  marginBottom: 32,
                }}>
                  <div style={{ fontSize: 48, color: 'var(--gold)', marginBottom: 20 }}>◎</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>Thank You</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--cream-dim)', lineHeight: 1.7, fontWeight: 300 }}>
                    Your enquiry has been received. Bindiya Agrawal will be in touch within 24 hours to discuss your consultation.
                  </p>
                  <button className="btn-outline" onClick={() => setSent(false)} style={{ marginTop: 24, cursor: 'pointer' }}>Submit Another</button>
                </div>
              ) : (
                <form
                  data-testid="booking-form"
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 16,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 4, padding: 40, marginBottom: 32,
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input required data-testid="form-name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input required data-testid="form-phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" data-testid="form-email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Service Required</label>
                    <select required data-testid="form-service" value={form.service} onChange={e => update('service', e.target.value)} className="form-input">
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Message (Optional)</label>
                    <textarea data-testid="form-message" value={form.message} onChange={e => update('message', e.target.value)} rows={4} placeholder="Tell us about your space and what you'd like to address…" className="form-input" style={{ resize: 'vertical' }} />
                  </div>
                  {error && <p style={{ color: 'var(--terra-light)', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{error}</p>}
                  <button type="submit" data-testid="form-submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Enquiry'}
                  </button>
                </form>
              )}

              {/* Consultation History */}
              {history.length > 0 && (
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: 'italic', color: 'var(--cream)', marginBottom: 16 }}>Your Consultations</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {history.map(b => (
                      <div key={b.id} style={{ padding: '16px 20px', background: '#14110b', border: '1px solid var(--border)', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: 'var(--cream)' }}>{b.service}</p>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#6a5e50', marginTop: 2 }}>{b.id} · {new Date(b.booked_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <span style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                          padding: '4px 10px', borderRadius: 2,
                          background: 'rgba(200,136,58,0.12)', color: statusColor(b.status),
                          border: `1px solid ${statusColor(b.status)}44`,
                        }}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
