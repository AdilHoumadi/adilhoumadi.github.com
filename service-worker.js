/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "2021/03/20/hello-world/index.html",
    "revision": "5c650709e7a78d33e4796533fa0549ce"
  },
  {
    "url": "2021/03/21/consume-and-produce-data-to-apache-kafka-using-cli/index.html",
    "revision": "bd286e67c5f3dd4108d4eed6c5e62d6c"
  },
  {
    "url": "404.html",
    "revision": "7da22ef17a6b2326a57fa4d1993040d5"
  },
  {
    "url": "assets/css/0.styles.f22b8e4e.css",
    "revision": "9301ccaa71d380007950f41bc579b226"
  },
  {
    "url": "assets/fonts/EJRVQgYoZZY2vCFuvAFbzr-_dSb_nco.9738e026.woff2",
    "revision": "9738e026c7397b4e3b543ae7f1cf4b6c"
  },
  {
    "url": "assets/fonts/EJRVQgYoZZY2vCFuvAFWzr-_dSb_.b450bfca.woff2",
    "revision": "b450bfca16a8beb05580180de7b678f0"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.304be0d9.js",
    "revision": "d8602019178f66c2cb48c3a5484acfaf"
  },
  {
    "url": "assets/js/11.8dc4b434.js",
    "revision": "29912e8e58b67e48342cf2ea6b5d2c80"
  },
  {
    "url": "assets/js/12.e6ea20d1.js",
    "revision": "5ed39694a3175e3ccef1aa20b7604c0f"
  },
  {
    "url": "assets/js/13.8f88d637.js",
    "revision": "cc3c7523a91dafa5db50c9848d7d3848"
  },
  {
    "url": "assets/js/14.d97134a7.js",
    "revision": "8dffb53de1da75499197935fb8d9f746"
  },
  {
    "url": "assets/js/15.1e17018b.js",
    "revision": "3c4c0d868073dc8e832b7e0eb64a6826"
  },
  {
    "url": "assets/js/3.159a06c9.js",
    "revision": "cb00b4ceb52a84ed59e10e5f83faff75"
  },
  {
    "url": "assets/js/4.d82274a4.js",
    "revision": "08c7492ede15f82c1dfc7a5752b27f02"
  },
  {
    "url": "assets/js/5.71c83ea5.js",
    "revision": "874f438c0848b7f831ace271ef0f6433"
  },
  {
    "url": "assets/js/6.de7d825d.js",
    "revision": "f84d54b7648f549fac0f619d80707e73"
  },
  {
    "url": "assets/js/7.64725666.js",
    "revision": "f669d7f5a0ec98d39ab906182f05c749"
  },
  {
    "url": "assets/js/8.11a5ce89.js",
    "revision": "415ea5dd5e5a260d044f7e3a83242fbf"
  },
  {
    "url": "assets/js/9.d38c7640.js",
    "revision": "e35a9fd8c66b97357a9e3837afee6c44"
  },
  {
    "url": "assets/js/app.7943b9e9.js",
    "revision": "cf405c830baa61884862ba7d66b9595e"
  },
  {
    "url": "assets/js/vuejs-paginate.636421e2.js",
    "revision": "64d60e10bbe438928174fa4a0a42e51f"
  },
  {
    "url": "index.html",
    "revision": "5b6cb02e9518cb62e1a4c03972dba32c"
  },
  {
    "url": "tag/blog/index.html",
    "revision": "b83fa0f923f168d943b26b9396ef8453"
  },
  {
    "url": "tag/consume/index.html",
    "revision": "0aac9ddf3b3da3dbfbd1ae01a86ae8e5"
  },
  {
    "url": "tag/hello-world/index.html",
    "revision": "fe8605c7119a78451ed62598661106b9"
  },
  {
    "url": "tag/index.html",
    "revision": "e1b84f982dd4b24e22aa430d1c2c74fa"
  },
  {
    "url": "tag/kafka-cli/index.html",
    "revision": "cebfa7992e143bfd4f65b1f732aba72a"
  },
  {
    "url": "tag/kafka/index.html",
    "revision": "5b51bc56c7bf0d31fcdefe2635ab5c9a"
  },
  {
    "url": "tag/produce/index.html",
    "revision": "2243bf7eb46edc85fcef052af21d75c9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
