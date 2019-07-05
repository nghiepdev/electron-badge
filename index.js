const {app, ipcMain, nativeImage} = require('electron');
const BadgeGenerator = require('./badge');

const UPDATE_BADGE_EVENT = 'update-badge';
const badgeDescription = 'Update notification';
const max = 99;

class Badge {
  constructor(win, {animation = true, ...styleOpts} = {}) {
    this.win = win;
    this.animation = animation;

    styleOpts = {max, ...styleOpts};

    this.max = styleOpts.max;

    this.generator = new BadgeGenerator(win, styleOpts);

    this.initListeners();
  }

  initListeners() {
    ipcMain.on(UPDATE_BADGE_EVENT, (event, ...args) => {
      this.updateBadge.apply(this, args);
    });

    if (this.animation) {
      this.win.once('focus', () => this.win.flashFrame(false));
    }
  }

  updateBadgeUnix(count, max) {
    if (process.platform === 'darwin' && max && count > max) {
      app.dock.setBadge(max + '+');
    } else {
      app.setBadgeCount(count);
    }

    if (this.animation && count && app.dock) {
      app.dock.bounce();
    }
  }

  updateBadgeWindows(count, opts) {
    if (!count) {
      return this.win.setOverlayIcon(null, badgeDescription);
    }

    this.generator
      .generate(count, opts)
      .then(image => {
        this.win.setOverlayIcon(
          nativeImage.createFromDataURL(image),
          badgeDescription,
        );

        if (this.animation) {
          this.win.flashFrame(true);
        }
      })
      .catch(error => {
        this.win.setOverlayIcon(null, badgeDescription);
      });
  }

  updateBadge(count, opts) {
    count = parseInt(count, 10);
    opts = {max: this.max, ...opts};

    if (process.platform === 'win32' || process.windowsStore === true) {
      this.updateBadgeWindows(count, opts);
    } else {
      this.updateBadgeUnix(count, opts.max);
    }
  }
}

module.exports = Badge;
