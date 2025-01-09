/**
 * Inject userscript to DOM
 */
var s = document.createElement("script");
s.src = getExtensionURL("ita-matrix-powertools.user.js");
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

function getExtensionURL(path) {
  // Check if chrome.runtime is available (preferred modern method)
  if (chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(path);
  }
  
  // Fallback to legacy chrome.extension API
  if (chrome.extension && chrome.extension.getURL) {
      return chrome.extension.getURL(path);
  }
  
  // If neither API is available, throw an error
  throw new Error('Chrome extension API not available');
}