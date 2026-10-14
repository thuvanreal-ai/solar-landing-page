// ERA Solar conversion events are sent through Google Tag Manager's dataLayer.
// Do not call gtag() as well: that would duplicate events when GTM owns GA4.
window.SolarTracking = (() => {
  function event(name, params = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
  }
  function leadSuccess() {
    // The form uses sendBeacon/no-cors and cannot verify the Apps Script response.
    // Count as a submission attempt, not a confirmed CRM lead.
    event('solar_lead_submit', { form_name: 'solar_check_v2', verification: 'unconfirmed' });
  }
  return { event, leadSuccess };
})();
