import { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import useAuth from './hooks/useAuth';
import useReveal from './hooks/useReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';
import MyJourney from './components/MyJourney';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#111009', flexDirection: 'column', gap: 20,
    }}>
      <svg width="56" height="56" viewBox="0 0 32 32" fill="none" className="mandala-spin">
        <circle cx="16" cy="16" r="6" stroke="#c8883a" strokeWidth="0.8" fill="none" />
        <circle cx="16" cy="16" r="12" stroke="#c8883a" strokeWidth="0.5" fill="none" strokeDasharray="2 3" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return (
            <line key={i}
              x1={(16 + Math.cos(a) * 7).toFixed(2)} y1={(16 + Math.sin(a) * 7).toFixed(2)}
              x2={(16 + Math.cos(a) * 13).toFixed(2)} y2={(16 + Math.sin(a) * 13).toFixed(2)}
              stroke="#c8883a" strokeWidth="0.6"
            />
          );
        })}
        <circle cx="16" cy="16" r="2" fill="#c8883a" />
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: '0.22em', color: '#4a4035', textTransform: 'uppercase' }}>
        PanchTattwa
      </p>
    </div>
  );
}

function AppRouter() {
  const location = useLocation();
  const { user, loading, processSession, signIn, signOut, refetch } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useReveal();

  // Re-run reveal after auth state changes (new sections appear)
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const els = document.querySelectorAll('.reveal, .reveal-scale, .stagger');
        const obs = new IntersectionObserver(
          (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
          { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        els.forEach(el => { el.classList.remove('visible'); obs.observe(el); });
        return () => obs.disconnect();
      }, 100);
    }
  }, [user, loading]);

  // SYNCHRONOUS session_id check — must happen before any other render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  if (loading) return <LoadingScreen />;

  const isAdmin = user?.role === 'admin';
  const isConsultant = user?.role === 'consultant' || isAdmin;
  const isClient = user && !isConsultant;

  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleBook = () => {
    if (user) scrollTo('contact');
    else setAuthModalOpen(true);
  };

  return (
    <div data-testid="app-root" style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Nav
        user={user}
        onSignIn={() => setAuthModalOpen(true)}
        onSignOut={signOut}
        onScrollTo={scrollTo}
      />

      <Hero user={user} onBook={handleBook} />

      {isClient && <MyJourney user={user} />}

      {!isConsultant && <About />}

      {isConsultant ? (
        <AdminDashboard user={user} />
      ) : (
        <>
          <Services />
          <WhyUs />
          <Process />
          <Testimonials />
          {/* Contact section temporarily hidden */}
        </>
      )}

      <Footer onScrollTo={scrollTo} />

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
