import mptUserSettings from "../settings/userSettings";
import classSettings from "../settings/itaSettings";
import translations from "../settings/translations";

import { findtargets, findtarget } from "../utils";
import { unsafeHTML, unsafeScript, unsafeScriptURL } from "../../unsafe-policy";

/** @type {{ [key: string]: (() => { url: string, title: string, img?: string, desc?: string, extra?: string, target?: string })[]}} */
const links = {};

require("../links");

const skimlinks = document.createElement("script");
const src = `https://s.skimresources.com/js/${
  !!location.hostname.match(/^old/i) ? "122783X1686784" : "122783X1611548"
}.skimlinks.js`;
skimlinks.setAttribute("src", unsafeScriptURL(src));

/**
 * Registers a link
 * @param {() => { url: string, title: string, img?: string, desc?: string, extra?: string, target?: string }} factory
 */
export function registerLink(type, factory) {
  if (!links[type]) links[type] = [];
  links[type].push(factory);
}

export function printLinksContainer() {
  // do nothing if editor mode is active
  if (findtargets("editoritem").length > 0) {
    return;
  }

  // empty outputcontainer
  const div = getSidebarContainer();
  if (!div) return;
  div.innerHTML = unsafeHTML("");

  //  S&D powertool items
  const elems = findtargets("powertoolsitem");
  for (let i = elems.length - 1; i >= 1; i--) {
    elems[i].parentElement.removeChild(elems[i]);
  }

  const groups = Object.keys(links);
  groups.forEach((group, i) => {
    const groupLinks = links[group]
      .map(link => link())
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    groupLinks.forEach(link => {
      if (!link) return;

      if (link.img) {
        printImage(link);
      } else if (mptUserSettings.enableInlineMode == 1) {
        printUrlInline(link);
      } else {
        printUrl(link);
      }
    });

    mptUserSettings.enableDeviders == 1 &&
      links[group].length &&
      i != groups.length - 1 &&
      printSeperator();
  });

  /*** attach JS events after building link container  ***/
  bindLinkClicks();
}

function bindLinkClicks() {
  if (mptUserSettings.enableAffiliates == 1) {
    skimlinks.parentNode && skimlinks.parentNode.removeChild(skimlinks);
    document.body.appendChild(skimlinks);
  }
}

// Inline Stuff
function printUrlInline(link) {
  const item = `<li class="powertoolsitem">${printLink(link)}</li>`;
  const container = getSidebarContainer();
  container && container.insertAdjacentHTML("beforeend", unsafeHTML(item));
}

export function printImage(link) {
  const container = getSidebarContainer();
  const item =
    (link.url
      ? '<a href="' + link.url + '" target="_blank" class="powertoolsitem">'
      : "") +
    '<img src="' +
    link.img +
    '" style="margin-top:10px;"' +
    (!link.url ? ' class="powertoolsitem"' : "") +
    "/>" +
    (link.url ? "</a>" : "");
  if (mptUserSettings.enableIMGautoload == 1) {
    container && container.insertAdjacentHTML("beforeend", unsafeHTML(item));
  } else {
    const id = Math.random().toString();
    container &&
      container.insertAdjacentHTML(
        "beforeend",
        unsafeHTML(
          `<div id="${id}" class="powertoolsitem powertoolsimage"><span>${link.title}</span></div>`
        )
      );

    document.getElementById(id).addEventListener("click", function() {
      this.outerHTML = item;
    });
  }
}

export function getSidebarContainer() {
  return (
    document.getElementById("powertoolslinkcontainer") ||
    (mptUserSettings.enableInlineMode == 1 || classSettings.matrixVersion == 5
      ? createUrlContainerInline()
      : createUrlContainer())
  );
}

function createUrlContainerInline() {
  const target = findtarget(classSettings.resultpage.mcDiv, 1);
  if (!target) return;

  if (classSettings.matrixVersion == 5) {
    const matCard = document.createElement("mat-card");
    matCard.classList.add(
      "mat-card",
      "mat-focus-indicator",
      "mat-elevation-z8",
      "powertoolslinkinlinecontainer"
    );
    matCard.innerHTML = unsafeHTML(
      `<h2 class="${classSettings.resultpage.mcHeader}">Powertools</h2><ul id="powertoolslinkcontainer" style="padding-left: 20px;"></ul>`
    );
    target.prepend(matCard);
  } else {
    const newdiv = document.createElement("div");
    newdiv.classList.add(classSettings.resultpage.mcDiv);
    newdiv.classList.add(`powertoolslinkinlinecontainer`);
    newdiv.innerHTML = unsafeHTML(
      '<div class="' +
        classSettings.resultpage.mcHeader +
        '">Powertools</div><ul id="powertoolslinkcontainer" class="' +
        classSettings.resultpage.mcLinkList +
        '"></ul>'
    );
    target.parentElement.appendChild(newdiv);
  }
  return document.getElementById("powertoolslinkcontainer");
}

// Printing Stuff
function printUrl(link) {
  const item = `<div class="powertoolsitem" style="margin:5px 0px 10px 0px">${printLink(
    link
  )}</div>`;
  const container = getSidebarContainer();
  container && container.insertAdjacentHTML("beforeend", unsafeHTML(item));
}

function printLink(link) {
  let html = `<div><label style="font-size:${Number(
    mptUserSettings.linkFontsize
  )}%;">
    <a href="${link.url}" target=${link.target || "_blank"}>${(translations[
    mptUserSettings.language
  ] &&
    translations[mptUserSettings.language]["use"]) ||
    "Use "} ${link.title}</a>
  </label>`;
  if (link.extra) html += link.extra;
  if (link.desc)
    html += `<br/><label style="font-size:${Number(
      mptUserSettings.linkFontsize
    ) - 15}%">${link.desc}</label>`;
  html += "</div";
  return html;
}

function createUrlContainer() {
  const target = findtarget(classSettings.resultpage.milagecontainer, 1);
  if (!target) return;

  const newdiv = document.createElement("div");
  newdiv.setAttribute("id", "powertoolslinkcontainer");
  newdiv.setAttribute("style", "margin:15px 0px 0px 10px");
  return target.appendChild(newdiv);
}

function printSeperator() {
  const container = getSidebarContainer();
  container &&
    container.insertAdjacentHTML(
      "beforeend",
      unsafeHTML(
        mptUserSettings.enableInlineMode
          ? '<hr class="powertoolsitem"/>'
          : "<hr/>"
      )
    );
}
