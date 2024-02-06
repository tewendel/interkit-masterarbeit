import { InterkitClient } from "./";

let trackingEnabled = false;

const trackUserUrlPath = () => {
  if (!trackingEnabled) return;
  InterkitClient.call("user.trackActivity", { url: window.location.href });
};

if (typeof window !== "undefined") {
  window.addEventListener("popstate", (event) => {
    //console.log("popstate", event);
    trackUserUrlPath();
  });
}

function trackRepeatedly() {
  window.setTimeout(() => {
    trackUserUrlPath();
    trackRepeatedly();
  }, 10000);
}

function userEnableActivityTracking() {
  if (!trackingEnabled) {
    trackingEnabled = true;
    trackRepeatedly();
  }
}

export { userEnableActivityTracking, trackUserUrlPath };
