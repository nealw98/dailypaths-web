(() => {
  const root = document.querySelector('[data-email-manage]');
  if (!root) return;
  const button = root.querySelector('[data-email-button]');
  const status = root.querySelector('[data-email-status]');
  const lead = root.querySelector('[data-email-lead]');
  const token = new URLSearchParams(location.search).get('token') || '';
  const messages = {
    confirmed: 'Thank you. Your email address is confirmed.',
    already: 'This address is already confirmed.',
    unsubscribed: 'You are unsubscribed. No more Daily Paths emails will be sent to this address.',
    invalid: 'This link is not valid. Please use the link in your most recent email.',
  };
  const done = (text) => { lead.hidden = true; button.hidden = true; status.textContent = text; };
  if (!token) { done(messages.invalid); return; }
  button.addEventListener('click', async () => {
    button.disabled = true; status.textContent = 'One moment…';
    try {
      const response = await fetch(root.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: root.dataset.action, token }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (data.result && messages[data.result]) { done(messages[data.result]); return; }
      throw new Error(data.error || 'Something went wrong.');
    } catch (error) {
      status.textContent = 'We could not complete that. Please try again, or write to support@dailypaths.org.';
      button.disabled = false;
    }
  });
})();
