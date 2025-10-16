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

  // Load Bitcoin price data
  loadBitcoinData();

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

// Bitcoin Data Functions
function loadBitcoinData() {
  // Using CoinGecko API (free, no API key required)
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_24hr_high=true&include_24hr_low=true')
    .then(response => response.json())
    .then(data => {
      if (data.bitcoin) {
        updateBitcoinDisplay(data.bitcoin);
        generateChart(data.bitcoin);
      }
    })
    .catch(error => {
      console.log('Error loading Bitcoin data:', error);
      // Fallback to static data
      updateBitcoinDisplay({
        usd: 43250,
        usd_24h_change: 2.5,
        usd_24h_vol: 25000000000,
        usd_24h_high: 44500,
        usd_24h_low: 42000
      });
    });
}

function updateBitcoinDisplay(data) {
  const priceEl = document.getElementById('btc-price');
  const changeEl = document.getElementById('btc-change');
  const highEl = document.getElementById('btc-high');
  const lowEl = document.getElementById('btc-low');
  const volumeEl = document.getElementById('btc-volume');

  if (priceEl) {
    priceEl.textContent = '$' + data.usd.toLocaleString();
  }

  if (changeEl) {
    const change = data.usd_24h_change || 0;
    changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
    changeEl.className = 'crypto-change ' + (change >= 0 ? 'positive' : 'negative');
  }

  if (highEl) {
    highEl.textContent = '$' + (data.usd_24h_high || data.usd * 1.03).toLocaleString();
  }

  if (lowEl) {
    lowEl.textContent = '$' + (data.usd_24h_low || data.usd * 0.97).toLocaleString();
  }

  if (volumeEl) {
    const volume = data.usd_24h_vol || 25000000000;
    volumeEl.textContent = formatVolume(volume);
  }
}

function formatVolume(volume) {
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(1) + 'B';
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(1) + 'M';
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(1) + 'K';
  }
  return volume.toString();
}

function generateChart(data) {
  const chartLine = document.getElementById('btc-chart-line');
  const chartArea = document.getElementById('btc-chart-area');
  
  if (!chartLine || !chartArea) return;

  // Generate a more realistic price chart path
  const points = 100;
  const width = 1200;
  const height = 400;
  const basePrice = data.usd;
  const volatility = 0.03; // 3% volatility
  
  let pathData = '';
  let areaData = '';
  let pricePoints = [];
  
  // Generate price points with realistic market movement
  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    const x = progress * width;
    
    // Create a more realistic price movement
    const trend = Math.sin(progress * Math.PI * 3) * 0.02; // Long-term trend
    const noise = (Math.random() - 0.5) * volatility; // Random noise
    const momentum = Math.sin(progress * Math.PI * 8) * 0.01; // Short-term momentum
    
    const priceVariation = trend + noise + momentum;
    const normalizedPrice = 1 + priceVariation;
    const y = height - (normalizedPrice * height * 0.4 + height * 0.3);
    
    pricePoints.push({x, y});
    
    if (i === 0) {
      pathData += `M${x},${y}`;
      areaData += `M${x},${height} L${x},${y}`;
    } else {
      // Use smooth curves for more realistic chart
      const prevPoint = pricePoints[i-1];
      const cp1x = prevPoint.x + (x - prevPoint.x) * 0.3;
      const cp1y = prevPoint.y;
      const cp2x = prevPoint.x + (x - prevPoint.x) * 0.7;
      const cp2y = y;
      
      pathData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      areaData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }
  }
  
  areaData += ` L${width},${height} Z`;
  
  // Set the paths
  chartLine.setAttribute('d', pathData);
  chartArea.setAttribute('d', areaData);
  
  // Add animated data points
  addAnimatedDataPoints(pricePoints);
}

function addAnimatedDataPoints(points) {
  const chartBg = document.querySelector('.hero-chart-bg');
  if (!chartBg) return;
  
  // Remove existing animated points
  const existingPoints = chartBg.querySelectorAll('.animated-point');
  existingPoints.forEach(point => point.remove());
  
  // Add new animated points
  points.forEach((point, index) => {
    if (index % 10 === 0) { // Add points every 10th data point
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', '2');
      circle.setAttribute('fill', '#0ea5e9');
      circle.setAttribute('opacity', '0');
      circle.classList.add('animated-point');
      
      // Add animation
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'opacity');
      animate.setAttribute('values', '0;1;0');
      animate.setAttribute('dur', '3s');
      animate.setAttribute('begin', `${index * 0.05}s`);
      animate.setAttribute('repeatCount', 'indefinite');
      
      circle.appendChild(animate);
      chartBg.querySelector('svg').appendChild(circle);
    }
  });
}

// Update Bitcoin data every 30 seconds
setInterval(loadBitcoinData, 30000);
