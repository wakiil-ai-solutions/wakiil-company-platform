// Public-safe configuration. Keep real endpoints out of source control when possible.
export const siteConfig = {
  bookingUrl: import.meta.env.VITE_BOOKING_URL || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@wakiilai.com',
  leadEndpoint: import.meta.env.VITE_LEAD_ENDPOINT || '',
  chatEndpoint: import.meta.env.VITE_CHAT_ENDPOINT || '',
};
