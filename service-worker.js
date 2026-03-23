const CACHE_NAME = "pdf-library-v3"

const urlsToCache = [
"/",
"/index.html",
"/script.js",
"/books.json",
"https://cdn.tailwindcss.com",
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
]

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))

)

})

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request)

})

)

})