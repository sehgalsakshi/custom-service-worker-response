Custom ServiceWorker implementation where the response has been manipulated.
Using this implementation, a custom offline response can be saved for a particular request or the response can be encrypted before caching and decrypted on fetching from cache.

Either clone it via git, or just [grab the zip file].

If you already run a web server locally, put the files there. Or you can run a web server from the terminal for the current directory by installing [node.js](http://nodejs.org/) and running:

```sh
npm install
npm start
```

Visit the site in Chrome (`http://localhost:8080` if you used the script above). Open the dev tools and look at the console. Once you refresh the page, it'll be under the ServiceWorker's control.

**You can reset the SW & caches at any point** by navigating to `reset/`. That will unregister the ServiceWorker & clear all the caches.

Disable your internet connection & shut down your local web server.

If you refresh the page, it still works with a custom response, even through you're offline!

Take a look at the code in `index.html` and `sw.js`, hopefully the comments make it easy to follow.

`self.skipWaiting` called within a ServiceWorker means it won't wait for tabs to stop using the old version before it takes over.

In your `install` event, before the call to `event.waitUntil` add:

```js
if (self.skipWaiting) { self.skipWaiting(); }
```

If you refresh the page now, the new version should activate immediately.

Chrome 40 shipped with ServiceWorker but without `skipWaiting`, so the `if` statement prevents errors there. If you want to see the effects of `skipWaiting`, use a newer version of Chrome, such as [Chrome Canary](https://www.google.com/chrome/browser/canary.html).

`skipWaiting` means your new worker will handle requests from pages that were loaded with the old worker. If that's a problem, or if multiple tabs running different versions of your app/site is a problem, avoid `skipWaiting`.

In the `fetch` event, before calling `event.respondWith`, add the following code:

```js
if (/\.jpg$/.test(event.request.url)) {
  event.respondWith(fetch('trollface.svg'));
  return;
}
```

Here we're intercepting URLs that end `.jpg` and responding with a network fetch for a different resource.

Refresh the page, watch the console, and once the new ServiceWorker is active, refresh again. Now you get a different image!


In the previous step, we handled all requests ending `.jpg`, but often you want finer control over which URLs you handle.

In the `fetch` event, add the following code before the code you added in the previous exercise:

```js
var pageURL = new URL('./', location);

if (event.request.url === pageURL.href) {
  event.respondWith(new Response("Hello world!"))
  return;
}
```

Refresh the page, watch the console, and once the new ServiceWorker is active, refresh again. Different response! This is how you create responses manually.
