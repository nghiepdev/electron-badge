const defaultStyle = {
  color: 'white',
  background: 'red',
  fontSize: '10px',
  fontFamily: 'Arial',
  fontWeight: 'bold',
};

class BadgeGenerator {
  constructor(win, styleOpts = {}) {
    this.win = win;
    this.style = Object.assign({}, defaultStyle, styleOpts);

    this.win.webContents.executeJavaScript(
      `window.drawBadge = function ${this.drawBadge};`,
    );
  }

  generate(count) {
    if (!count) {
      throw new Error('Badge number invalid number or least 1');
    }

    const styleOpts = JSON.stringify(this.style);

    return this.win.webContents.executeJavaScript(
      `window.drawBadge(${count}, ${styleOpts});`,
      true,
    );
  }

  drawBadge(count, {color, background, fontSize, fontFamily, fontWeight}) {
    count = parseInt(count, 10);

    const badgeSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <circle cx="8" cy="8" r="8" fill="${background}" />
      <text x="50%" y="50%" text-anchor="middle" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" dy=".3em">${count}</text>
    </svg>`;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const DOMURL = self.URL || self.webkitURL;

    const img = new Image();
    const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svg);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');

        DOMURL.revokeObjectURL(png);

        resolve(png);
      };

      img.onerror = reject;

      img.src = url;
    });
  }
}

module.exports = BadgeGenerator;
