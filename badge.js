const defaultStyle = {
  color: 'white',
  background: 'red',
  radius: 10,
  fontSize: '12px',
  fontFamily: 'Arial',
  fontWeight: 'bold',
};

class BadgeGenerator {
  constructor(win, styleOpts = {}) {
    this.win = win;
    this.style = {...defaultStyle, ...styleOpts};

    this.win.webContents.executeJavaScript(
      `window.drawBadge = function ${this.drawBadge};`,
    );
  }

  generate(count, opts) {
    const styleOpts = JSON.stringify({...this.style, ...opts});

    return this.win.webContents.executeJavaScript(
      `window.drawBadge(${count}, ${styleOpts});`,
      true,
    );
  }

  drawBadge(
    count,
    {color, background, radius, fontSize, fontFamily, fontWeight, max},
  ) {
    let countText = count;

    if (max && count > max) {
      countText = max + '+';
      fontSize = '11px';
    }

    const badgeSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${radius *
      2}" height="${radius * 2}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${background}" />
      <text x="50%" y="50%" text-anchor="middle" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" dy=".3em">${countText}</text>
    </svg>`;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const DOMURL = self.URL || self.webkitURL;

    const img = new Image();
    const svg = new Blob([badgeSvg], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svg);

    canvas.width = 16;
    canvas.height = 16;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 16, 16);
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
