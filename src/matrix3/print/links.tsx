import React from "dom-chef";
import mptUserSettings from "../settings/userSettings";
import classSettings from "../settings/itaSettings";
import translations from "../settings/translations";

import { findtargets, findtarget } from "../utils";
import { unsafeHTML } from "../../unsafe-policy";

export type Link = {
  url: string;
  title: string;
  img?: string;
  desc?: string;
  extra?: string;
  target?: string;
};
const links: { [key: string]: (() => Link)[] } = {};

require("../links");

/**
 * Registers a link
 */
export function registerLink(type: string, factory: (typeof links)[0][0]) {
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
      .map((link) => link())
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    groupLinks.forEach((link) => {
      if (!link) return;

      if (link.img) {
        printImage(link);
      } else if (mptUserSettings.enableInlineMode !== 0) {
        printUrlInline(link);
      } else {
        printUrl(link);
      }
    });

    mptUserSettings.enableDeviders !== 0 &&
      links[group].length &&
      i != groups.length - 1 &&
      printSeperator();
  });
}

// Inline Stuff
function printUrlInline(link: Link) {
  const item = <li class="powertoolsitem">{printLink(link)}</li>;
  const container = getSidebarContainer();
  container && container.appendChild(item);
}

export function printImage(link: Link) {
  const container = getSidebarContainer();

  let item = (
    <img
      src={link.img}
      style={{ marginTop: "10px" }}
      class={!link.url ? "powertoolsitem" : ""}
    />
  );
  if (link.url) {
    item = (
      <a href={link.url} target="_blank" class="powertoolsitem">
        {item}
      </a>
    );
  }

  if (mptUserSettings.enableIMGautoload == 1) {
    container && container.appendChild(item);
  } else {
    const id = Math.random().toString();
    container &&
      container.appendChild(
        <div
          id={id}
          class="powertoolsitem powertoolsimage"
          onClick={() => {
            this.outerHTML = item;
          }}
        >
          <span>{link.title}</span>
        </div>,
      );
  }
}

export function getSidebarContainer() {
  return (
    document.getElementById("powertoolslinkcontainer") ||
    (mptUserSettings.enableInlineMode !== 0 || classSettings.matrixVersion == 5
      ? createUrlContainerInline()
      : createUrlContainer())
  );
}

function createUrlContainerInline() {
  const target = findtarget(classSettings.resultpage.mcDiv, 1);
  if (!target) return;

  if (classSettings.matrixVersion == 5) {
    const matCard = (
      <mat-card class="mat-card mat-focus-indicator mat-elevation-z8 powertoolslinkinlinecontainer">
        <h2 class={classSettings.resultpage.mcHeader}>Powertools</h2>
        <ul id="powertoolslinkcontainer" style={{ paddingLeft: "20px" }}></ul>
      </mat-card>
    );
    target.prepend(matCard);
  } else {
    const newdiv = (
      <div
        class={`${classSettings.resultpage.mcDiv} powertoolslinkinlinecontainer`}
      >
        <div class={classSettings.resultpage.mcHeader}>Powertools</div>
        <ul
          id="powertoolslinkcontainer"
          class={classSettings.resultpage.mcLinkList}
        ></ul>
      </div>
    );
    target.parentElement.appendChild(newdiv);
  }
  return document.getElementById("powertoolslinkcontainer");
}

// Printing Stuff
function printUrl(link: Link) {
  const item = (
    <div class="powertoolsitem" style={{ margin: "5px 0px 10px 0px" }}>
      {printLink(link)}
    </div>
  );
  const container = getSidebarContainer();
  container && container.appendChild(item);
}

function printLink(link: Link) {
  const extra = document.createElement("div");
  link.extra && extra.insertAdjacentHTML("beforeend", unsafeHTML(link.extra));
  return (
    <div>
      <label style={{ fontSize: `${Number(mptUserSettings.linkFontsize)}%` }}>
        <a
          href={link.url}
          target={link.target || "_blank"}
          onClick={(e) => {
            if (mptUserSettings.enableAffiliates !== 0) {
              e.preventDefault();
              window.open(
                `https://go.skimresources.com/?id=${
                  !!location.hostname.match(/^old/i)
                    ? "122783X1686784"
                    : "122783X1611548"
                }&url=${encodeURIComponent(
                  e.target.href,
                )}&sref=${encodeURIComponent(window.location.href)}`,
                e.target.target,
              );
              return false;
            }
            return true;
          }}
        >
          {(translations[mptUserSettings.language] &&
            translations[mptUserSettings.language]["use"]) ||
            "Use "}{" "}
          {link.title}
        </a>
      </label>
      {extra?.childNodes && Array.from(extra.childNodes)}
      {link.desc && (
        <>
          <br />
          <label
            style={{
              fontSize: `${Number(mptUserSettings.linkFontsize) - 15}%`,
            }}
          >
            {link.desc}
          </label>
        </>
      )}
    </div>
  );
}

function createUrlContainer(): HTMLElement {
  const target = findtarget(classSettings.resultpage.milagecontainer, 1);
  if (!target) return;

  const newdiv = (
    <div
      id="powertoolslinkcontainer"
      style={{ margin: "15px 0px 0px 10px" }}
    ></div>
  );
  return target.appendChild(newdiv);
}

function printSeperator() {
  const container = getSidebarContainer();
  container &&
    container.appendChild(
      mptUserSettings.enableInlineMode ? <hr class="powertoolsitem" /> : <hr />,
    );
}
