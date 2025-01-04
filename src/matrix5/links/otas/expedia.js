import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import { printNotification } from "../../utils";
import { validatePax, register } from "..";
import { currentItin } from "../../../matrix5/parse/itin";

const expedia = [
  { name: "expedia.com", host: "www.expedia.com" },
  { name: "euro.expedia.net", host: "euro.expedia.net" },
  { name: "expedia.at", host: "www.expedia.at" },
  { name: "expedia.be", host: "www.expedia.be" },
  { name: "expedia.ca", host: "www.expedia.ca" },
  { name: "expedia.ch", host: "www.expedia.ch" },
  { name: "expedia.co.id", host: "www.expedia.co.id" },
  { name: "expedia.co.in", host: "www.expedia.co.in" },
  { name: "expedia.co.jp", host: "www.expedia.co.jp" },
  { name: "expedia.co.kr", host: "www.expedia.co.kr" },
  { name: "expedia.co.nz", host: "www.expedia.co.nz" },
  { name: "expedia.co.th", host: "www.expedia.co.th" },
  { name: "expedia.co.uk", host: "www.expedia.co.uk" },
  { name: "expedia.com.ar", host: "www.expedia.com.ar" },
  { name: "expedia.com.au", host: "www.expedia.com.au" },
  { name: "expedia.com.br", host: "www.expedia.com.br" },
  { name: "expedia.com.hk", host: "www.expedia.com.hk" },
  { name: "expedia.com.my", host: "www.expedia.com.my" },
  { name: "expedia.com.ph", host: "www.expedia.com.ph" },
  { name: "expedia.com.sg", host: "www.expedia.com.sg" },
  { name: "expedia.com.tw", host: "www.expedia.com.tw" },
  { name: "expedia.com.vn", host: "www.expedia.com.vn" },
  { name: "expedia.de", host: "www.expedia.de" },
  { name: "expedia.dk", host: "www.expedia.dk" },
  { name: "expedia.es", host: "www.expedia.es" },
  { name: "expedia.fi", host: "www.expedia.fi" },
  { name: "expedia.fr", host: "www.expedia.fr" },
  { name: "expedia.ie", host: "www.expedia.ie" },
  { name: "expedia.it", host: "www.expedia.it" },
  { name: "expedia.mx", host: "www.expedia.mx" },
  { name: "expedia.nl", host: "www.expedia.nl" },
  { name: "expedia.no", host: "www.expedia.no" },
  { name: "expedia.se", host: "www.expedia.se" },
];

const cheaptickets = [
  { name: "cheaptickets.com", host: "www.cheaptickets.com" },
];

const ebookers = [
  { name: "ebookers.com", host: "www.ebookers.com" },
  { name: "ebookers.ch", host: "www.ebookers.ch" },
  { name: "ebookers.de", host: "www.ebookers.de" },
  { name: "ebookers.fi", host: "www.ebookers.fi" },
  { name: "ebookers.fr", host: "www.ebookers.fr" },
  { name: "ebookers.ie", host: "www.ebookers.ie" },
];

const hotwire = [{ name: "hotwire.com", host: "vacation.hotwire.com" }];

const mrjet = [{ name: "mrjet.se", host: "www.mrjet.se" }];

const orbitz = [{ name: "orbitz.com", host: "www.orbitz.com" }];

const travelocity = [
  { name: "travelocity.com", host: "www.travelocity.com" },
  { name: "travelocity.ca", host: "www.travelocity.ca" },
];

const hotels = [
  { name: "hotels.com", host: "travel.hotels.com" },
  { name: "hoteles.com (ar)", host: "travel.ar.hoteles.com" },
  { name: "hotels.com (at)", host: "travel.at.hotels.com" },
  { name: "hotels.com (au)", host: "travel.au.hotels.com" },
  { name: "hotels.com (be)", host: "travel.be.hotels.com" },
  { name: "hotels.com (ca)", host: "travel.ca.hotels.com" },
  { name: "hotels.com (ch)", host: "travel.ch.hotels.com" },
  { name: "hoteles.com (co)", host: "travel.co.hoteles.com" },
  { name: "hotels.com (de)", host: "travel.de.hotels.com" },
  { name: "hoteles.com (es)", host: "travel.es.hoteles.com" },
  { name: "hotels.com (fi)", host: "travel.fi.hotels.com" },
  { name: "hotels.com (fr)", host: "travel.fr.hotels.com" },
  { name: "hotels.com (hu)", host: "travel.hu.hotels.com" },
  { name: "hotels.com (id)", host: "travel.id.hotels.com" },
  { name: "hotels.com (ie)", host: "travel.ie.hotels.com" },
  { name: "hotels.com (in)", host: "travel.in.hotels.com" },
  { name: "hotels.com (is)", host: "travel.is.hotels.com" },
  { name: "hotels.com (it)", host: "travel.it.hotels.com" },
  { name: "hotels.com (jp)", host: "travel.jp.hotels.com" },
  { name: "hotels.com (kr)", host: "travel.kr.hotels.com" },
  { name: "hotels.com (ms)", host: "travel.ms.hotels.com" },
  { name: "hotels.com (nl)", host: "travel.nl.hotels.com" },
  { name: "hotels.com (no)", host: "travel.no.hotels.com" },
  { name: "hotels.com (nz)", host: "travel.nz.hotels.com" },
  { name: "hotels.com (ph)", host: "travel.ph.hotels.com" },
  { name: "hoteis.com (pt)", host: "travel.pt.hoteis.com" },
  { name: "hotels.com (sg)", host: "travel.sg.hotels.com" },
  { name: "hotels.com (sv)", host: "travel.sv.hotels.com" },
  { name: "hotels.com (th)", host: "travel.th.hotels.com" },
  { name: "hotels.com (tr)", host: "travel.tr.hotels.com" },
  { name: "hotels.com (tw)", host: "travel.tw.hotels.com" },
  { name: "hotels.com (uk)", host: "travel.uk.hotels.com" },
  { name: "hotels.com (vi)", host: "travel.vi.hotels.com" },
  { name: "hoteis.com", host: "travel.hoteis.com" },
  { name: "hoteles.com", host: "travel.hoteles.com" },
  { name: "hotels.cn", host: "travel.hotels.cn" },
  { name: "hotels.com (za)", host: "travel.za.hotels.com" },
  { name: "hotels.com (zh)", host: "travel.zh.hotels.com" },
];

const wotif = [
  { name: "wotif.com", host: "www.wotif.com" },
  { name: "wotif.co.nz", host: "www.wotif.co.nz" },
  { name: "lastminute.com.au", host: "www.lastminute.com.au" },
  { name: "lastminute.co.nz", host: "www.lastminute.co.nz" },
];

function printExpedia(title, editions) {
  const pax = validatePax({
    maxPaxcount: 9,
    countInf: true,
    childAsAdult: 18,
    sepInfSeat: false,
    childMinAge: 2,
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printExpedia");
    return;
  }
  let expediaClasses = ["coach", "premium", "business", "first"];
  let minCabin = 3;
  let ExpediaCreateUrl = function (expediaBase) {
    let segUrl = "";
    for (var i = 0; i < currentItin.itin.length; i++) {
      segUrl +=
        "&legs%5B" + i + "%5D.departureAirport=" + currentItin.itin[i].orig;
      segUrl +=
        "&legs%5B" + i + "%5D.arrivalAirport=" + currentItin.itin[i].dest;
      segUrl +=
        "&legs%5B" +
        i +
        "%5D.departureDate=" +
        currentItin.itin[i].arr.year.toString() +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2);
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        segUrl += (
          "&legs%5B" +
          i +
          "%5D.segments%5B" +
          j +
          "%5D=" +
          currentItin.itin[i].seg[j].dep.year.toString() +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          "-" +
          expediaClasses[
            mptSettings.cabin === "Auto" ? minCabin : getForcedCabin()
          ] +
          "-" +
          currentItin.itin[i].seg[j].orig +
          "-" +
          currentItin.itin[i].seg[j].dest +
          "-" +
          currentItin.itin[i].seg[j].carrier +
          "-" +
          currentItin.itin[i].seg[j].fnr
        ).toLowerCase();

        // check the min cabin:
        if (currentItin.itin[i].seg[j].cabin < minCabin) {
          minCabin = currentItin.itin[i].seg[j].cabin;
        }
      }
    }
    // Build the URL:
    let baseUrl =
      "https://" +
      expediaBase +
      "/Flight-Search-Details?action=dl&trip=MultipleDestination";
    // Add travel class to URL:
    baseUrl +=
      "&cabinClass=" +
      expediaClasses[
        mptSettings.cabin === "Auto" ? minCabin : getForcedCabin()
      ];
    // Add passenger info to URL:
    baseUrl += "&adults=" + pax.adults;
    return baseUrl + segUrl;
  };
  let container = "";
  if (editions && editions.length > 1) {
    container +=
      ' <span class="pt-hover-container">[+]<span class="pt-hover-menu-flex"><div style="margin-right: 1rem;">';
    container += editions
      .slice(1)
      .map(function (obj, i) {
        return (
          '<a href="' +
          ExpediaCreateUrl(obj.host) +
          '" target="_blank">' +
          obj.name +
          "</a>"
        );
      })
      .join("<br/>");
    container += "</div></span></span>";
  }

  return {
    url: ExpediaCreateUrl(editions[0].host),
    title,
    extra: container,
  };
}

register("otas", () => printExpedia("Expedia", expedia));
register("otas", () => printExpedia("CheapTickets", cheaptickets));
register("otas", () => printExpedia("Ebookers", ebookers));
register("otas", () => printExpedia("Hotwire", hotwire));
register("otas", () => printExpedia("MrJet.se", mrjet));
register("otas", () => printExpedia("Orbitz", orbitz));
register("otas", () => printExpedia("Travelocity", travelocity));
register("otas", () => printExpedia("Hotels.com", hotels));
register("otas", () => printExpedia("Wotif", wotif));
