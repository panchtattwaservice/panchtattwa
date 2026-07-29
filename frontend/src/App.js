import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useReveal from './hooks/useReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import './App.css';

function AppRouter() {
  useReveal();

  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div data-testid="app-root" style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <Nav onScrollTo={scrollTo} />
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Process />
      <Testimonials />
      <Footer onScrollTo={scrollTo} />
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
