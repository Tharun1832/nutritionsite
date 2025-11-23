import React, { useState, useEffect, useRef } from 'react';

// NutritionistSite - cleaned & fixed single-file React component
// Tailwind CSS classes assumed available. This file fixes previous JSX syntax errors.

export default function NutritionistSite() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const heroRef = useRef(null);

  // Small global click feedback (visually). Safe: doesn't rely on server or external libs.
  useEffect(() => {
    function onGlobalClick(e) {
      const el = e.target.closest ? e.target.closest('a,button') : null;
      if (!el) return;
      try {
        el.classList.add('pressed');
        setTimeout(() => el.classList.remove('pressed'), 140);
      } catch (err) {}
      const txt = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || 'Action').trim().slice(0, 60);
      setFormStatus({ type: 'info', text: `Clicked: ${txt}` });
    }
    document.addEventListener('click', onGlobalClick);
    return () => document.removeEventListener('click', onGlobalClick);
  }, []);

  // Ensure newly-added buttons/links get btn-dynamic class
  useEffect(() => {
    function applyBtnClass() {
      const els = Array.from(document.querySelectorAll('a,button'));
      els.forEach(el => el.classList.add('btn-dynamic'));
    }
    applyBtnClass();
    const obs = new MutationObserver(applyBtnClass);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submitForm(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setFormStatus({ type: 'error', text: 'Please fill name, email and phone.' });
      return;
    }
    const subject = encodeURIComponent('Appointment request from website');
    const body = encodeURIComponent(
      `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ADate: ${form.date}%0AMessage: ${form.message}`
    );
    window.location.href = `mailto:dietitianmonica20@gmail.com?subject=${subject}&body=${body}`;
    setFormStatus({ type: 'success', text: 'Opening your email client to send the appointment request...' });
  }

  const faqs = [
    { q: 'Do you offer teleconsultations?', a: 'Yes — via video call or phone. Perfect for follow-ups or remote patients.' },
    { q: 'How many follow-ups are needed?', a: 'Typically 2-4 follow-ups initially, then monthly/quarterly depending on goals.' }
  ];

  const services = [
    { title: 'Weight Management', desc: 'Sustainable plans & ongoing coaching', popup: 'Personalised calorie plans, meal timing & habit coaching.' },
    { title: 'Diabetes Care', desc: 'Meal plans & carb counting', popup: 'Carb-smart menus, glucose-friendly swaps and monitoring tips.' },
    { title: 'Clinical Nutrition', desc: 'GI, PCOS, thyroid and more', popup: 'Condition-focused nutrition with evidence-backed protocols.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-emerald-100 text-gray-800" style={{ fontFamily: '"Times New Roman", Times, serif' }}>

      {/* Inline styles - safe and self-contained */}
      <style>{` 
        .btn-dynamic{ transition: transform .18s ease, box-shadow .18s ease; }
        .btn-dynamic:hover{ transform: scale(1.05); }
        .btn-dynamic:active, .pressed{ transform: scale(.95); }
        .btn-dynamic{ box-shadow: 0 6px 18px rgba(6,95,70,0.08); }

        /* continuous marquee: duplicate content and scroll left continuously */
        .marquee{ overflow:hidden; }
        .moving-track{ display:flex; gap:2rem; align-items:center; width:200%; transform:translateX(0); animation: scroll var(--speed, 12s) linear infinite; }
        .moving-track span{ white-space:nowrap; }
        @keyframes scroll{ 0%{ transform: translateX(0%); } 100%{ transform: translateX(-50%); } }

        /* service card popup */
        .service-card{ position: relative; overflow: visible; }
        .service-popup{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background: rgba(2, 120, 96, 0.04); border-radius:12px; opacity:0; transform: translateY(6px) scale(.98); transition: opacity .18s ease, transform .18s ease, box-shadow .18s ease; pointer-events:none; }
        .service-card:hover .service-popup{ opacity:1; transform: translateY(0) scale(1); pointer-events:auto; box-shadow: 0 14px 40px rgba(6,95,70,0.08); }
        .service-popup-inner{ max-width:260px; padding:12px; background:white; border-radius:10px; box-shadow:0 10px 30px rgba(0,0,0,0.06); text-align:center; }
      `}</style>

      <header className="bg-white/60 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">MS</div>
            <div>
              <div className="text-lg font-semibold">Monica S</div>
              <div className="text-sm text-gray-600">M.Sc Food Science, Nutrition & Dietetics — pursuing a Ph.D. in Nutrition and Dietetics</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center text-sm">
            <button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-700 btn-dynamic">Services</button>
            <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-700 btn-dynamic">About</button>
            <button onClick={() => document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-700 btn-dynamic">FAQ</button>
            <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-700 btn-dynamic">Contact</button>
            <button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow btn-dynamic">Book Appointment</button>
          </nav>

          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setMenuOpen(prev => !prev)} className="p-2 rounded-md bg-white/60">{menuOpen ? 'Close' : 'Menu'}</button>
            <button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-600 text-white px-3 py-2 rounded-md text-sm btn-dynamic">Book</button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white/70 backdrop-blur px-6 py-4 border-t">
            <div className="flex flex-col gap-3">
              <button onClick={() => { document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }} className="block text-left btn-dynamic">Services</button>
              <button onClick={() => { document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }} className="block text-left btn-dynamic">About</button>
              <button onClick={() => { document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }} className="block text-left btn-dynamic">FAQ</button>
              <button onClick={() => { document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }} className="block text-left btn-dynamic">Contact</button>
              <button onClick={() => { document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }} className="block font-semibold text-emerald-700 text-left btn-dynamic">Book Appointment</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="hero-title-wrap">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <div className="marquee" aria-hidden>
                <div className="moving-track" style={{ '--speed': '12s' }}>
                  <span>Personalised nutrition care for a healthier you —</span>
                  <span>Personalised nutrition care for a healthier you —</span>
                </div>
              </div>
              <span className="sr-only">Personalised nutrition care for a healthier you</span>
            </h1>
          </div>

          <p className="mt-3 text-sm text-gray-600 italic">"Food is our first medicine - choose it wisely"</p>
          <p className="mt-4 text-lg text-gray-700">Clinical diet plans, weight management, diabetes-friendly meals and long-term lifestyle coaching — evidence-based and empathetic care.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg shadow btn-dynamic">Book Consultation</button>
            <button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })} className="inline-block border border-emerald-600 text-emerald-700 px-6 py-3 rounded-lg btn-dynamic">View Services</button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/80 p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Consultation</div>
              <div className="font-semibold">In-person & Online</div>
            </div>
            <div className="bg-white/80 p-4 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Slogan</div>
              <div className="font-semibold">Food is our first medicine</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="nutrition" className="w-full h-64 object-cover" />
            <div className="p-6">
              <div className="text-sm text-gray-500">Featured plan</div>
              <div className="text-xl font-bold">Starter Nutrition Tune-up</div>
              <p className="mt-2 text-gray-600">One 45 min assessment, personalised plan, sample meal day and follow-up tips.</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded btn-dynamic">Book</button>
                <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm border px-4 py-2 rounded btn-dynamic">Enquire</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="mt-2 text-gray-600">Comprehensive services tailored to your health goals.</p>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm service-card group">
              <div className="text-emerald-600 font-bold">{s.title}</div>
              <div className="mt-2 text-gray-600">{s.desc}</div>
              <div className="mt-4">
                <button onClick={() => { document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' }); setFormStatus({ type: 'info', text: `Booking for ${s.title}` }); }} className="text-sm text-emerald-700 cursor-pointer bg-transparent btn-dynamic">Book a consult →</button>
              </div>

              <div className="service-popup" aria-hidden>
                <div className="service-popup-inner">
                  <div className="font-semibold text-sm">{s.title}</div>
                  <div className="mt-2 text-xs text-gray-600">{s.popup}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Credentials */}
      <section id="about" className="bg-emerald-50 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold">About Monica</h3>
            <p className="mt-3 text-gray-700">Dietitian with a M.Sc. in Food Science, Nutrition & Dietetics and currently pursuing a Ph.D. in Nutrition and Dietetics. Special interest in lifestyle medicine and diabetes management. Evidence-based, compassionate and practical advice that fits into your life.</p>

            <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li>✔ M.Sc. Food Science, Nutrition & Dietetics</li>
              <li>✔ Pursuing Ph.D in Nutrition and Dietetics</li>
              <li>✔ Experience with hospitals & community programs</li>
              <li>✔ Practical meal plans and recipes</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded bg-white border btn-dynamic">Clinic Address</button>
              <button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 rounded bg-emerald-600 text-white btn-dynamic">Book Now</button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="doctor" className="w-56 h-56 object-cover rounded-xl shadow" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold">What patients say</h3>
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          {[{ name: 'Sita R', text: 'Helped me lose 8 kg in 3 months with realistic meal plans!' }, { name: 'Ramesh K', text: 'Practical advice and great follow-up. My diabetes numbers improved.' }].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="font-semibold">{t.name}</div>
              <div className="mt-2 text-gray-600">"{t.text}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ (accordion) */}
      <section id="faq" className="bg-white/80 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold">FAQ</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-gray-700">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left font-semibold">
                  {f.q}
                </button>
                {openFaq === idx && <div className="mt-2 text-sm text-gray-600">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="max-w-4xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold">Book an Appointment</h3>
        <p className="text-gray-600 mt-2">Fill this quick form — we will confirm by email/phone.</p>

        <form onSubmit={submitForm} className="mt-6 bg-white p-6 rounded-xl shadow-sm grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={handleChange} name="name" placeholder="Full name" className="p-3 border rounded" />
            <input value={form.email} onChange={handleChange} name="email" placeholder="Email" className="p-3 border rounded" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.phone} onChange={handleChange} name="phone" placeholder="Phone" className="p-3 border rounded" />
            <input value={form.date} onChange={handleChange} name="date" type="date" className="p-3 border rounded" />
          </div>
          <textarea value={form.message} onChange={handleChange} name="message" rows="4" placeholder="Tell us briefly about your concern" className="p-3 border rounded" />

          <div className="flex items-center gap-4">
            <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded btn-dynamic">Send Request</button>
          </div>

          {formStatus && (
            <div className={`text-sm mt-2 ${formStatus.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>{formStatus.text}</div>
          )}
        </form>
      </section>

      {/* Contact */}
      <footer id="contact" className="bg-emerald-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-lg">Monica S</div>
            <div className="text-sm mt-2">M.Sc Food Science, Nutrition & Dietetics — pursuing a Ph.D. in Nutrition and Dietetics</div>
            <div className="mt-1 text-sm">Email: dietitianmonica20@gmail.com</div>
            <div className="mt-1 text-sm">Instagram: <a href="https://www.instagram.com/dietitian_monica" className="underline">@dietitian_monica</a></div>
          </div>

          <div>
            <div className="font-semibold">Quick links</div>
            <ul className="mt-3 text-sm">
              <li><button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:underline btn-dynamic">Services</button></li>
              <li><button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:underline btn-dynamic">About</button></li>
              <li><button onClick={() => document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' })} className="hover:underline btn-dynamic">Book</button></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold">Opening hours</div>
            <div className="mt-2 text-sm">Mon - Fri: 9:30 AM - 6:30 PM</div>
            <div className="mt-1 text-sm">Sat: 10:00 AM - 2:00 PM</div>
            <div className="mt-1 text-sm">Sun: Closed</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-8 text-sm text-white/80">© {new Date().getFullYear()} Monica S. All rights reserved.</div>
      </footer>
    </div>
  );
}
