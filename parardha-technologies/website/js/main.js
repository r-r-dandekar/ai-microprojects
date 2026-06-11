import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { submitContactForm } from './supabase-client.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Fade-in on scroll ────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-section').forEach(el => observer.observe(el));

// ── Hamburger menu ───────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Active nav link on scroll ────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: `-66px 0px -60% 0px` });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact form ─────────────────────────────────────────────────────────
const form = document.getElementById('contact-form');
const formError = document.getElementById('form-error');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  const result = await submitContactForm(supabase, {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  });

  if (result.success) {
    form.hidden = true;
    formSuccess.hidden = false;
  } else {
    formError.textContent = result.error || 'Something went wrong. Please try again.';
    formError.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});
