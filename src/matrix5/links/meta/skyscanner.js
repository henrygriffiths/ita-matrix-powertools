import { getCabin } from "../../settings/appSettings";
import { register, validatePax } from "..";
import { currentItin, getCurrentSegs } from "../../../matrix5/parse/itin";
import { printNotification, to2digits } from "../../utils";

const editions = [
  { name: "www.skyscanner.com", market: "US" },
  { name: "www.skyscanner.ae", market: "AE" },
  { name: "www.skyscanner.at", market: "AT" },
  { name: "www.skyscanner.com.au", market: "AU" },
  { name: "www.skyscanner.com.br", market: "BR" },
  { name: "www.skyscanner.ca", market: "CA" },
  { name: "www.skyscanner.ch", market: "CH" },
  { name: "www.tianxun.com", market: "CN" },
  { name: "www.espanol.skyscanner.com", market: "CO" },
  { name: "www.skyscanner.cz", market: "CZ" },
  { name: "www.skyscanner.de", market: "DE" },
  { name: "www.skyscanner.dk", market: "DK" },
  { name: "www.skyscanner.es", market: "ES" },
  { name: "www.skyscanner.fi", market: "FI" },
  { name: "www.skyscanner.fr", market: "FR" },
  { name: "www.skyscanner.gg", market: "GG" },
  { name: "gr.skyscanner.com", market: "GR" },
  { name: "www.skyscanner.com.hk", market: "HK" },
  { name: "www.skyscanner.hu", market: "HU" },
  { name: "www.skyscanner.co.id", market: "ID" },
  { name: "www.skyscanner.ie", market: "IE" },
  { name: "www.skyscanner.co.il", market: "IL" },
  { name: "www.skyscanner.co.in", market: "IN" },
  { name: "www.skyscanner.it", market: "IT" },
  { name: "www.skyscanner.jp", market: "JP" },
  { name: "www.skyscanner.co.kr", market: "KR" },
  { name: "www.skyscanner.com.mx", market: "MX" },
  { name: "www.skyscanner.com.my", market: "MY" },
  { name: "www.skyscanner.nl", market: "NL" },
  { name: "www.skyscanner.no", market: "NO" },
  { name: "www.skyscanner.co.nz", market: "NZ" },
  { name: "www.skyscanner.com.ph", market: "PH" },
  { name: "www.skyscanner.pl", market: "PL" },
  { name: "www.skyscanner.pt", market: "PT" },
  { name: "www.skyscanner.ro", market: "RO" },
  { name: "ru.skyscanner.com", market: "RU" },
  { name: "www.skyscanner.com.sa", market: "SA" },
  { name: "www.skyscanner.se", market: "SE" },
  { name: "www.skyscanner.com.sg", market: "SG" },
  { name: "www.skyscanner.co.th", market: "TH" },
  { name: "www.skyscanner.com.tr", market: "TR" },
  { name: "www.skyscanner.com.tw", market: "TW" },
  { name: "www.skyscanner.com.ua", market: "UA" },
  { name: "www.skyscanner.net", market: "UK" },
  { name: "www.skyscanner.com.vn", market: "VN" },
];

var cabins = ["", "premiumeconomy", "business", "first"];

function print(method) {
  //example https://www.skyscanner.ru/transport/d/stoc/2017-09-02/akl/akl/2017-09-16/stoc/akl/2017-09-29/syd?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&ref=day-view#results
  // method: 0 = based on leg; 1 = based on segment
  const segs = !method ? currentItin.itin : getCurrentSegs();
  if (method && currentItin.itin.length === segs.length) return;

  var pax = validatePax({
    maxPaxcount: 8,
    countInf: false,
    childAsAdult: 12,
    sepInfSeat: false,
    childMinAge: 2,
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printOvago");
    return;
  }

  const cabin =
    cabins[getCabin(Math.min(...getCurrentSegs().map((seg) => seg.cabin)))];

  var createUrl = function (edition) {
    var url = `http://${edition.name}/transport/d/`;

    // Add the segments:
    url += segs
      .map(
        (seg) =>
          `${seg.orig}/${seg.dep.year}-${to2digits(seg.dep.month)}-${to2digits(
            seg.dep.day,
          )}/${seg.dest}`,
      )
      .join("/");

    // Add passenger info:
    url += "?adults=" + pax.adults + "adultsv2=" + pax.adults;
    if (pax.children.length || pax.infLap)
      url +=
        "&childrenv2=" +
        Array.apply(null, { length: pax.infLap })
          .map((o) => 0)
          .concat(pax.children)
          .join("|");
    if (pax.infLap) url += "&infants=" + pax.infLap;
    // Add cabin / class of service:
    url += "&cabinclass=" + cabin;
    // Add locale ("market"):
    url += "&ref=day-view&market=" + edition.market;

    return url;
  };
  var url = createUrl(editions[0]);
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += editions
    .map(function (obj, i) {
      return (
        '<a href="' + createUrl(obj) + '" target="_blank">' + obj.name + "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "Skyscanner",
    desc: `Based on ${segs.length} segment(s)`,
    extra,
  };
}

register("meta", () => print(0));
register("meta", () => print(1));
