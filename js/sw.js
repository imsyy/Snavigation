const CURCACHE = 'CURCACHE_test_1'
const RUNTIME = 'runtime';
const CURCACHE_URLS = [
    './',
    'index.html'
]
self.addEventListener('install', e => {
    e.waitUntil(
        //存储缓存路径对应的资源
        caches.open(CURCACHE).then(cache => {
            cache.addAll(CURCACHE_URLS)
        }).then(
            self.skipWaiting()
        )
    )
})

//代理请求，使用缓存，请求发送之前
self.addEventListener('fetch', e => {
    e.respondWith(
        //缓存是否匹配 
        caches.match(e.request).then(function (response) {
            if (response != null) {
                //命中缓存返回缓存，结束请求
                return response
            }
            //未命中缓存，正常请求
            return fetch(e.request.url)
        })
    )
});

//假设上个版本的key为precache_test_2 反正不等于CURCACHE
self.addEventListener('activate', e => {
    e.waitUntil(
        //遍历当前缓存keys
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    //是否等于当前key,保留自己
                    if (cacheName !== CURCACHE) {
                        return caches.delete(cacheName);
                    }
                })
            )
        }).then(() => self.clients.claim())
    )
})