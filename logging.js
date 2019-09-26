// First time playing with SW? This script is just for logging,
// you can pretty much ignore it until you want to dive deeper.

if (!navigator.serviceWorker.controller) {
  console.log("This page is online and not controlled by a Service Worker");
}
else {
  console.log("This page is offline and controlled by a Service Worker");
}

navigator.serviceWorker.getRegistration().then(function(reg) {
  function showWaitingMessage() {
    console.log("A new Service Worker is waiting to become active but it can't become active now as pages are still open that are controlled by the older version. Either close those tabs or shift+reload them (which loads them without the ServiceWorker). That will allow the new version to become active, so it'll be used for the next page load.");
  }

  reg.addEventListener('updatefound', function() {
    console.log("Found a new Service Worker!");
    var installing = reg.installing;
    reg.installing.addEventListener('statechange', function() {
      if (installing.state == 'installed') {
        console.log("New Service Worker installed.");
        // give it a second to see if it activates immediately
        setTimeout(function() {
          if (installing.state == 'activated') {
            console.log("New Service Worker activated! Reload to load this page with the new Service Worker.");
          }
          else {
            showWaitingMessage();
          }
        }, 1000);
      }
      else if (installing.state == 'redundant') {
        console.log("The new worker failed to install - likely an error during install");
      }
    });
  });

  if (reg.waiting) {
    showWaitingMessage();
  }
});