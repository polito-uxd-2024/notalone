if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const c=e=>s(e,t),f={module:{uri:t},exports:o,require:c};i[t]=Promise.all(n.map((e=>f[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-adFiertA.js",revision:null},{url:"assets/index-zyJTYbAO.css",revision:null},{url:"index.html",revision:"72d0c429a88c488deac911ca2211951a"},{url:"registerSW.js",revision:"d73f8b220dee1a8f3aa310186a96ae47"},{url:"pwa-192x192.png",revision:"4516b5c7141b17f4044c3f17fec77529"},{url:"pwa-512x512.png",revision:"dd2ee95b109892abcf897cc9dfb4ea2f"},{url:"pwa-maskable-192x192.png",revision:"0f668f1883c8ef484ab3432a960b5b91"},{url:"pwa-maskable-512x512.png",revision:"0403c7c7fa25d6a5d4b376d9ce0beb3e"},{url:"manifest.webmanifest",revision:"88358570ffb38c243f4486ce95d9b729"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
