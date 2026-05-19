declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackContactFormSubmission(): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'contact',
      event_label: 'contact_form_submission',
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Lead');
  }
}
