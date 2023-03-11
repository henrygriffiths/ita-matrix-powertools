import { printLinksContainer } from "../matrix3/print/links";
import { createUsersettings } from "../matrix3/print/settings";
import classSettings from "../matrix3/settings/itaSettings";
import { unsafeHTML } from "../unsafe-policy";
import { readItinerary } from "./parse/itin";

(async () => {
  const appRoot = document.querySelector("app-root");
  if (!appRoot) return;
  createUsersettings(appRoot);
  injectCss();

  const isUserscript = !(
    typeof GM === "undefined" || typeof GM.info === "undefined"
  );

  if (window.top === window.self) {
    if (!isUserscript || document.readyState == "complete") {
      startScript();
    } else {
      window.addEventListener("load", () => startScript(), false);
    }
  }
})();

let oldHref;

function startScript() {
  pageChanged();

  var bodyList = document.querySelector("body");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        pageChanged();
      }
    });
  });

  var config = {
    childList: true,
    subtree: true
  };

  observer.observe(bodyList, config);
}

function pageChanged() {
  setTimeout(async () => {
    const steps = document.querySelectorAll(".mat-step-header");
    if (
      steps.length > 0 &&
      steps[steps.length - 1].attributes["aria-selected"].value === "true"
    ) {
      // if we are on the last step (Itinerary)
      await readItinerary();
      printLinksContainer();
    }
  }, 200);
}

function injectCss() {
  let css = "",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  css +=
    ".pt-hover-menu, .pt-hover-menu-flex { position:absolute; padding: 8px; z-index: 1; background-color: #FFF; border: 1px solid #808080; display:none; }";
  css += ".pt-hover-container:hover .pt-hover-menu { display:inline; }";
  css += ".pt-hover-container:hover .pt-hover-menu-flex { display:flex; }";
  css += ".pt-textlink a { text-decoration: none; color: black; }";
  css += `.${classSettings.resultpage.mcDiv}.powertoolslinkinlinecontainer { background-color: #f2f2f2; }`;
  css +=
    ".pt-history-item:hover .pt-history-action { visibility: visible !important; }";
  style.appendChild(document.createTextNode(unsafeHTML(css)));

  head.appendChild(style);
}
