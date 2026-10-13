/* The same validation contract runs in the browser and on the server. */
(function (global) {
  'use strict';
  const limits = { name: 120, email: 254, organization: 160, phone: 50, details: 5000, service: 32, timeline: 16, language: 2, website: 200 };
  const serviceIds = ['choose', 'custom', 'web', 'mobile-app', 'backend-api', 'integration', 'consulting', 'support', 'cloud'];
  const timelineIds = ['unsure', 'exploring', 'soon', 'planned'];
  function validate(input) {
    const values = {}, errors = {};
    for (const [key, limit] of Object.entries(limits)) {
      if (input[key] != null && typeof input[key] !== 'string') { errors[key] = 'invalid'; values[key] = ''; continue; }
      values[key] = (input[key] || '').trim();
      if (values[key].length > limit) errors[key] = 'long';
    }
    for (const key of ['name', 'email', 'details']) if (!values[key]) errors[key] = 'required';
    if (values.email && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email) || /[\r\n]/.test(values.email))) errors.email = 'invalid';
    if (values.name && /[\r\n\x00-\x1f]/.test(values.name)) errors.name = 'invalid';
    if (values.phone && (!/^[+\d() .-]+$/.test(values.phone) || values.phone.replace(/\D/g, '').length < 5)) errors.phone = 'invalid';
    values.service ||= 'choose';
    if (!serviceIds.includes(values.service)) errors.service = 'invalid';
    values.timeline ||= 'unsure';
    if (!timelineIds.includes(values.timeline)) errors.timeline = 'invalid';
    if (!['en', 'ar'].includes(values.language)) errors.language = 'invalid';
    if (values.website) errors.website = 'spam';
    return { values, errors, valid: !Object.keys(errors).length };
  }
  const rules = { limits, serviceIds, timelineIds, validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = rules;
  else global.MTContactRules = rules;
})(typeof window === 'undefined' ? globalThis : window);
