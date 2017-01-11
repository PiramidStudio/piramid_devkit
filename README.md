# Piramid Studio Devkit

A devkit based on Gulp 4, Emitty and ispired by  [brnmonteiro](https://github.com/brnmonteiro)/[**codekit-gulp**](https://github.com/brnmonteiro/codekit-gulp). This tool is usefull for preprocess Jade/PUG, Stylus and JS. Browser sync, Bower utilities and other awesome stuff are included. Check gulpfile.js and package.json in order to deepen. We love contributions. **No license or assignment is required. If you want you can give us some coffee to makes us better developer and to improve our English!**

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=T24D53W3WYWHJ)

## Configuration

```
├── app/
│ ├── assets/
│ | |── js/
| | |── img/
| | |── styl/
| ├── views/
```

## Install

Clone our repo in your app/ folder, using:

```
git clone https://github.com/PiramidStudio/piramid_devkit.git
cd piramid_devkit
npm install
bower install
gulp build
```

or

```
git clone git@github.com:PiramidStudio/piramid_devkit.git
cd piramid_devkit
npm install
bower install
gulp build
```

## Basic usage

Inizialize dev environment:

```
gulp
```

Run following tasks:

1. **serve**: initialize Browser Sync webserver.
2. **setWatch**: at the moment it is quite unnecessary.
3. **jsCache**: cache JS file for performance reasons.
4. **pug-watcher**: _.pug_ and _.jade_ watcher. It'll launch **pug task **if changes in the specified directory are detected.
5. **styles-watcher**: .styl watcher. It'll launch **styles task **if changes in the specified directory are detected.
6. **js-watcher**: .js watcher. It'll launch **js task **if changes in the specified directory are detected.
7. **reload-watcher**: .html, .php,. jpg, .png, .gif, .json, .js. It'll realod Browser Sync instances.

Build all:

```
gulp build
```

Run following tasks:

1. **js**: export all .**js **files contained in app/assets/js in app/production/js
2. **pug**: export all .**pug **or .**jade **files contained in app/views in app/production
3. **styles**: export all .**styl **files contained in app/assets/styl in app/production/css
4. **movefiles**: move all files contained in app/assets/fonts, app/assets/img, app/assets/data in app/production/fonts, app/production/img and app/production/data. Data folder is usefull for stubbing server response.
5. **bower-components**: it'll concat all bower dependencies in one single file located in app/production/js: vendors.js.

## Configuration

You can change the package.json file to fit better to your environment.
More specs in progress. Stay tuned!
