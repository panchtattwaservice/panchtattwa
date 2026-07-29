import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import StarField from './StarField';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const STATUSES = ['Pending Confirmation', 'Confirmed', 'In Progress', 'Report Sent', 'Completed'];

const statusColor = (s) => {
  if (s === 'Pending Confirmation') return 'var(--terra-light)';
  if (s === 'Confirmed') return 'var(--gold-light)';
  if (s === 'In Progress') return 'var(--gold)';
  if (s === 'Report Sent') return '#d8c8a8';
  if (s === 'Completed') return 'var(--cream)';
  return 'var(--cream-dim)';
};

function CalendarView({ bookings }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(null);

  const ymd = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Build day → bookings map
  const dayMap = {};
  bookings.forEach((b) => {
    const d = new Date(b.booked_at);
    const k = ymd(d);
    if (!dayMap[k]) dayMap[k] = [];
    dayMap[k].push(b);
  });

  const first = new Date(view.y, view.m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ inMonth: false, d: null });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ inMonth: true, d: i, date: new Date(view.y, view.m, i) });
  while (cells.length < 42) cells.push({ inMonth: false, d: null });

  const monthName = first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const nav = (dir) => {
    setView((v) => {
      let m = v.m + dir, y = v.y;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { y, m };
    });
    setSelected(null);
  };

  const todayKey = ymd(today);

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--terra-light)', marginBottom: 4 }}>
            ✦ Activity Calendar ✦
          </p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)' }}>
            {monthName}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => nav(-1)} aria-label="Previous month" style={{ width: 36, height: 36, background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream-dim)', cursor: 'pointer', borderRadius: '50%', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => { setView({ y: today.getFullYear(), m: today.getMonth() }); setSelected(null); }} style={{ background: 'transparent', border: '1px solid rgba(200,136,58,.45)', color: 'var(--gold)', padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', transition: 'all .25s', borderRadius: 2 }}>
            Today
          </button>
          <button onClick={() => nav(1)} aria-label="Next month" style={{ width: 36, height: 36, background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream-dim)', cursor: 'pointer', borderRadius: '50%', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day-of-week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 4 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 11, letterSpacing: '.14em', color: '#6a5e50', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map((c, idx) => {
          if (!c.inMonth || !c.date) {
            return <div key={idx} style={{ aspectRatio: '1', opacity: 0.2 }} />;
          }
          const key = ymd(c.date);
          const evts = dayMap[key] || [];
          const isToday = key === todayKey;
          const isSel = key === selected;
          const hasEvts = evts.length > 0;

          return (
            <button
              key={key}
              onClick={() => hasEvts && setSelected(isSel ? null : key)}
              style={{
                aspectRatio: '1', minHeight: 52,
                padding: '6px 6px 4px',
                border: `1px solid ${isSel ? 'var(--gold)' : isToday ? 'rgba(200,136,58,.55)' : 'rgba(58,52,40,.7)'}`,
                borderRadius: 3,
                background: isSel ? 'rgba(200,136,58,.16)' : hasEvts ? `rgba(200,136,58,${Math.min(0.08 + evts.length * 0.06, 0.25)})` : 'transparent',
                cursor: hasEvts ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between',
                transition: 'all .2s',
              }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: isToday ? 'var(--gold)' : isSel ? 'var(--cream)' : 'var(--cream-dim)', fontWeight: isToday ? 600 : 400 }}>
                {c.d}
              </span>
              {hasEvts && (
                <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {evts.slice(0, 3).map((b, bi) => (
                    <div key={bi} style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(b.status), boxShadow: `0 0 4px ${statusColor(b.status)}88` }} />
                  ))}
                  {evts.length > 3 && <span style={{ fontSize: 8, color: 'var(--cream-dim)' }}>+{evts.length - 3}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      {selected && dayMap[selected] && (
        <div style={{ marginTop: 16, padding: '20px 24px', background: 'rgba(24,20,16,.95)', border: '1px solid var(--border)', borderRadius: 4, borderLeft: '2px solid var(--gold)' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'var(--cream)', marginBottom: 12 }}>
            {new Date(selected + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'var(--cream-dim)', marginLeft: 12, letterSpacing: '.1em' }}>
              {dayMap[selected].length} booking{dayMap[selected].length > 1 ? 's' : ''}
            </span>
          </p>
          {dayMap[selected].map((b) => (
            <div key={b.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 0', borderTop: '1px solid rgba(58,52,40,.5)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(b.status), flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: 'var(--cream)' }}>{b.name}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#7a6c58' }}>{b.service} · {b.id}</p>
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: statusColor(b.status), padding: '3px 8px', border: `1px solid ${statusColor(b.status)}55`, borderRadius: 2 }}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${API}/bookings`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await fetch(`${API}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch {}
    setUpdatingId(null);
  };

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending Confirmation').length,
    active: bookings.filter(b => ['Confirmed', 'In Progress'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'Completed').length,
  };

  return (
    <section
      id="admin"
      data-testid="admin-dashboard"
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={40} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading tag="Consultant Console" title="Admin Dashboard" subtitle={`Welcome, ${user.name?.split(' ')[0]}. Here is your consultation overview.`} />
        </div>

        {/* Stats */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Total Bookings', value: stats.total, color: 'var(--cream)' },
            { label: 'Pending', value: stats.pending, color: 'var(--terra-light)' },
            { label: 'Active', value: stats.active, color: 'var(--gold)' },
            { label: 'Completed', value: stats.completed, color: '#d8c8a8' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '28px 28px' }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 42, fontWeight: 500, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#6a5e50', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="reveal-scale" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: 'clamp(24px,3vw,36px)', marginBottom: 48 }}>
          <CalendarView bookings={bookings} />
        </div>

        {/* Bookings table */}
        <div className="reveal">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: 'var(--cream)' }}>
              All Enquiries
            </h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {['All', ...STATUSES].map(s => (
                <button
                  key={s}
                  data-testid={`filter-${s.replace(/\s/g, '-')}`}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 2,
                    border: `1px solid ${filter === s ? 'var(--gold)' : 'var(--border)'}`,
                    background: filter === s ? 'rgba(200,136,58,0.12)' : 'transparent',
                    color: filter === s ? 'var(--gold)' : 'var(--cream-dim)',
                    fontFamily: "'DM Sans',sans-serif", fontSize: 10,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
              <button onClick={fetchBookings} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream-dim)', cursor: 'pointer', borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }} aria-label="Refresh">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--cream-dim)', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Loading bookings…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#5a4e40', fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontStyle: 'italic' }}>No enquiries found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((b) => (
                <div
                  key={b.id}
                  data-testid={`booking-row-${b.id}`}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: 16,
                    padding: '20px 24px',
                    background: '#14110b', border: '1px solid var(--border)',
                    borderRadius: 3, alignItems: 'center',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,136,58,.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 180 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, color: 'var(--cream)' }}>{b.name}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#6a5e50', marginTop: 2 }}>{b.email}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#5a4e40', marginTop: 1 }}>{b.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: 'var(--gold-light)', fontStyle: 'italic' }}>{b.service}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: '#5a4e40', marginTop: 2, letterSpacing: '0.06em' }}>
                        {b.id} · {new Date(b.booked_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {b.message && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#4a4035', marginTop: 4, fontStyle: 'italic', maxWidth: 400 }}>"{b.message.slice(0, 80)}{b.message.length > 80 ? '…' : ''}"</p>}
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 2,
                      background: 'rgba(200,136,58,0.12)', color: statusColor(b.status),
                      border: `1px solid ${statusColor(b.status)}44`,
                    }}>
                      {b.status}
                    </span>
                    <select
                      data-testid={`status-select-${b.id}`}
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      style={{
                        background: '#1a1610', border: '1px solid var(--border)',
                        color: 'var(--cream-dim)', fontFamily: "'DM Sans',sans-serif",
                        fontSize: 10, padding: '6px 8px', borderRadius: 2,
                        cursor: 'pointer', outline: 'none',
                        opacity: updatingId === b.id ? 0.5 : 1,
                      }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
