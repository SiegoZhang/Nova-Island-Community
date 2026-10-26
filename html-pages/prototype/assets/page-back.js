// Standalone detail pages return to the originating prototype list.
(() => {
  const back = document.querySelector('[data-detail-back]');
  if (!back) return;
  const destination = new URLSearchParams(location.search).get('return');
  if (destination && /^#(home|courses|columns|articles|community|events|personal|guide|search)(\?|$)/.test(destination)) {
    back.href = 'index.html' + destination;
    if (destination.startsWith('#columns')) {
      document.querySelectorAll('.product-nav [data-page]').forEach(link => {
        const active = link.dataset.page === 'columns';
        link.classList.toggle('selected', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
  }
})();
