import { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import StarField from './StarField';
import { RefreshCw } from 'lucide-react';
import { authFetch } from '../utils/auth';

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

const statusKey = (s) => {
  if (s === 'Pending Confirmation') return 'pend';
  if (s === 'Confirmed') return 'conf';
  if (s === 'In Progress') return 'prog';
  if (s === 'Report Sent') return 'rep';
  if (s === 'Completed') return 'done';
  return 'pend';
};

const initials = (name) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const HEAT = [
  'transparent',
  'rgba(200,136,58,0.10)',
  'rgba(200,136,58,0.20)',
  'rgba(200,136,58,0.32)',
];

function tier(n) {
  if (!n) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  return 3;
}

const TodayMandala = (
  <svg className="cc-today-mandala" viewBox="0 0 100 100" aria-hidden="true">
    <g fill="none" stroke="rgba(200,136,58,0.35)" strokeWidth="0.6">
      <circle cx="50" cy="50" r="42" />
      <circle cx="50" cy="50" r="30" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="18" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45) * Math.PI / 180;
        return <line key={i} x1={50 + Math.cos(a) * 18} y1={50 + Math.sin(a) * 18} x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42} />;
      })}
      <polygon points="50,18 70,50 50,82 30,50" />
    </g>
  </svg>
);

function CalendarView({ bookings }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(null);

  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fromYmd = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };

  // Build day -> events map
  const dayMap = {};
  bookings.forEach((b) => {
    const d = new Date(b.booked_at);
    const k = ymd(d);
    if (!dayMap[k]) dayMap[k] = [];
    dayMap[k].push({ kind: 'booking', label: 'New enquiry', booking: b, time: d });
    // Synthesize follow-up action event for non-pending items
    if (b.status && b.status !== 'Pending Confirmation') {
      const d2 = new Date(d.getTime() + (2 + (b.id.charCodeAt(b.id.length - 1) % 3)) * 86400000);
      const k2 = ymd(d2);
      if (!dayMap[k2]) dayMap[k2] = [];
      const actLabel = b.status === 'Confirmed' ? 'Booking confirmed'
        : b.status === 'In Progress' ? 'Assessment in progress'
        : b.status === 'Report Sent' ? 'Report delivered'
        : 'Consultation completed';
      dayMap[k2].push({ kind: 'action', label: actLabel, booking: b, time: d2 });
    }
  });

  // Calendar grid
  const first = new Date(view.y, view.m, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const prevMonthDays = new Date(view.y, view.m, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ inMonth: false, d: prevMonthDays - startDow + 1 + i });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ inMonth: true, d: i, date: new Date(view.y, view.m, i) });
  while (cells.length % 7 !== 0 || cells.length < 42) cells.push({ inMonth: false, d: cells.length - daysInMonth - startDow + 1 });

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
  const selDay = selected ? dayMap[selected] || [] : [];

  return (
    <div className="cc-wrap">
      <style>{`
        @keyframes cc-fadeup { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
        @keyframes cc-twinkle { 0%,100% { transform: scale(1); opacity:.85; } 50% { transform: scale(1.18); opacity:1; } }
        @keyframes cc-spin-slow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes cc-shimmer { 0%,100% { opacity:.18; } 50% { opacity:.42; } }
        @keyframes cc-row-in { from { opacity:0; transform: translateX(-6px); } to { opacity:1; transform: translateX(0); } }
        @keyframes cc-glyph-rise { 0% { opacity:0; transform: translateY(4px) scale(.85); } 100% { opacity:1; transform: translateY(0) scale(1); } }

        .cc-wrap {
          position: relative;
          background: linear-gradient(180deg, rgba(30,26,20,1) 0%, rgba(24,20,16,1) 100%);
          border: 1px solid var(--border);
          padding: 28px clamp(16px, 3vw, 32px) 24px;
          margin-bottom: 36px;
          border-radius: 4px;
          overflow: hidden;
          isolation: isolate;
        }
        .cc-wrap::before {
          content: ''; position: absolute; inset: -2px; pointer-events: none; z-index: 0;
          background:
            radial-gradient(circle at 12% -10%, rgba(200,136,58,0.10), transparent 40%),
            radial-gradient(circle at 92% 110%, rgba(184,92,50,0.08), transparent 45%);
        }
        .cc-wrap > * { position: relative; z-index: 1; }
        .cc-corner { position: absolute; width: 18px; height: 18px; opacity: .55; border: 1px solid var(--gold); pointer-events: none; }
        .cc-corner.tl { top:10px; left:10px; border-right:none; border-bottom:none; }
        .cc-corner.tr { top:10px; right:10px; border-left:none; border-bottom:none; }
        .cc-corner.bl { bottom:10px; left:10px; border-right:none; border-top:none; }
        .cc-corner.br { bottom:10px; right:10px; border-left:none; border-top:none; }

        .cc-header { display:flex; align-items:flex-end; justify-content:space-between; gap:18px; flex-wrap:wrap; margin-bottom: 18px; }
        .cc-title-block { display:flex; align-items:center; gap:14px; }
        .cc-flourish { width:54px; height:14px; opacity:.7; }
        .cc-month { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: var(--cream); letter-spacing: .02em; }
        .cc-month em { color: var(--gold); font-style: italic; }
        .cc-eyebrow { font-family:'DM Sans',sans-serif; font-size:10px; letter-spacing:.28em; text-transform: uppercase; color: var(--terra-light); margin-bottom: 6px; }
        .cc-nav { display:flex; align-items:center; gap:8px; }
        .cc-nav-btn {
          background: transparent; border: 1px solid var(--border); color: var(--cream-dim);
          width: 36px; height: 36px; cursor:pointer; font-family:'Cormorant Garamond',serif; font-size: 18px;
          transition: all .25s; border-radius: 50%; display:flex; align-items:center; justify-content:center;
        }
        .cc-nav-btn:hover { color: var(--gold); border-color: rgba(200,136,58,.5); transform: scale(1.06); box-shadow: 0 0 12px rgba(200,136,58,.18); }
        .cc-today-btn {
          background: transparent; border: 1px solid rgba(200,136,58,.45); color: var(--gold);
          padding: 8px 16px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing: .22em; text-transform: uppercase; transition: all .25s; border-radius: 2px;
        }
        .cc-today-btn:hover { background: rgba(200,136,58,.08); letter-spacing: .28em; }

        .cc-legend { display:flex; gap:20px; margin: 10px 0 16px; flex-wrap:wrap; font-family:'DM Sans',sans-serif; font-size:9.5px; letter-spacing:.18em; text-transform: uppercase; color: #7a6c58; }
        .cc-legend-item { display:inline-flex; align-items:center; gap:8px; }
        .cc-legend-dot { width:8px; height:8px; border-radius: 50%; }

        .cc-dow { display:grid; grid-template-columns: repeat(7, 1fr); gap: clamp(3px,0.6vw,6px); margin-bottom: 8px; }
        .cc-dow-cell { text-align: center; font-family:'Cormorant Garamond', serif; font-style: italic; font-size:11px; letter-spacing: .14em; color:#6a5e50; padding: 4px 0; }

        .cc-grid { display:grid; grid-template-columns: repeat(7, 1fr); gap: clamp(3px,0.6vw,6px); }
        .cc-cell {
          aspect-ratio: 1 / 1; min-height: 68px; padding: 8px 8px 6px; position: relative;
          border: 1px solid rgba(58,52,40,.7); border-radius: 3px; background: transparent;
          display: flex; flex-direction: column; align-items: stretch; justify-content: space-between;
          cursor: default; overflow: hidden; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
          animation: cc-fadeup .55s ease both;
        }
        .cc-cell.has::before {
          content:''; position:absolute; inset:0; z-index:0;
          background: var(--cc-heat, transparent);
          animation: cc-shimmer 6s ease-in-out infinite;
        }
        .cc-cell.has { cursor: pointer; }
        .cc-cell.has:hover { transform: translateY(-2px); border-color: rgba(200,136,58,.5); box-shadow: 0 6px 18px rgba(0,0,0,.35), inset 0 0 18px rgba(200,136,58,.10); }
        .cc-cell.has:hover .cc-day-num { color: var(--gold); }
        .cc-cell.dim { opacity: .25; }
        .cc-cell.sel {
          border-color: var(--gold); background: rgba(200,136,58,.16); transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,.4), inset 0 0 22px rgba(200,136,58,.18);
        }
        .cc-cell.sel .cc-day-num { color: var(--cream); text-shadow: 0 0 10px rgba(200,136,58,.5); }
        .cc-cell.today { border-color: rgba(200,136,58,.55); }
        .cc-cell.today .cc-day-num { color: var(--gold); }
        .cc-cell > * { position: relative; z-index: 1; }

        .cc-day-num { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 18px;
          color: var(--cream-dim); line-height: 1; letter-spacing: .02em; font-variant-numeric: lining-nums tabular-nums; transition: color .25s; }
        .cc-today-mandala { position: absolute; inset: 8% 8% 8% 8%; width: 84%; height: 84%; z-index: 0; opacity: .5;
          animation: cc-spin-slow 60s linear infinite; }

        .cc-chips { display:flex; gap:4px; align-self:flex-end; align-items:center; flex-wrap:nowrap; }
        .cc-chip {
          position: relative; width: 22px; height: 22px; border-radius: 50%;
          font-family:'Cormorant Garamond', serif; font-size: 9.5px; font-weight: 600;
          letter-spacing: .03em; color: rgba(20,16,9,.92);
          display:flex; align-items:center; justify-content:center;
          background: radial-gradient(circle at 30% 25%, rgba(255,255,255,.45), transparent 55%), var(--cc-chip-fill, var(--gold));
          border: 1.2px solid var(--cc-chip-rim, var(--gold-light));
          box-shadow: 0 0 8px var(--cc-chip-glow, rgba(200,136,58,.45)), inset 0 -2px 4px rgba(0,0,0,.18);
          animation: cc-glyph-rise .55s ease both;
          flex-shrink: 0; transition: transform .25s ease;
        }
        .cc-chip::after {
          content:''; position:absolute; right:-2px; bottom:-2px; width: 7px; height: 7px;
          border-radius: 50%; background: var(--cc-chip-pip, transparent);
          box-shadow: 0 0 4px var(--cc-chip-pip, transparent);
        }
        .cc-cell.has:hover .cc-chip { transform: translateY(-1px); }
        .cc-cell.sel .cc-chip { box-shadow: 0 0 14px var(--cc-chip-glow, rgba(200,136,58,.7)), inset 0 -2px 4px rgba(0,0,0,.2); }
        .cc-chip.s-pend { --cc-chip-fill: var(--terra-light); --cc-chip-rim: rgba(232,168,120,.85); --cc-chip-glow: rgba(201,120,72,.55); --cc-chip-pip: var(--terra); }
        .cc-chip.s-conf { --cc-chip-fill: var(--gold-light);  --cc-chip-rim: rgba(241,205,150,.9);  --cc-chip-glow: rgba(221,176,106,.55); --cc-chip-pip: var(--gold); }
        .cc-chip.s-prog { --cc-chip-fill: var(--gold);        --cc-chip-rim: rgba(241,205,150,.9);  --cc-chip-glow: rgba(200,136,58,.6); --cc-chip-pip: #f3d488; }
        .cc-chip.s-rep  { --cc-chip-fill: #d8c8a8;            --cc-chip-rim: rgba(237,232,223,.8);  --cc-chip-glow: rgba(216,200,168,.5); --cc-chip-pip: var(--cream); }
        .cc-chip.s-done { --cc-chip-fill: var(--cream);       --cc-chip-rim: rgba(255,255,255,.7);  --cc-chip-glow: rgba(237,232,223,.55); --cc-chip-pip: var(--cream-dim); color: rgba(20,16,9,.85); }
        .cc-chip-more { font-family:'DM Sans', sans-serif; font-size: 10px; color: var(--cream-dim); letter-spacing:.02em; padding: 0 3px; }
        .cc-cell.sel .cc-chip { animation: cc-glyph-rise .55s ease both, cc-twinkle 2.4s ease-in-out 1s infinite; }

        .cc-tip {
          position: absolute; left: 50%; transform: translate(-50%, -8px) scale(.96);
          bottom: calc(100% + 8px);
          min-width: 220px; max-width: 280px;
          background: linear-gradient(180deg, rgba(30,26,20,.98), rgba(17,16,9,.98));
          border: 1px solid rgba(200,136,58,.4); border-radius: 4px;
          padding: 10px 12px; z-index: 50;
          opacity: 0; pointer-events: none;
          transition: opacity .22s ease, transform .22s ease;
          box-shadow: 0 12px 28px rgba(0,0,0,.5), 0 0 0 1px rgba(200,136,58,.08);
          text-align: left;
        }
        .cc-tip::before {
          content:''; position:absolute; left:50%; top:100%; transform:translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent; border-right: 6px solid transparent;
          border-top: 6px solid rgba(200,136,58,.4);
        }
        .cc-tip::after {
          content:''; position:absolute; left:50%; top:100%; transform:translateX(-50%);
          width: 0; height: 0; margin-top:-1px;
          border-left: 5px solid transparent; border-right: 5px solid transparent;
          border-top: 5px solid rgba(24,20,16,.98);
        }
        .cc-cell.has:hover .cc-tip { opacity: 1; transform: translate(-50%, 0) scale(1); }
        .cc-tip-head { font-family:'DM Sans',sans-serif; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: var(--terra-light); margin-bottom: 8px; }
        .cc-tip-row { display:flex; align-items:center; gap:8px; padding: 5px 0; border-top: 1px solid rgba(58,52,40,.5); }
        .cc-tip-row:first-of-type { border-top: none; }
        .cc-tip-name { font-family:'Cormorant Garamond',serif; font-size: 14px; color: var(--cream); line-height:1.2; }
        .cc-tip-svc  { font-family:'DM Sans',sans-serif; font-size: 10px; color: #7a6c58; letter-spacing:.04em; margin-top:2px; }
        .cc-tip-pill {
          font-family:'DM Sans',sans-serif; font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 999px; border: 1px solid currentColor; opacity:.9; white-space: nowrap;
        }
        .cc-tip-pill.s-pend { color: var(--terra-light); }
        .cc-tip-pill.s-conf { color: var(--gold-light); }
        .cc-tip-pill.s-prog { color: var(--gold); }
        .cc-tip-pill.s-rep  { color: #d8c8a8; }
        .cc-tip-pill.s-done { color: var(--cream); }
        .cc-tip-mini { width:10px; height:10px; border-radius:50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.5), transparent 55%), var(--cc-chip-fill);
          box-shadow: 0 0 6px var(--cc-chip-glow); flex-shrink: 0;
        }
        .cc-corner-mark { position: absolute; width: 7px; height: 7px; border: 1px solid var(--gold); opacity: 0; transition: opacity .25s; pointer-events: none; }
        .cc-cell.sel .cc-corner-mark, .cc-cell.has:hover .cc-corner-mark { opacity: .8; }
        .cc-corner-mark.t-l { top:3px; left:3px; border-right:none; border-bottom:none; }
        .cc-corner-mark.b-r { bottom:3px; right:3px; border-left:none; border-top:none; }

        .cc-detail {
          margin-top: 22px; padding: 22px 24px;
          background: linear-gradient(180deg, rgba(24,20,16,.95) 0%, rgba(17,16,9,.98) 100%);
          border: 1px solid var(--border); border-radius: 4px; position: relative; overflow: hidden;
          animation: cc-fadeup .45s ease both;
        }
        .cc-detail::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:2px;
          background: linear-gradient(180deg, transparent, var(--gold), var(--terra), transparent);
        }
        .cc-detail-head { display:flex; justify-content:space-between; align-items:baseline; gap:8px; flex-wrap:wrap; margin-bottom: 16px; }
        .cc-detail-date { font-family:'Cormorant Garamond',serif; font-size: 24px; color: var(--cream); font-weight:300; }
        .cc-detail-date em { color: var(--gold); font-style: italic; }
        .cc-summary { font-family:'DM Sans',sans-serif; font-size: 11px; color: var(--cream-dim); letter-spacing:.1em; }
        .cc-summary b { color: var(--gold); font-weight: 500; }

        .cc-event {
          display:grid; grid-template-columns: auto 1fr auto auto; gap: 16px; align-items:center;
          padding: 12px 14px; background: rgba(30,26,20,.7); border: 1px solid #1c1810;
          border-left: 2px solid var(--cc-evt-accent); border-radius: 2px;
          animation: cc-row-in .4s ease both;
          transition: transform .2s, border-color .2s;
        }
        .cc-event:hover { transform: translateX(3px); border-color: rgba(200,136,58,.3); border-left-color: var(--cc-evt-accent); }
        .cc-event-orb {
          width: 32px; height: 32px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.3), transparent 55%), var(--cc-evt-accent);
          box-shadow: 0 0 14px var(--cc-evt-glow), inset 0 0 6px rgba(0,0,0,.3);
          display:flex; align-items:center; justify-content:center;
          font-family:'Cormorant Garamond',serif; font-size:14px; color: rgba(255,255,255,.85); font-style:italic;
          animation: cc-glyph-rise .5s ease both;
        }
        .cc-event-name { font-family:'Cormorant Garamond',serif; font-size: 17px; color: var(--cream); }
        .cc-event-svc { color:#7a6c58; font-style:italic; font-size: 13px; margin-left: 4px; }
        .cc-event-meta { font-family:'DM Sans',sans-serif; font-size: 11px; color: var(--cream-dim); margin-top: 3px; }
        .cc-event-tag { font-family:'DM Sans',sans-serif; font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
          color: var(--cc-evt-accent); padding: 4px 10px; border: 1px solid currentColor; border-radius: 999px; opacity:.85; }
        .cc-event-time { font-family:'DM Sans',sans-serif; font-size: 11px; color: #7a6c58; font-variant-numeric: tabular-nums; letter-spacing:.06em; }

        @media (max-width: 768px) {
          .cc-cell { aspect-ratio: auto; min-height: 42px; padding: 4px 4px 3px; }
          .cc-day-num { font-size: 13px; }
          .cc-chip { width: 18px; height: 18px; font-size: 8px; }
          .cc-tip { display: none; }
          .cc-event { grid-template-columns: auto 1fr; }
          .cc-event-tag, .cc-event-time { grid-column: 2; justify-self: start; }
          .cc-month { font-size: 22px; }
          .cc-flourish { display: none; }
        }
      `}</style>

      <span className="cc-corner tl" />
      <span className="cc-corner tr" />
      <span className="cc-corner bl" />
      <span className="cc-corner br" />

      {/* Header */}
      <div className="cc-header">
        <div>
          <p className="cc-eyebrow">&#10022; Activity Calendar &#10022;</p>
          <div className="cc-title-block">
            <svg className="cc-flourish" viewBox="0 0 54 14" aria-hidden="true">
              <path d="M 0 7 H 22" stroke="var(--gold)" strokeWidth="0.6" />
              <circle cx="27" cy="7" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
              <circle cx="27" cy="7" r="0.8" fill="var(--gold)" />
              <path d="M 32 7 H 54" stroke="var(--gold)" strokeWidth="0.6" />
            </svg>
            <h3 className="cc-month">
              {monthName.split(' ')[0]} <em>{monthName.split(' ')[1]}</em>
            </h3>
            <svg className="cc-flourish" viewBox="0 0 54 14" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
              <path d="M 0 7 H 22" stroke="var(--gold)" strokeWidth="0.6" />
              <circle cx="27" cy="7" r="2.5" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
              <circle cx="27" cy="7" r="0.8" fill="var(--gold)" />
              <path d="M 32 7 H 54" stroke="var(--gold)" strokeWidth="0.6" />
            </svg>
          </div>
        </div>
        <div className="cc-nav">
          <button className="cc-nav-btn" onClick={() => nav(-1)} aria-label="Previous month">&#8249;</button>
          <button className="cc-today-btn" onClick={() => { setView({ y: today.getFullYear(), m: today.getMonth() }); setSelected(null); }}>Today</button>
          <button className="cc-nav-btn" onClick={() => nav(1)} aria-label="Next month">&#8250;</button>
        </div>
      </div>

      {/* Legend */}
      <div className="cc-legend">
        <span className="cc-legend-item"><span className="cc-legend-dot" style={{ background: 'var(--terra-light)', boxShadow: '0 0 8px rgba(201,120,72,.55)' }} />Pending</span>
        <span className="cc-legend-item"><span className="cc-legend-dot" style={{ background: 'var(--gold-light)', boxShadow: '0 0 8px rgba(221,176,106,.55)' }} />Confirmed</span>
        <span className="cc-legend-item"><span className="cc-legend-dot" style={{ background: 'var(--gold)', boxShadow: '0 0 8px rgba(200,136,58,.6)' }} />In Progress</span>
        <span className="cc-legend-item"><span className="cc-legend-dot" style={{ background: '#d8c8a8', boxShadow: '0 0 8px rgba(216,200,168,.5)' }} />Report Sent</span>
        <span className="cc-legend-item"><span className="cc-legend-dot" style={{ background: 'var(--cream)', boxShadow: '0 0 8px rgba(237,232,223,.5)' }} />Completed</span>
        <span className="cc-legend-item" style={{ marginLeft: 'auto' }}>
          <span style={{ display: 'inline-flex', gap: 3 }}>
            {[1, 2, 3].map((t) => <span key={t} style={{ width: 14, height: 10, background: HEAT[t], border: '1px solid var(--border)', borderRadius: 1 }} />)}
          </span>
          Activity
        </span>
      </div>

      {/* Day-of-week */}
      <div className="cc-dow">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="cc-dow-cell">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="cc-grid">
        {cells.map((c, idx) => {
          const key = c.date ? ymd(c.date) : 'pad-' + idx;
          const events = c.date ? (dayMap[key] || []) : [];
          const t = tier(events.length);
          const isToday = key === todayKey;
          const isSel = key === selected;
          const hasEvents = events.length > 0;
          let classes = 'cc-cell';
          if (!c.inMonth) classes += ' dim';
          if (hasEvents) classes += ' has';
          if (isToday) classes += ' today';
          if (isSel) classes += ' sel';

          // Dedupe events by booking
          const byBooking = {};
          events.forEach((e) => {
            const bk = e.booking.id;
            if (!byBooking[bk] || e.kind === 'action') byBooking[bk] = e;
          });
          const uniq = Object.values(byBooking);

          return (
            <button key={key} className={classes} disabled={!c.inMonth || !hasEvents}
              onClick={() => setSelected(isSel ? null : key)}
              style={{ '--cc-heat': HEAT[t], animationDelay: (idx * 12) + 'ms' }}>
              {isToday && TodayMandala}
              <span className="cc-corner-mark t-l" />
              <span className="cc-corner-mark b-r" />
              <span className="cc-day-num">{c.d}</span>
              {hasEvents && (
                <span className="cc-chips">
                  {uniq.slice(0, 2).map((e, i) => {
                    const s = statusKey(e.booking.status);
                    return <span key={i} className={'cc-chip s-' + s} title={e.booking.name + ' — ' + e.booking.status}>{initials(e.booking.name)}</span>;
                  })}
                  {uniq.length > 2 && <span className="cc-chip-more">+{uniq.length - 2}</span>}
                </span>
              )}
              {hasEvents && (
                <span className="cc-tip" role="tooltip">
                  <div className="cc-tip-head">{events.length} {events.length === 1 ? 'activity' : 'activities'}</div>
                  {uniq.slice(0, 4).map((e, i) => {
                    const s = statusKey(e.booking.status);
                    return (
                      <div key={i} className="cc-tip-row">
                        <span className={'cc-tip-mini cc-chip s-' + s} style={{ width: 10, height: 10, padding: 0, border: 'none', animation: 'none' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="cc-tip-name">{e.booking.name}</div>
                          <div className="cc-tip-svc">{e.booking.service}</div>
                        </div>
                        <span className={'cc-tip-pill s-' + s}>{e.booking.status}</span>
                      </div>
                    );
                  })}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selected && selDay.length > 0 && (
        <div className="cc-detail" key={selected}>
          <div className="cc-detail-head">
            <div>
              <p className="cc-eyebrow">Day Detail</p>
              <h4 className="cc-detail-date">
                {(() => {
                  const dt = fromYmd(selected);
                  const weekday = dt.toLocaleDateString('en-IN', { weekday: 'long' });
                  const rest = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                  return <span><em>{weekday}</em>, {rest}</span>;
                })()}
              </h4>
            </div>
            <p className="cc-summary">
              <b>{selDay.length}</b> activit{selDay.length === 1 ? 'y' : 'ies'} &middot; <b>{selDay.filter(e => e.kind === 'booking').length}</b> new &middot; <b>{selDay.filter(e => e.kind === 'action').length}</b> actions
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selDay.map((e, i) => {
              const accent = e.kind === 'booking' ? 'var(--terra-light)' : 'var(--gold)';
              const glow = e.kind === 'booking' ? 'rgba(201,120,72,.55)' : 'rgba(200,136,58,.6)';
              const glyph = e.kind === 'booking' ? '\u2726' : '\u25C8';
              return (
                <div key={i} className="cc-event" style={{ '--cc-evt-accent': accent, '--cc-evt-glow': glow, animationDelay: (i * 70) + 'ms' }}>
                  <span className="cc-event-orb">{glyph}</span>
                  <div>
                    <div className="cc-event-name">{e.booking.name}<span className="cc-event-svc"> &middot; {e.booking.service}</span></div>
                    <div className="cc-event-meta">{e.label} &middot; {e.booking.id}</div>
                  </div>
                  <span className="cc-event-tag">{e.kind === 'booking' ? 'Booking' : 'Action'}</span>
                  <span className="cc-event-time">{e.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              );
            })}
          </div>
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
    authFetch(`${API}/bookings`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await authFetch(`${API}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
        <div className="reveal-scale">
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
