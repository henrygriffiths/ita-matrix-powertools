import { register } from "..";
import { currentItin } from "../../../matrix5/parse/itin";
import { buildQueryString } from "./travix";

const editions = [
  { name: "Brazil", value: "www2.secure.edestinos.com.br" },
  { name: "Peru", value: "www2.secure.edestinos.com.pe" },
  { name: "Colombia", value: "www2.secure.edestinos.com.co" },
  { name: "Dominican Republic", value: "www2.secure.edestinos.com.do" },
  { name: "El Salvador", value: "www2.secure.edestinos.com.sv" },
  { name: "Panama", value: "www2.secure.edestinos.com.pa" },
  { name: "Nicaragua", value: "www2.secure.edestinos.com.ni" },
  { name: "Guatemala", value: "www2.secure.edestinos.com.gt" },
  { name: "Honduras", value: "www2.secure.edestinos.com.hn" },
  { name: "Paraguay", value: "www2.secure.edestinos.com.py" },
  { name: "Puerto Rico", value: "www2.secure.edestinos.com.pr" },
  { name: "Costa Rica", value: "www2.secure.edestinos.cr" },
  { name: "Bolivia", value: "www2.secure.edestinos.com.bo" },
  { name: "Argentina", value: "www2.secure.edestinos.com.ar" },
  { name: "Mexico", value: "www2.secure.edestinos.com.mx" },
  { name: "Chile", value: "www2.secure.edestinos.cl" },
  { name: "Poland", value: "www2.secure.esky.pl" },
  { name: "Romania", value: "www2.secure.esky.ro" },
  { name: "Bulgaria", value: "www2.secure.esky.bg" },
  { name: "Czech Republic", value: "www2.secure.esky.cz" },
  { name: "Slovakia", value: "www2.secure.esky.sk" },
  { name: "Hungary", value: "www2.secure.esky.hu" },
  { name: "Moldova", value: "www2.secure.esky.md" },
  { name: "Spain", value: "www2.secure.esky.es" },
  { name: "Serbia", value: "www2.secure.esky.rs" },
  { name: "Croatia", value: "www2.secure.esky.hr" },
  { name: "Bosnia and Herzegovina", value: "www2.secure.esky.ba" },
  { name: "Ireland", value: "www2.secure.esky.ie" },
  { name: "United Kingdom", value: "www2.secure.esky.co.uk" },
  { name: "Turkey", value: "www2.secure.esky.com.tr" },
  { name: "France", value: "www2.secure.esky.fr" },
  { name: "Portugal", value: "www2.secure.esky.pt" },
  { name: "Greece", value: "www2.secure.esky.gr" },
  { name: "Germany", value: "www2.secure.eskytravel.de" },
  { name: "Italy", value: "www2.secure.eskytravel.it" },
  { name: "Austria", value: "www2.secure.esky.at" },
  { name: "Switzerland", value: "www2.secure.eskytravel.ch" },
  { name: "Netherlands", value: "www2.secure.esky.nl" },
  { name: "Belgium", value: "www2.secure.eskytravel.be" },
  { name: "Finland", value: "www2.secure.esky.fi" },
  { name: "Denmark", value: "www2.secure.eskytravel.dk" },
  { name: "Sweden", value: "www2.secure.esky.se" },
  { name: "Norway", value: "www2.secure.eskytravel.no" },
  { name: "Belarus", value: "www2.secure.esky.by" },
  { name: "South Africa", value: "www2.secure.eskytravel.co.za" },
  { name: "Russia", value: "www2.secure.eskytravel.ru" },
  { name: "New Zealand", value: "www2.secure.eskytravel.co.nz" },
  { name: "eSky.eu", value: "www2.secure.esky.eu" },
  { name: "eSky.com", value: "www2.secure.esky.com" },
  { name: "eDestinos.com", value: "www2.secure.edestinos.com" }
];

function print() {
  var createUrl = host =>
    `https://${host}/api?${buildQueryString(currentItin.cur || "USD")}`;

  var url = createUrl("www2.secure.edestinos.com.br");
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += editions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "eDestinos",
    extra
  };
}

register("otas", print);
