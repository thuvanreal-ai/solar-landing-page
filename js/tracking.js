window.SolarTracking = (() => {
  function event(name, params = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    if (window.dataLayer && Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
    console.info('[SolarTracking]', name, params);
  }
  function leadSuccess() {
    event('generate_lead', { form_name: 'solar_check_v2' });
    const cfg = window.SOLAR_CONFIG?.analytics || {};
    if (cfg.googleAdsId && cfg.googleAdsLeadLabel && typeof window.gtag === 'function') window.gtag('event', 'conversion', { send_to: `${cfg.googleAdsId}/${cfg.googleAdsLeadLabel}` });
  }
  return { event, leadSuccess };
})();