// Respect motion preferences and provide a persistent pause control.
const showcase = document.querySelector('.logo-showcase');
const pauseButton = document.getElementById('logo-pause');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
function syncLogos() {
  const reduced = motionPreference.matches;
  showcase.classList.toggle('is-animated', !reduced);
  showcase.classList.toggle('is-paused', userPaused);
  pauseButton.hidden = reduced;
  pauseButton.setAttribute('aria-pressed', String(userPaused));
  pauseButton.textContent = userPaused ? 'Resume scrolling' : 'Pause scrolling';
}
pauseButton.addEventListener('click', () => { userPaused = !userPaused; syncLogos(); });
motionPreference.addEventListener('change', syncLogos);
syncLogos();
