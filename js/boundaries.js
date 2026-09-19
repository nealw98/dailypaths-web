/* Optional enlarged reading views; the complete inserts remain in the article. */
(() => {
  const dialog = document.querySelector('.boundary-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const content = dialog.querySelector('.boundary-dialog-content');
  const close = dialog.querySelector('.boundary-close');
  let origin, scrollPosition, previousBodyStyle, previousScrollBehavior;

  document.querySelectorAll('[data-expand-insert]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      origin = button;
      scrollPosition = { x: window.scrollX, y: window.scrollY };
      const insert = button.closest('.boundary-insert').cloneNode(true);
      insert.querySelector('[data-expand-insert]').remove();
      insert.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      insert.querySelector('h3').id = 'boundary-dialog-title';
      insert.setAttribute('aria-labelledby', 'boundary-dialog-title');
      content.replaceChildren(insert);
      previousBodyStyle = document.body.getAttribute('style');
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      Object.assign(document.body.style, {
        position: 'fixed', top: `-${scrollPosition.y}px`, left: `-${scrollPosition.x}px`, width: '100%',
      });
      dialog.showModal();
      dialog.scrollTop = 0;
      close.focus({ preventScroll: true });
    });
  });
  close.addEventListener('click', () => dialog.close());
  // Keep Tab on the sole dialog control; native cancel handles Escape.
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
  });
  dialog.addEventListener('close', () => {
    if (previousBodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', previousBodyStyle);
    document.documentElement.style.scrollBehavior = 'auto';
    origin?.focus({ preventScroll: true });
    window.scrollTo(scrollPosition.x, scrollPosition.y);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    content.replaceChildren();
  });
})();
