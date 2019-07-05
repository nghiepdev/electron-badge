# electron-badge

[![NPM version](https://img.shields.io/npm/v/electron-badge.svg)](https://www.npmjs.com/package/electron-badge)
[![NPM monthly download](https://img.shields.io/npm/dy/electron-badge.svg)](https://www.npmjs.com/package/electron-badge)

> Electron badge works well for Windows

## Installation

```sh
$ yarn add electron-badge
```

## Usage

```js
// main.js

const Badge = require('electron-badge');

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  const badgeOptions = {};
  new Badge(win, badgeOptions);
}
```

```js
// index.html
ipcRenderer.send('update-badge', 5, {background: 'crimson'});

// To remove badge
ipcRenderer.send('update-badge', 0); // or null
```

## API

**Badge options(Windows only)**

| Option Name   | Default Value |
| ------------- | ------------- |
| `color`       | white         |
| `backaground` | red           |
| `fontSize`    | 12px          |
| `fontFamily`  | Arial         |
| `fontWeight`  | bold          |
| `max`         | 99            |

## License

MIT © [Nghiep](https://nghiepit.dev)
