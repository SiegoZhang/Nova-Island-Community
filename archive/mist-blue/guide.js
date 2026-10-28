const theme = document.querySelector('#theme');
theme.addEventListener('click', () => {
  const dark = document.body.dataset.theme !== 'dark';
  document.body.dataset.theme = dark ? 'dark' : 'light';
  theme.setAttribute('aria-pressed', String(dark));
  theme.textContent = dark ? '切换浅色 ◑' : '切换深色 ◐';
});
let timer;
function announce(message) {
  clearTimeout(timer);
  document.querySelector('#status').textContent = message;
  timer = setTimeout(() => { document.querySelector('#status').textContent = ''; }, 2400);
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.dataset.copy); announce('已复制 ' + button.dataset.copy); }
  catch { announce('色值：' + button.dataset.copy); }
}));
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => announce(button.dataset.demo)));
