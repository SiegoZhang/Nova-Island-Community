// Standalone detail pages return to the originating prototype list.
(() => {
  const back = document.querySelector('[data-detail-back]');
  if (!back) return;
  const destination = new URLSearchParams(location.search).get('return');
  if (destination && /^#(home|courses|articles|community|events|practice|personal|guide|search)(\?|$)/.test(destination)) {
    back.href = 'index.html' + destination;
  }
})();
