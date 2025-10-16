// Smooth scroll for [data-scroll] anchors
document.addEventListener('click', function (e) {
  const target = e.target.closest('[data-scroll]');
  if (!target) return;
  const href = target.getAttribute('href');
  if (!href || !href.startsWith('#')) return;
  const el = document.querySelector(href);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Set current year in footer
document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // CTAs - WhatsApp for contact, Google Forms for services
  var whatsappPrimary = document.getElementById('whatsapp-primary');
  var whatsappTrader = document.getElementById('whatsapp-trader');
  var whatsappInvestor = document.getElementById('whatsapp-investor');
  var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSctK6F8s_-yVI7CGl1zdLRElGl20rmyKx6Z861492sWDLnN7g/viewform';
  var phone = '50254113908'; // Guatemala WhatsApp number
  var waUrl = function(message){ return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message); };
  
  // WhatsApp button goes to WhatsApp
  if (whatsappPrimary) {
    whatsappPrimary.setAttribute('href', waUrl('Hola, me interesa Fintelia Activos.'));
    whatsappPrimary.setAttribute('target', '_blank');
    whatsappPrimary.setAttribute('rel', 'noopener');
  }
  // Service buttons go to Google Forms
  if (whatsappTrader) {
    whatsappTrader.setAttribute('href', formUrl);
    whatsappTrader.setAttribute('target', '_blank');
    whatsappTrader.setAttribute('rel', 'noopener');
  }
  if (whatsappInvestor) {
    whatsappInvestor.setAttribute('href', formUrl);
    whatsappInvestor.setAttribute('target', '_blank');
    whatsappInvestor.setAttribute('rel', 'noopener');
  }

  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var navMenu = document.querySelector('.nav-menu');
  var navOverlay = document.querySelector('.nav-overlay');
  
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    navOverlay.classList.remove('open');
  }
  
  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    navOverlay.classList.add('open');
  }
  
  if (menuToggle && navMenu && navOverlay) {
    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    
    // Close menu when clicking overlay
    navOverlay.addEventListener('click', function() {
      closeMenu();
    });
    
    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Accordion toggle
  document.querySelectorAll('.accordion-header').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.accordion-item');
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      // close siblings inside same accordion
      var container = item.parentElement;
      container.querySelectorAll('.accordion-item').forEach(function(sib){
        if (sib !== item) {
          sib.classList.remove('open');
          var h = sib.querySelector('.accordion-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        }
      });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      item.classList.toggle('open', !expanded);
    });
  });
});


