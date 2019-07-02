const {app, nativeImage} = require('electron');

const badgeDescription = 'Update notification';

const firstTimeUpdate = false;

const generatorBadge = (
  count,
  {
    color = 'white',
    background = 'red',
    fontSize = '10px',
    fontFamily = 'Arial',
    fontWeight = 'bold',
  } = {},
) => {
  if (!count) {
    return count;
  }

  count = parseInt(count, 10);

  const badgeSvg = `<?xml version="1.0" encoding="utf-8"?>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
    <circle cx="8" cy="8" r="8" fill="${background}" />
    <text x="50%" y="50%" text-anchor="middle" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" dy=".3em">1</text>
  </svg>`;

  const encoded = encodeURIComponent(badgeSvg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  const header = 'data:image/svg+xml,';
  const dataUrl = header + encoded;
  return dataUrl;
};

const updateBadgeUnix = (win, count, animation = true) => {
  app.setBadgeCount(count);

  if (animation && count && app.dock) {
    app.dock.bounce();
  }
};

const updateBadgeWindows = (win, count, animation = true, badgeOpts = {}) => {
  if (!firstTimeUpdate) {
    win.once('focus', () => win.flashFrame(false));
  }

  const badge = generatorBadge(count, badgeOpts);

  if (!badge) {
    return win.setOverlayIcon(null, badgeDescription);
  }

  win.setOverlayIcon(nativeImage.createFromDataURL(badge), badgeDescription);

  if (animation) {
    win.flashFrame(true);
  }
};

const updateBadge = (win, count, animation = true, badgeOpts = {}) => {
  if (process.platform === 'win32' || process.windowsStore === true) {
    updateBadgeWindows(win, count, animation, badgeOpts);
  } else {
    updateBadgeUnix(win, count, animation);
  }
};

module.exports = {
  generatorBadge,
  updateBadgeUnix,
  updateBadgeWindows,
  updateBadge,
};
