(() => {
  const c = window.SOLAR_CONFIG || {};
  document.querySelectorAll('[data-brand]').forEach(x => x.textContent = c.brandName || 'GIẢI PHÁP SOLAR');
  document.querySelectorAll('[data-phone-display]').forEach(x => x.textContent = c.phoneDisplay || '');
  document.querySelectorAll('[data-phone-link]').forEach(x => x.href = `tel:${c.phoneHref || ''}`);
  document.querySelectorAll('[data-zalo-link]').forEach(x => { x.href = c.zaloUrl || '#'; if (c.zaloUrl && c.zaloUrl !== '#') x.target = '_blank'; });
  document.querySelectorAll('[data-service-area]').forEach(x => x.textContent = c.serviceArea || '');
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  document.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => window.SolarTracking?.event('cta_click', { placement: el.dataset.track })));
})();