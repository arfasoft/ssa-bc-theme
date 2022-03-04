# Athletic Theme
Originally developed on the Blueprint theme engine for BigCommerce, Athletic was the most popular theme. Loved for its versatility and usability, it is the foundation that's used by some of the most recognized BigCommerce stores. If your store is using the original Athletic theme on Blueprint, this new version has been built to make the upgrade to Stencil as easy as possible. If you're a brand new store, Athletic provides you a proven, customizable theme that's optimized for conversion on desktop and mobile.

Up to date with Cornerstone v2.2.0

## Project Setup and Installation
1. Get credentials for the following:
- BigCommerce API - needed for stencil init file (.stencil)
- SecondSkinAudio Slack channel
- WebDav account for WebDav path: https://www.secondskinaudio.com/dav. Used for image posting.
- Download Cyberduck for WebDav access, if you need it.


2. Need to use Node version noted in `.nvmrc` file within this project

If you want to set up to use 10.16.3 by default:

https://github.com/creationix/nvm#automatically-call-nvm-use

add the bash code to ~/.profile. Restart terminal to update.

or just manually:

```bash
nvm use v10.16.3
```

2. Install stencil - build system for theme files. It allows you to spin up site locally and does live reloading

https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil

```bash
npm install -g @bigcommerce/stencil-cli
```

3. Install packages
```bash
npm install
```

4. Initialize Stencil
```bash
stencil init
```
5. Start up local environment
```bash
stencil start
```

6. If you encounter 500 server errors:

## Resolve 500 errors related to CloudFront

1. we need to bypass DNS for secondskinaudio.com. Use the permanent store DNS instead (store-5vspyxz90j.mybigcommerce.com) to get the ip address. At the time of this writing, it is 35.241.32.247.
2. at command line, type sudo nano /etc/hosts. 
3. Go to bottom of the file and add:

```bash
# Bypass cloudfront caching
35.241.32.247 secondskinaudio.com
35.241.32.247 www.secondskinaudio.com
```

Save & quit. (Ctrl+x, Ctrl+y)

4. Depending on your version of OSX, flush the cache:
```bash
sudo killall -HUP mDNSResponder
```
or 
```bash
dscacheutil -flushcache
```

## Workflow
- git pull
- git checkout -b workingBranch
- login to bigCommerce: https://www.secondskinaudio.com/manage/storefront-manager/my-themes
- download current theme
- copy the templates directory from that archive and use it to overwrite the one in the project
- make changes
- commit
- on master branch, go through the manual replacement of the theme folder again to get most recent theme updates that may have been made while working on workingBranch
- update master and merge master into working branch
- merge workingBranch into master and test
- deploy

## Deployment Process
```bash
stencil push
```
It might ask you which theme you want to replace since there are so many already available, just choose any of them. You may need to delete some if you've reached the max.
- Select yes when asked if you want to apply the theme˜

## Documents
- https://developer.bigcommerce.com/stencil-docs/reference-docs/theme-objects
- https://handlebarsjs.com/

## Notes
Hompage and four hub pages are custom

GitHub is currently only acting as source control. Push to master to make sure your latest is accessible to others on the project, but immediately after, run stencil push

### Sales
Checkout sales branch
Merge in master to update
Change banner image file path in templates/pages/product.html
Change image paths in templates/components/hero/sale.html around lines 2 and 17.
Confirm snippet goes to sales template in templates/pages/home.html {{> components/hero/sale }}

Three images are required:
hero should be 635 x 424 - desktop, 657 × 596 - mobile
banner should be 910 x 128 for product pages.
