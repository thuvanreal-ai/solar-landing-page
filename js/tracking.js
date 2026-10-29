// GTM owns GA4 events; do not also call gtag().
window.SolarTracking = (() => {
  function event(name, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  }
  function leadAttempt() {
    // sendBeacon/no-cors does NOT confirm a lead was stored by Apps Script.
    // Do not fire solar_lead_submit as a confirmed conversion.
    event('solar_lead_attempt', { form_name: 'solar_check_v2', verification: 'unconfirmed' });
  }
  return { event, leadAttempt };
})();
