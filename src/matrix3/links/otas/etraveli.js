import { monthnumberToName, toTitleCase } from "../../utils";
import { register } from "..";
import {
  currentItin,
  isOneway,
  isRoundtrip
} from "../../../matrix5/parse/itin";

const editions = [
  { name: "Gotogate", host: "www.gotogate.com" },
  { name: "Seat24.se", host: "www.seat24.se" },
  { name: "Seat24.de", host: "www.seat24.de" },
  { name: "Seat24.dk", host: "www.seat24.dk" },
  { name: "Seat24.fi", host: "www.seat24.fi" },
  { name: "Seat24.no", host: "www.seat24.no" },
  { name: "Flygvaruhuset.se", host: "www.flygvaruhuset.se" },
  { name: "Travelpartner.se", host: "www.travelpartner.se" },
  { name: "Travelpartner.fi", host: "www.travelpartner.fi" },
  { name: "Travelpartner.no", host: "www.travelpartner.no" },
  { name: "Budjet.se", host: "www.budjet.se" },
  { name: "Budjet.fi", host: "www.budjet.fi" },
  { name: "Budjet.no", host: "www.budjet.no" },
  { name: "Budjet.dk", host: "www.budjet.dk" },
  { name: "Goleif.dk", host: "www.goleif.dk" },
  { name: "Travelfinder.se", host: "www.travelfinder.se" },
  { name: "Gotogate.no", host: "www.gotogate.no" },
  { name: "Gotogate.at", host: "www.gotogate.at" },
  { name: "Gotogate.be", host: "be.gotogate.com" },
  { name: "Gotogate.bg", host: "bg.gotogate.com" },
  { name: "Gotogate.ch", host: "www.gotogate.ch" },
  { name: "Gotogate.cz", host: "cz.gotogate.com" },
  { name: "Gotogate.es", host: "www.gotogate.es" },
  { name: "Gotogate.fr", host: "www.gotogate.fr" },
  { name: "Gotogate.gr", host: "www.gotogate.gr" },
  { name: "Gotogate.hu", host: "hu.gotogate.com" },
  { name: "Gotogate.ie", host: "ie.gotogate.com" },
  { name: "Gotogate.it", host: "www.gotogate.it" },
  { name: "Gotogate.pl", host: "www.gotogate.pl" },
  { name: "Gotogate.pt", host: "www.gotogate.pt" },
  { name: "Gotogate.ro", host: "ro.gotogate.com" },
  { name: "Gotogate.sk", host: "www.gotogate.sk" },
  { name: "Gotogate.tr", host: "tr.gotogate.com" },
  { name: "Gotogate.com.ua", host: "www.gotogate.com.ua" },
  { name: "Gotogate.co.uk", host: "www.gotogate.co.uk" },
  { name: "Flybillet.dk", host: "www.flybillet.dk" },
  { name: "Travelstart.se", host: "www.travelstart.se" },
  { name: "Travelstart.de", host: "www.travelstart.de" },
  { name: "Travelstart.dk", host: "www.travelstart.dk" },
  { name: "Travelstart.fi", host: "www.travelstart.fi" },
  { name: "Travelstart.no", host: "www.travelstart.no" },
  { name: "Supersaver.se", host: "www.supersavertravel.se" },
  { name: "Supersaver.dk", host: "www.supersaver.dk" },
  { name: "Supersaver.fi", host: "www.supersaver.fi" },
  { name: "Supersaver.nl", host: "www.supersaver.nl" },
  { name: "Supersaver.no", host: "www.supersaver.no" },
  { name: "Supersaver.ru", host: "www.supersaver.ru" }
];

const convertDate = (date, withYear, titleMonth) =>
  ("0" + date.day).slice(-2) +
  (titleMonth
    ? toTitleCase(monthnumberToName(date.month))
    : monthnumberToName(date.month)) +
  (withYear ? date.year.toString().slice(-2) : "");

export const createUrl = host => {
  let ggUrl = "https://" + host + "/air/";
  if (isOneway()) {
    ggUrl += `${currentItin.itin[0].orig}${
      currentItin.itin[0].dest
    }${convertDate(currentItin.itin[0].dep, false)}`;
  } else if (isRoundtrip()) {
    ggUrl += `${currentItin.itin[0].orig}${
      currentItin.itin[0].dest
    }${convertDate(currentItin.itin[0].dep, false)}${convertDate(
      currentItin.itin[1].dep,
      false
    )}`;
  } else {
    ggUrl += currentItin.itin
      .map(itin => `${itin.orig}${itin.dest}${convertDate(itin.dep, false)}`)
      .join(",");
  }
  ggUrl += "/" + currentItin.numPax;
  ggUrl +=
    "?selectionKey=" +
    currentItin.itin
      .map(itin =>
        itin.seg
          .map(
            seg =>
              seg.carrier +
              seg.fnr +
              "-" +
              convertDate(seg.dep, true, true) +
              "-" +
              seg.bookingclass
          )
          .join("_")
      )
      .join("_");

  return ggUrl;
};

function printEtraveli() {
  const ggUrl = createUrl(editions[0].host);
  let extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += editions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.host) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url: ggUrl,
    title: editions[0].name,
    extra
  };
}

register("otas", printEtraveli);
