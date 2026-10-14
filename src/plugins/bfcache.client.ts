// src/plugins/bfcache.client.ts
export default defineNuxtPlugin(() => {
  if (typeof window !== "undefined") {
    // Prevent libraries or third-party scripts from registering 'unload' event listener,
    // which prevents the page from being stored in Chromium bfcache.
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      if (type === "unload") {
        return originalAddEventListener.call(
          this,
          "pagehide",
          listener,
          options
        );
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
});
