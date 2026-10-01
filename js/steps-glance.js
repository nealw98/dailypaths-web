(() => {
  const dialog = document.getElementById('steps-glance-dialog');
  const trigger = document.querySelector('[data-steps-glance-open]');
  if (!dialog || !trigger) return;

  trigger.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-steps-glance-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    // The dialog element is the backdrop hit target outside its visible rectangle.
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => trigger.focus());
})();
