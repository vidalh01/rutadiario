if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let o={};const d=e=>s(e,t),f={module:{uri:t},exports:o,require:d};i[t]=Promise.all(n.map((e=>f[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BgUdYJSG.css",revision:null},{url:"assets/index-D5vKqFuh.js",revision:null},{url:"index.html",revision:"28861c49b4e49bbc74cafec74effb82a"},{url:"registerSW.js",revision:"4aba3949e6d3dad3392b046024121eb7"},{url:"manifest.webmanifest",revision:"9f1dcd13f0f5ed7d9c89df1ef86cf16a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/rutadiario/index.html")))}));
