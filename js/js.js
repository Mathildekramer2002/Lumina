/**
 * file: js/js.js
 * purpose: Behaviors
 **/
console.log('Success: JavaScript running!')



// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const vid = document.getElementById('reklame');
  if (!vid) return;

  // Ensure muted so browsers allow autoplay
  vid.muted = true;

  // Track if user manually paused the video (respect their intent)
  let userPaused = false;
  vid.addEventListener('pause', () => {
    // If pause wasn't triggered by our observer-controlled action, mark as user-paused
    if (!vid._observerControlled) userPaused = true;
    vid._observerControlled = false;
  });
  vid.addEventListener('play', () => {
    userPaused = false;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const visibleEnough = entry.intersectionRatio >= 0.5; // play when >=50% visible
      if (visibleEnough) {
        if (!userPaused) {
          vid._observerControlled = true;
          vid.play().catch(() => {
            // fallback: ensure muted then try again
            vid.muted = true;
            try { vid.play(); } catch (e) { /* ignore */ }
          });
        }
      } else {
        // pause when less than threshold visible
        vid._observerControlled = true;
        vid.pause();
      }
    });
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

  observer.observe(vid);
});
// ...existing code...
