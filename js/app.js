(() => {
  const c = window.SOLAR_CONFIG || {};
  document.querySelectorAll('[data-brand]').forEach(x => x.textContent = c.brandName || 'GIẢI PHÁP SOLAR');
  document.querySelectorAll('[data-phone-display]').forEach(x => x.textContent = c.phoneDisplay || '');
  document.querySelectorAll('[data-phone-link]').forEach(x => x.href = `tel:${c.phoneHref || ''}`);
  document.querySelectorAll('[data-zalo-link]').forEach(x => { x.href = c.zaloUrl || '#'; if (c.zaloUrl && c.zaloUrl !== '#') x.target = '_blank'; });
  document.querySelectorAll('[data-service-area]').forEach(x => x.textContent = c.serviceArea || '');
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.playsInline = true;
    const startHeroVideo = () => {
      const p = heroVideo.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    if (heroVideo.readyState >= 2) startHeroVideo();
    else heroVideo.addEventListener('canplay', startHeroVideo, { once: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && heroVideo.paused) startHeroVideo(); });
  }
  document.querySelectorAll('[data-track]').forEach(el => el.addEventListener('click', () => window.SolarTracking?.event('cta_click', { placement: el.dataset.track })));
})();