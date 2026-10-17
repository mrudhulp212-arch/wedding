import { useEffect, useState } from 'react'

const weddingDate = new Date('2026-12-30T10:30:00+05:30')

function Icon({ name, size = 20 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'arrow-up-right' || name === 'arrow-down') {
    return (
      <svg {...shared}>
        {name === 'arrow-up-right'
          ? <path d="M6 18 18 6M6 6h12v12" />
          : <path d="M12 4v16M5 13l7 7 7-7" />}
      </svg>
    )
  }

  if (name === 'sparkle') {
    return (
      <svg {...shared}>
        <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" />
      </svg>
    )
  }

  if (name === 'pin') {
    return (
      <svg {...shared}>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }
  if (name === 'calendar') {
    return (
      <svg {...shared}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    )
  }
  return (
    <svg {...shared}>
      <path d="M20.8 8.7c0 5.4-8.8 10.3-8.8 10.3S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" />
    </svg>
  )
}

function Countdown() {
  const [remaining, setRemaining] = useState(getTimeRemaining())

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getTimeRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="countdown" aria-label="Time until the wedding">
      {[
        ['days', remaining.days],
        ['hours', remaining.hours],
        ['minutes', remaining.minutes],
        ['seconds', remaining.seconds],
      ].map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <span className="countdown-number">{String(value).padStart(2, '0')}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function getTimeRemaining() {
  const difference = Math.max(0, weddingDate.getTime() - Date.now())
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.style.overflow = previousOverflow;
      setIntroVisible(false);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) return;
    const elements = [...document.querySelectorAll('.intro > .section-kicker, .intro-heading, .intro-copy, .details-intro, .schedule-item, .date-band-content, .travel, .rsvp-content, .site-footer')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    elements.forEach((element) => {
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
    const showAll = () => {
      if (motion.matches) elements.forEach((element) => element.classList.add('is-visible'));
    };
    motion.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', showAll);
      elements.forEach((element) => element.classList.remove('scroll-reveal', 'is-visible'));
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const band = document.querySelector('.date-band');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!band || motion.matches) return;
      const bounds = band.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
        const offset = (window.innerHeight / 2 - bounds.top - bounds.height / 2) * .08;
        band.style.setProperty('--photo-offset', `${Math.max(-35, Math.min(35, offset))}px`);
      }
    };
    const onScroll = () => {
      if (!frame && !motion.matches) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
      band?.style.removeProperty('--photo-offset');
    };
  }, []);

  return (
    <>
      {introVisible && (
        <div className="opening-screen" role="status" aria-label="Welcome to Sarang and Harishma?s wedding">
          <div className="opening-halo" aria-hidden="true" />
          <div className="opening-monogram" aria-hidden="true">
            <span className="opening-letter opening-s">S</span>
            <span className="opening-amp">&amp;</span>
            <span className="opening-letter opening-h">H</span>
          </div>
          <span className="opening-rule" aria-hidden="true" />
        </div>
      )}
      <div className="announcement">
        <span>We’re getting married!</span>
        <span className="announcement-divider"><Icon name="sparkle" size={12} /></span>
        <span>December 30, 2026 · Kuthuparamba</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Sarang and Harishma, home">
          S<span>&amp;</span>H
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#our-story">Our story</a>
          <a href="#the-day">The day</a>
          <a href="#travel">Travel</a>
          <a className="nav-rsvp" href="#rsvp">Join us <span aria-hidden="true"><Icon name="arrow-up-right" size={14} /></span></a>
        </nav>
        <a className="mobile-rsvp" href="#rsvp">Join us <span aria-hidden="true"><Icon name="arrow-up-right" size={14} /></span></a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" role="img" aria-label="A couple celebrating their wedding in the Tuscan countryside" />
          <div className="hero-shade" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-countdown">
            <span className="hero-countdown-title">Counting down to forever</span>
            <Countdown />
          </div>
          <div className="hero-content">
            <span className="eyebrow hero-eyebrow">Together with our families</span>
            <h1>Sarang <span className="hero-amp">&amp;</span><br /><em>Harishma</em></h1>
            <div className="hero-date">30 DECEMBER 2026 <span aria-hidden="true">·</span> KUTHUPARAMBA</div>
            <p>We found our way to each other.<br />Now we’d love to celebrate with you.</p>
            <a className="button button-light" href="#the-day">Explore the celebration <span aria-hidden="true"><Icon name="arrow-down" size={20} /></span></a>
          </div>
          <div className="hero-caption">
            <span>City Auditorium</span>
            <span>Kuthuparamba</span>
          </div>
          <a className="hero-scroll" href="#our-story" aria-label="Discover our story"><span />Discover our story</a>
        </section>

        <section className="intro section-pad" id="our-story">
          <div className="section-kicker"><span className="kicker-line" /> THE BEST THINGS ARE BETTER TOGETHER</div>
          <div className="intro-grid">
            <div className="intro-heading">
              <span className="eyebrow">With full hearts</span>
              <h2>We’re so glad<br />you’re <em>here.</em></h2>
            </div>
            <div className="intro-copy">
              <p className="intro-lead">Somehow, all the little moments led us here.</p>
              <p>From our first coffee to the countless ordinary days that became our favorite ones, we’ve built a life we love. We can’t imagine beginning this next chapter without the people who made us who we are.</p>
              <p>So, save the date — we’re making a weekend of it, and we hope you’ll join us in Kuthuparamba.</p>
              <div className="signature">With love, <span>Sarang &amp; Harishma</span></div>
            </div>
          </div>
          <div className="intro-decoration" aria-hidden="true">S <span>&amp;</span> H</div>
        </section>

        <section className="date-band" aria-label="Wedding date">
          <div className="date-band-image" role="img" aria-label="The rolling hills of Tuscany at golden hour" />
          <div className="date-band-overlay" />
          <div className="date-band-content">
            <span className="eyebrow">The date is set</span>
            <h2>December <em>30</em>, 2026</h2>
            <div className="date-rule"><span /> WEDNESDAY · 10:30 AM · KUTHUPARAMBA <span /></div>
            <Countdown />
          </div>
        </section>

        <section className="details section-pad" aria-labelledby="celebration-heading">
          <div className="details-intro">
            <span id="the-day" className="celebration-anchor" aria-hidden="true" />
            <div className="section-kicker"><span className="kicker-line" /> THE CELEBRATION</div>
            <h2 id="celebration-heading">A day to<br /><em>remember.</em></h2>
            <p>Good food, happy tears, and dancing under the stars. Here’s what to expect.</p>
          </div>
          <div className="schedule">
            <article className="schedule-item">
              <span className="schedule-time">9:30 <small>AM</small></span>
              <div className="schedule-detail">
                <span className="schedule-icon"><Icon name="heart" /></span>
                <div><h3>Aperitivo</h3><p>Find a glass of something lovely and settle in among the olive trees.</p></div>
              </div>
              <span className="schedule-location">THE GARDEN</span>
            </article>
            <article className="schedule-item schedule-item-featured">
              <span className="schedule-time">10:30 <small>AM</small></span>
              <div className="schedule-detail">
                <span className="schedule-icon"><Icon name="heart" /></span>
                <div><h3>The ceremony</h3><p>The moment we’ve been waiting for, surrounded by all our favorite people.</p></div>
              </div>
              <span className="schedule-location">CYPRESS GROVE</span>
            </article>
            <article className="schedule-item">
              <span className="schedule-time">12:00 <small>PM</small></span>
              <div className="schedule-detail">
                <span className="schedule-icon"><Icon name="heart" /></span>
                <div><h3>Dinner &amp; dancing</h3><p>A long Italian dinner, a few toasts, and a dance floor that stays open late.</p></div>
              </div>
              <span className="schedule-location">THE VILLA</span>
            </article>
          </div>
        </section>

        <section className="travel" id="travel">
          <div className="venue-map-frame"><iframe className="venue-map" title="City Auditorium, Kuthuparamba location" src="https://www.google.com/maps?q=City+Auditorium+Kuthuparamba+near+Sub+Treasury+Kerala+670643&z=16&t=m&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><span className="venue-map-caption"><Icon name="pin" size={15} /> City Auditorium ? Kuthuparamba</span></div>
          <div className="travel-content">
            <div className="section-kicker"><span className="kicker-line" /> THE VENUE</div>
            <h2>Find <em>the venue.</em></h2>
            <p className="travel-lead">City Auditorium, Kuthuparamba<br />Near Sub Treasury, Kuthuparamba<br />670643</p>
            <p>Join us at City Auditorium near Sub Treasury in Kuthuparamba. Use the map to find the venue, or open directions to plan your journey.</p>
            <a className="text-link" href="https://www.google.com/maps/dir/?api=1&destination=City+Auditorium+Kuthuparamba+near+Sub+Treasury+Kerala+670643" target="_blank" rel="noreferrer">
              Directions <span aria-hidden="true"><Icon name="arrow-up-right" size={15} /></span>
            </a>
          </div>
        </section>

        <section className="rsvp section-pad" id="rsvp">
          <div className="rsvp-flower" aria-hidden="true"><Icon name="sparkle" size="1em" /></div>
          <div className="rsvp-content">
            <div className="section-kicker"><span className="kicker-line" /> YOU ARE WARMLY INVITED</div>
            <h2>Come share<br /><em>our happiness.</em></h2>
            <p className="invitation-message">Together with our families, we invite you to celebrate our wedding. Your presence and blessings will make our day even more special.</p>
            <p className="invitation-names">Sarang &amp; Harishma</p>
            <p className="invitation-details">December 30, 2026 ? 10:30 AM<br />City Auditorium, Kuthuparamba</p>
            <a className="button button-dark" href="#travel">View location <span aria-hidden="true"><Icon name="pin" size={18} /></span></a>
            <p className="invitation-closing">We look forward to celebrating with you and your family.</p>
          </div>
          <div className="rsvp-side-note">DECEMBER 30<br />TWO THOUSAND TWENTY-SIX</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-mark" href="#home">S<span>&amp;</span>H</a>
        <span className="footer-message">Made with love, for our favorite people.</span>
        <span className="footer-date"><time dateTime="2026-12-30">12.30.26</time><span aria-hidden="true"><Icon name="sparkle" size={12} /></span><span className="footer-place">Kuthuparamba</span></span>
      </footer>
    </>
  )
}

export default App
