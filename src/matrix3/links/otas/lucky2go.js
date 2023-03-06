import { register } from "..";
import { currentItin } from "../../../matrix5/parse/itin";
import { buildQueryString } from "./travix";

const editions = [
  { lang: "pl", country: "PL" },
  { lang: "bg", country: "BG" },
  { lang: "ro", country: "RO" },
  { lang: "cs", country: "CZ" },
  { lang: "hu", country: "HU" },
  { lang: "sk", country: "SK" },
  { lang: "pt", country: "PT" },
  { lang: "es", country: "ES" },
  { lang: "en", country: "GB" },
  { lang: "en", country: "IE" },
  { lang: "en", country: "US" },
  { lang: "it", country: "IT" },
  { lang: "de", country: "DE" },
  { lang: "fr", country: "FR" },
  { lang: "el", country: "GR" }
];

function printLucky2go() {
  var cabins = ["Economy", "Economy", "Business", "First"];
  var createUrl = edition =>
    `https://secure.lucky2go.com/flights/options/?${buildQueryString(
      currentItin.cur || "USD",
      edition.country,
      edition.lang,
      cabins
    )}`;

  // get edition
  var url = createUrl({ lang: "en", country: "US" });
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += editions
    .map(
      edition =>
        `<a href="${createUrl(edition)}" target="_blank">${
          edition.lang
        }&#8209;${edition.country}</a>`
    )
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "lucky2go",
    extra
  };
}

register("otas", printLucky2go);
