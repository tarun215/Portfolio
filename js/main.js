/* ==========================================================================
   THARUN S - PORTFOLIO INTERACTIVITY & SAAS ANIMATIONS
   Dynamic Canvas Particles, Sound FX, Typewriter, Modals, Filters, Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTypewriter();
  initThemeSwitcher();
  initSoundEngine();
  initSkillsFilter();
  initProjectModals();
  initResumeModal();
  initContactForm();
  initTiltEffect();
  initCustomCursor();
  initMobileMenu();
  initStatsCounter();
});

/* ==========================================================================
   1. AMBIENT PARTICLE CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.opacity = Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Computer Science Engineer',
    'Full-Stack Developer',
    'Rural AI Innovator (VajraYield)',
    'Data Pipeline & ML Builder',
    'Problem Solver & LeetCoder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }
  setTimeout(type, 800);
}

/* ==========================================================================
   3. SOUND ENGINE (Synthesizer via Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
  const soundToggle = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundIcon) {
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      }
      showToast(soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted');
      if (soundEnabled) playTone(587.33, 'sine', 0.12, 0.08);
    });
  }

  // Bind interactive buttons
  document.querySelectorAll('button, .btn, .nav-link, .filter-btn, .theme-opt-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => playTone(880, 'sine', 0.03, 0.015));
    elem.addEventListener('click', () => playTone(440, 'triangle', 0.08, 0.04));
  });
}

/* ==========================================================================
   4. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-picker-menu');
  const themeOptions = document.querySelectorAll('.theme-opt-btn');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!themeMenu.contains(e.target) && e.target !== themeBtn) {
        themeMenu.classList.remove('active');
      }
    });
  }

  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme-val');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('tharun_theme', theme);
      if (themeMenu) themeMenu.classList.remove('active');
      showToast(`🎨 Theme switched to ${opt.innerText.trim()}`);
    });
  });

  const savedTheme = localStorage.getItem('tharun_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

/* ==========================================================================
   5. SKILLS FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'slideInToast 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT MODALS & ARCHITECTURE DETAILS
   ========================================================================== */
const projectData = {
  vajrayield: {
    title: 'VajraYield — Rural Market Intelligence Engine',
    subtitle: 'Hackathon Premier League (HPL) 2026 | SMVITM Bantakal',
    tags: ['React', 'JavaScript', 'CSS3', 'Vite', 'Supabase', 'Web Speech API', 'Vitest'],
    github: 'https://github.com/tarun215/HPL',
    overview: 'VajraYield is an end-to-end precision rural market intelligence and decision-support engine engineered specifically for Coastal Karnataka farmers.',
    features: [
      '<b>Deterministic Revenue Engine:</b> Real-time net realization calculation accounting for distance, fuel, tolls, APMC cess, statutory deductions, vehicle hire, and perishability decay curves.',
      '<b>Regional Farmer Intelligence:</b> Native support for Udupi farmer clusters including Mattu Gulla (GI tagged), Shankarapura Jasmine, and Arecanut.',
      '<b>Kannada & Tulu Voice Briefings:</b> Integrated Web Speech API for auditory briefings in local regional dialects.',
      '<b>Cooperative Freight Pooling:</b> Multi-farmer route optimization and freight cost-sharing algorithms.',
      '<b>27 Vitest Test Suites:</b> Full test coverage verifying mathematical accuracy, unit pooling scenarios, edge cases, and input validation.'
    ],
    metrics: [
      { label: 'Vitest Test Cases', value: '27 Passing' },
      { label: 'Supported Mandis', value: '14+ Coastal' },
      { label: 'Languages', value: 'Kannada, Tulu, English' },
      { label: 'Precision', value: 'Deterministic ±0.01 INR' }
    ]
  },
  parametric: {
    title: 'Parametric AI — Industrial Catalog Data Pipeline',
    subtitle: 'UniHack 2026 | Unilog & Hack2Skill',
    tags: ['Python', 'FastAPI', 'PyMuPDF', 'Pandas', 'Generative AI', 'Regex Normalization'],
    github: 'https://github.com/tarun215',
    overview: 'An automated high-throughput document ingestion and data intelligence pipeline designed to transform fragmented industrial technical specification sheets and PDF catalogs into unified structured databases.',
    features: [
      '<b>Multi-layer PDF Extraction:</b> Utilizing PyMuPDF and OCR to accurately extract tabular specs, tolerance ranges, and engineering parameters.',
      '<b>Visual Provenance:</b> Direct coordinate-mapping visual provenance allowing operators to click any extracted attribute and see the exact bounding box in the original PDF source.',
      '<b>Deterministic Unit Normalization:</b> Custom pipeline standardizing imperial and metric engineering units into unified schemas.',
      '<b>FastAPI Backend:</b> Async REST endpoints capable of batch document processing with near-zero latency overhead.'
    ],
    metrics: [
      { label: 'Extraction Accuracy', value: '98.4%' },
      { label: 'Processing Speed', value: '<1.2s / doc' },
      { label: 'Provenance', value: 'Coordinate-level' },
      { label: 'Data Output', value: 'Structured JSON/SQL' }
    ]
  },
  vetclinic: {
    title: 'Veterinary Clinic Management System',
    subtitle: 'Academic Flagship Database Project (2025-2026)',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Python/PHP', 'MySQL', 'Relational Schemas'],
    github: 'https://github.com/tarun215',
    overview: 'A robust relational database-driven healthcare management platform tailored for veterinary hospitals and animal clinics to streamline appointments, patient records, and pharmacy inventory.',
    features: [
      '<b>Relational Schema Design:</b> Comprehensive 3NF normalized schema handling pet records, breed metadata, vaccinations, treatment histories, and doctor allocations.',
      '<b>Interactive Appointment Triage:</b> Doctor availability scheduler with automated conflict detection and patient status tracking.',
      '<b>Secure Medical Records:</b> Encrypted health card records, prescription issuance, and billing integration.',
      '<b>Clean Frontend Dashboard:</b> Responsive administrative interface built with modern vanilla HTML, CSS, and asynchronous JavaScript.'
    ],
    metrics: [
      { label: 'Architecture', value: 'Normalized 3NF' },
      { label: 'Database', value: 'MySQL' },
      { label: 'Security', value: 'Role-Based Access' },
      { label: 'Interface', value: 'Dynamic SPA Dashboard' }
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('project-modal-body');
  const closeBtn = document.getElementById('project-modal-close');

  if (!modalBackdrop || !modalContent) return;

  document.querySelectorAll('.open-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span class="project-tag-pill" style="margin-bottom: 10px; display: inline-block;">${data.subtitle}</span>
          <h2 style="font-size: 2rem; margin: 8px 0 16px;">${data.title}</h2>
          <div class="tech-stack-row" style="margin-bottom: 20px;">
            ${data.tags.map(t => `<span class="tech-chip">${t}</span>`).join('')}
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">
          ${data.overview}
        </p>

        <h3 style="font-size: 1.25rem; margin-bottom: 14px; color: #fff;">Key Architectural Highlights</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px;">
          ${data.features.map(f => `
            <li style="display: flex; gap: 12px; font-size: 0.95rem; color: #cbd5e1;">
              <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 4px;"></i>
              <div>${f}</div>
            </li>
          `).join('')}
        </ul>

        <h3 style="font-size: 1.25rem; margin-bottom: 14px; color: #fff;">Engineering Metrics</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 30px;">
          ${data.metrics.map(m => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 14px; border-radius: var(--radius-sm);">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-family: var(--font-mono);">${m.label}</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan); margin-top: 4px;">${m.value}</div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <button class="btn btn-secondary btn-sm" onclick="closeModal('project-modal')">Close Window</button>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('project-modal'));
  }
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal('project-modal');
  });
}

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

/* ==========================================================================
   7. RESUME MODAL & DOWNLOAD
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!resumeModal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal('resume-modal'));
  }
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeModal('resume-modal');
  });
}

/* ==========================================================================
   8. CONTACT FORM & CLIPBOARD ACTIONS
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      if (!name || !email || !message) {
        showToast('⚠️ Please fill out all required fields.');
        return;
      }

      showToast(`✨ Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }

  // Quick copy triggers
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`📋 Copied to clipboard: ${text}`);
        });
      }
    });
  });
}

/* ==========================================================================
   9. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(msg) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   10. 3D CARD TILT EFFECT
   ========================================================================== */
function initTiltEffect() {
  const tiltElements = document.querySelectorAll('.tilt-card');

  tiltElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      elem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   11. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  if (window.innerWidth < 1024) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  document.body.appendChild(cursor);
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function render() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(render);
  }
  render();

  document.querySelectorAll('a, button, input, textarea, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.borderColor = 'var(--accent-cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'var(--primary)';
    });
  });
}

/* ==========================================================================
   12. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('mobile-open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   13. STATS ANIMATED COUNTER
   ========================================================================== */
function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-count');
  let animated = false;

  function countUp() {
    statValues.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
          clearInterval(timer);
        } else {
          el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        }
      }, stepTime);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      countUp();
    }
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) observer.observe(statsSection);
}
