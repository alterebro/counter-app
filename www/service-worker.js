"use strict";var precacheConfig=[["./add.5002fe1d.svg","0e3e08bcb441c2cb39bdfff7f56f06a2"],["./arrow_back.f2acb159.svg","a6a829fc284122eed861e7aee4a6eff1"],["./close.8482b910.svg","b840e171a500c69863f00f6b4056b486"],["./counter-app-icon.png","036c7bf84e97c09fbff97713fa6e0111"],["./delete.18484c3c.svg","56397e007532c05f39537f2a5b538cf1"],["./edit.2b0f092f.svg","539b3c382ff24fe86b17f31735fb8e74"],["./icon-128x128.41a10924.png","a347d6a8450735777b261fbc2736d18d"],["./icon-144x144.02b73ccd.png","dca22b6b895b67f7ee0050bb944927a3"],["./icon-152x152.97db651f.png","1f9f6ddbdf25977053ab2cd9c76e8c37"],["./icon-192x192.f9d38e2d.png","1366cfe21791a92fe3f9d3486f08e3f8"],["./icon-384x384.c416fc4d.png","998fd99470d7b9ad5b8ec1fa2548f1af"],["./icon-512x512.4d05f08e.png","036c7bf84e97c09fbff97713fa6e0111"],["./icon-72x72.64c89d62.png","088d10a6681a2807790b6f5a146637a5"],["./icon-96x96.9970708b.png","23555db242eef8d09d827259473fd37b"],["./index.html","55da7d83b63b96f2c102ea169e07b356"],["./main.4810b608.css","ddd5604f80a6300dce180b5ca7a1d8fa"],["./main.5d79fa47.js","136330855bd38b24d81bf48136efd9d7"],["./menu.9f39e900.svg","55f6849429de279d473c459c7ead3249"],["./remove.bb758add.svg","d788b81e388932f8ba044a4f9364b90e"],["./save.b272cdec.svg","a85d4bf5700e9e31e6f90ea905805306"],["./splash.png","111b07a83a3438743116a861e6be2899"]],cacheName="sw-precache-v3-counter-app-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,n,t,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),a.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],r=new URL(n,self.location),a=createCacheKey(r,hashParamName,t,/\.\w{8}\./);return[r.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var r=new Request(t,{credentials:"same-origin"});return fetch(r).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),n=urlsToCacheKeys.has(t));!n&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("./index.html",self.location).toString(),n=urlsToCacheKeys.has(t)),n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});