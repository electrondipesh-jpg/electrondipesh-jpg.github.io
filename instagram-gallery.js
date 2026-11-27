/* Instagram gallery: public display only, never contains API credentials. */
(async () => {
  const section = document.getElementById('instagram-gallery');
  const grid = document.getElementById('instagram-gallery-grid');
  if (!section || !grid) return;
  const safe = (value, instagram = false) => {
    try { const u = new URL(value); return u.protocol === 'https:' && (!instagram || /(^|\.)instagram\.com$/.test(u.hostname)) ? u.href : null; } catch { return null; }
  };
  try {
    const response = await fetch('instagram-feed.json', {cache: 'no-cache'});
    if (!response.ok) return;
    const feed = await response.json();
    if (feed.username !== 'electrontattoos' || !Array.isArray(feed.posts)) return;
    for (const post of feed.posts.slice(0,12)) {
      const href = safe(post.permalink, true);
      const image = safe(post.image);
      if (!href || !image) continue;
      const figure = document.createElement('figure');
      figure.className = 'gallery-tile';
      const a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const img = document.createElement('img');
      img.src = image; img.loading = 'lazy'; img.alt = (post.caption || 'Tattoo work by Electron Tattoos').slice(0,160);
      const caption = document.createElement('figcaption');
      caption.textContent = (post.type === 'VIDEO' ? '▶ Reel · ' : post.type === 'CAROUSEL_ALBUM' ? '▧ Carousel · ' : '') + (post.caption || 'View on Instagram').slice(0,130);
      img.addEventListener('error', () => { figure.remove(); section.hidden = !grid.children.length; });
      a.append(img, caption); figure.append(a); grid.append(figure);
    }
    section.hidden = !grid.children.length;
  } catch { /* Keep existing static portfolio visible. */ }
})();