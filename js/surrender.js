/* Click-to-enlarge inserts, with a screen-reader/keyboard control but no visible button. */
(() => {
  const dialog = document.querySelector('.boundary-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const content = dialog.querySelector('.boundary-dialog-content');
  const close = dialog.querySelector('.boundary-close');
  let origin, position, bodyStyle, scrollBehavior;
  document.querySelectorAll('.surrender-guide [data-reading-insert]').forEach(insert => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'visually-hidden surrender-open';
    button.textContent = `Enlarge: ${insert.querySelector('h3').textContent}`;
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'surrender-reading-view');
    insert.prepend(button);
    insert.classList.add('is-expandable');
    insert.addEventListener('click', event => {
      if (event.target.closest('a') || window.getSelection()?.toString()) return;
      origin = button;
      position = { x: scrollX, y: scrollY };
      const copy = insert.cloneNode(true);
      copy.querySelector('.surrender-open').remove();
      copy.classList.remove('is-expandable');
      copy.querySelectorAll('[id], [aria-describedby]').forEach(element => { element.removeAttribute('id'); element.removeAttribute('aria-describedby'); });
      copy.querySelector('h3').id = 'surrender-dialog-title';
      copy.setAttribute('aria-labelledby', 'surrender-dialog-title');
      content.replaceChildren(copy);
      bodyStyle = document.body.getAttribute('style');
      scrollBehavior = document.documentElement.style.scrollBehavior;
      Object.assign(document.body.style, { position: 'fixed', top: `-${position.y}px`, left: `-${position.x}px`, width: '100%' });
      dialog.showModal();
      dialog.scrollTop = 0;
      close.focus({ preventScroll: true });
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')];
    const index = controls.indexOf(document.activeElement);
    event.preventDefault();
    controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
  });
  dialog.addEventListener('close', () => {
    if (bodyStyle === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', bodyStyle);
    document.documentElement.style.scrollBehavior = 'auto';
    origin.focus({ preventScroll: true });
    window.scrollTo(position.x, position.y);
    document.documentElement.style.scrollBehavior = scrollBehavior;
    content.replaceChildren();
  });
})();
