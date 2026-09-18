/**
 * Ashray — Private Yoga & Wellness by Ishani
 * Master Application Script
 */

(function () {
  'use strict';

  /* ============================================================
     1. Theme Management (Light / Dark mode with persistence)
     ============================================================ */
  var THEME_KEY = 'ashray_theme';

  function getPreferredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    var isDark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', isDark ? 'Switch to warm daylight mode' : 'Switch to evening luxury dark mode');
      btn.setAttribute('title', isDark ? 'Switch to warm light' : 'Switch to evening dark');
      btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    });
  }

  var currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('[data-theme-toggle]');
    if (toggleBtn) {
      var activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    }
  });

  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue);
    }
  });

  /* ============================================================
     2. Footer Year
     ============================================================ */
  var currentYear = new Date().getFullYear();
  document.querySelectorAll('#footer-year, [data-year]').forEach(function (el) {
    el.textContent = currentYear;
  });

  /* ============================================================
     3. Unified Mobile Navigation
     ============================================================ */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  function toggleMobileNav(forceState) {
    if (!menuToggle || !mobileNav) return;
    var isOpen = typeof forceState === 'boolean' ? forceState : !mobileNav.classList.contains('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobileNav.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      toggleMobileNav();
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMobileNav(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggleMobileNav(false);
        menuToggle.focus();
      }
    });
  }

  /* ============================================================
     4. Active Nav Link Auto-Detection
     ============================================================ */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

  document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var linkFile = href.split('#')[0].split('?')[0];
    if (linkFile === currentPath) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    } else if (currentPath === 'index.html' && (linkFile === 'index.html' || linkFile === '')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ============================================================
     5. Sticky Header Scroll Indicator
     ============================================================ */
  var header = document.getElementById('site-header');
  if (header) {
    var handleScroll = function () {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ============================================================
     6. Resilient Media Fallback Handler
     ============================================================ */
  function createMediaFallback(title, subtitle) {
    var fallback = document.createElement('div');
    fallback.className = 'media-fallback-placeholder';
    fallback.innerHTML = 
      '<div class="media-fallback-icon" aria-hidden="true">✦</div>' +
      '<div class="media-fallback-label">' + (title || 'Ashray Yoga Practice') + '</div>' +
      '<div class="media-fallback-sub">' + (subtitle || 'Mindful morning practice by Ishani') + '</div>';
    return fallback;
  }

  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      var alt = img.getAttribute('alt') || 'Yoga Posture';
      var parent = img.parentElement;
      if (parent) {
        var fallback = createMediaFallback(alt, 'Live guided session');
        parent.replaceChild(fallback, img);
      }
    }, { once: true });
  });

  document.querySelectorAll('video').forEach(function (video) {
    video.addEventListener('error', function () {
      var parent = video.closest('.gallery-media-thumb') || video.parentElement;
      if (parent) {
        var label = video.getAttribute('data-fallback-label') || 'Session Video';
        var fallback = createMediaFallback(label, 'Streamed in live 1:1 sessions');
        parent.innerHTML = '';
        parent.appendChild(fallback);
      }
    }, { once: true, capture: true });
  });

  /* ============================================================
     7. Lightbox System for Gallery
     ============================================================ */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = document.getElementById('lightbox-image');
    var lightboxVideo = document.getElementById('lightbox-video');
    var lightboxTitle = document.getElementById('lightbox-title');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(title, desc, src, isVideo) {
      if (lightboxTitle) lightboxTitle.textContent = title || '';
      if (lightboxCaption) lightboxCaption.textContent = desc || '';

      if (isVideo) {
        if (lightboxImg) lightboxImg.hidden = true;
        if (lightboxVideo) {
          lightboxVideo.hidden = false;
          lightboxVideo.src = src;
          lightboxVideo.play().catch(function () {});
        }
      } else {
        if (lightboxVideo) {
          lightboxVideo.hidden = true;
          lightboxVideo.pause();
          lightboxVideo.removeAttribute('src');
        }
        if (lightboxImg) {
          lightboxImg.hidden = false;
          lightboxImg.src = src;
          lightboxImg.alt = title || 'Yoga gallery item';
        }
      }

      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute('src');
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });

    document.querySelectorAll('[data-lightbox-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var title = btn.getAttribute('data-title') || '';
        var desc = btn.getAttribute('data-desc') || '';
        var src = btn.getAttribute('data-src') || '';
        var isVideo = btn.getAttribute('data-is-video') === 'true';
        openLightbox(title, desc, src, isVideo);
      });
    });
  }

  /* ============================================================
     8. Consultation Form Auto-populate & Validation
     ============================================================ */
  var consForm = document.getElementById('cons-apply-form') || document.getElementById('apply-form');
  if (consForm) {
    // Parse query params for pre-selecting program
    var urlParams = new URLSearchParams(window.location.search);
    var requestedProgram = urlParams.get('program');
    var programSelect = document.getElementById('program');
    if (programSelect && requestedProgram) {
      if (requestedProgram.indexOf('private') !== -1) programSelect.value = 'private';
      else if (requestedProgram.indexOf('group') !== -1) programSelect.value = 'group';
    }

    var successBox = document.getElementById('form-success');
    var submitBtn = consForm.querySelector('button[type="submit"]');

    consForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredInputs = consForm.querySelectorAll('[required]');
      var isValid = true;
      var firstInvalid = null;

      requiredInputs.forEach(function (input) {
        var errorEl = consForm.querySelector('[data-error-for="' + input.id + '"]');
        var val = input.value.trim();
        var fieldOk = true;

        if (input.type === 'checkbox') {
          fieldOk = input.checked;
        } else if (!val) {
          fieldOk = false;
        } else if (input.type === 'email') {
          fieldOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        } else if (input.type === 'tel') {
          fieldOk = val.replace(/\D/g, '').length >= 7;
        }

        if (!fieldOk) {
          isValid = false;
          input.setAttribute('aria-invalid', 'true');
          if (errorEl) errorEl.textContent = input.getAttribute('data-error-msg') || 'Please complete this field.';
          if (!firstInvalid) firstInvalid = input;
        } else {
          input.removeAttribute('aria-invalid');
          if (errorEl) errorEl.textContent = '';
        }
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Submission simulation with real visual feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }

      var formData = {
        fullName: (document.getElementById('fullName') || {}).value || '',
        email: (document.getElementById('email') || {}).value || '',
        phone: (document.getElementById('phone') || {}).value || '',
        program: (document.getElementById('program') || {}).value || '',
        goals: (document.getElementById('goals') || {}).value || '',
        submittedAt: new Date().toISOString()
      };

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
        consForm.hidden = true;
        if (successBox) {
          successBox.hidden = false;
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        console.log('Consultation request recorded for Ishani:', formData);
      }, 650);
    });
  }

  /* ============================================================
     9. Newsletter Subscription Handler
     ============================================================ */
  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.parentElement.querySelector('.newsletter-status');
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input ? input.value.trim() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.hidden = false;
          status.className = 'newsletter-status is-error';
          status.textContent = 'Please enter a valid email address.';
        }
        if (input) input.focus();
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.classList.add('is-loading');
      }

      setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('is-loading');
        }
        form.reset();
        if (status) {
          status.hidden = false;
          status.className = 'newsletter-status is-success';
          status.textContent = 'Thank you for joining Ashray. Your peaceful practice sound album is on its way.';
        }
      }, 500);
    });
  });

  /* ============================================================
     10. Interactive Soundscape Synthesizer for Music Library
     ============================================================ */
  var activeAudioCtx = null;
  var activeNodes = [];
  var currentlyPlayingTrack = null;

  function stopCurrentAudio() {
    if (activeNodes.length) {
      activeNodes.forEach(function (node) {
        try { node.stop(); } catch (err) {}
        try { node.disconnect(); } catch (err) {}
      });
      activeNodes = [];
    }
    document.querySelectorAll('.music-track-card').forEach(function (c) {
      c.classList.remove('is-playing');
      var pBtn = c.querySelector('.music-play-btn');
      if (pBtn) pBtn.innerHTML = '▶';
    });
    currentlyPlayingTrack = null;
  }

  function startAtmosphere(type) {
    stopCurrentAudio();
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!activeAudioCtx) activeAudioCtx = new AudioContext();
    if (activeAudioCtx.state === 'suspended') activeAudioCtx.resume();

    var masterGain = activeAudioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, activeAudioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.18, activeAudioCtx.currentTime + 1.2);
    masterGain.connect(activeAudioCtx.destination);

    var freqs = [108, 162, 216, 324]; // Base drone harmonic ratios
    if (type === 'bowls') freqs = [288, 432, 576, 864];
    if (type === 'bansuri') freqs = [220, 275, 330, 440];
    if (type === 'prana') freqs = [96, 144, 192, 288];

    freqs.forEach(function (f, idx) {
      var osc = activeAudioCtx.createOscillator();
      var gain = activeAudioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, activeAudioCtx.currentTime);

      // Add soft vibrato
      var lfo = activeAudioCtx.createOscillator();
      var lfoGain = activeAudioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, activeAudioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, activeAudioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.15 / (idx + 1), activeAudioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      lfo.start();
      activeNodes.push(osc, lfo, gain, lfoGain);
    });
    activeNodes.push(masterGain);
  }

  document.querySelectorAll('[data-soundscape]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.music-track-card');
      var type = btn.getAttribute('data-soundscape');
      if (currentlyPlayingTrack === type) {
        stopCurrentAudio();
      } else {
        startAtmosphere(type);
        currentlyPlayingTrack = type;
        if (card) {
          card.classList.add('is-playing');
          btn.innerHTML = '❚❚';
        }
      }
    });
  });

  /* ============================================================
     11. Instructor Carousel & Filter Interaction
     ============================================================ */
  var instructorCard = document.querySelector('.instructor-profile');
  if (instructorCard) {
    var dots = instructorCard.querySelectorAll('.instructor-dots button');
    var prevBtn = instructorCard.querySelector('.instructor-prev');
    var nextBtn = instructorCard.querySelector('.instructor-next');
    var currentSlide = 0;
    var totalSlides = dots.length || 4;

    function setSlide(idx) {
      currentSlide = (idx + totalSlides) % totalSlides;
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { setSlide(currentSlide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setSlide(currentSlide + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { setSlide(i); });
    });
  }

  // Instructor category filter tabs
  var filterButtons = document.querySelectorAll('.instructor-filters .filter-btn');
  var instructorCards = document.querySelectorAll('.instructors-grid .instructor-card');

  if (filterButtons.length && instructorCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter') || 'all';

        instructorCards.forEach(function (card) {
          var category = card.getAttribute('data-category') || '';
          if (filter === 'all' || category.indexOf(filter) !== -1) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

})();
