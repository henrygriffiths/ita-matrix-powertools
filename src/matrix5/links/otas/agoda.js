import { register, validatePax } from "..";
import { currentItin, getTripType } from "../../../matrix5/parse/itin";
import { getCabin } from "../../settings/appSettings";
import { printNotification, to2digits } from "../../utils";

const editions = [
  { name: "English", lang: "en", pos: "US" },
  { name: "한국어", lang: "ko", pos: "KR" },
  { name: "繁體中文 (台灣)", lang: "zh", pos: "TW" },
  { name: "Español", lang: "es", pos: "ES" },
  { name: "简体中文", lang: "zh", pos: "CN" },
  { name: "日本語", lang: "ja", pos: "JP" },
  { name: "繁體中文 (香港)", lang: "zh", pos: "HK" },
  { name: "ภาษาไทย", lang: "th", pos: "TH" },
  { name: "Français", lang: "fr", pos: "FR" },
  { name: "Tiếng Việt", lang: "vi", pos: "VN" },
  { name: "Deutsch", lang: "de", pos: "DE" },
  { name: "Русский", lang: "ru", pos: "RU" },
  { name: "Bahasa Indonesia", lang: "id", pos: "ID" },
  { name: "العربية", lang: "ar", pos: "AE" },
  { name: "Português (PT)", lang: "pt", pos: "PT" },
  { name: "Português (BR)", lang: "pt", pos: "BR" },
  { name: "עברית", lang: "he", pos: "IL" },
  { name: "Język polski", lang: "pl", pos: "PL" },
  { name: "Italiano", lang: "it", pos: "IT" },
  { name: "Nederlands", lang: "nl", pos: "NL" },
  { name: "Română", lang: "ro", pos: "RO" },
  { name: "Svenska", lang: "sv", pos: "SE" },
  { name: "Türkçe", lang: "tr", pos: "TR" },
  { name: "Dansk", lang: "da", pos: "DK" },
  { name: "Українська", lang: "uk", pos: "UA" },
  { name: "Bahasa Malaysia", lang: "ms", pos: "MY" },
  { name: "Norsk", lang: "nb", pos: "NO" },
  { name: "Čeština", lang: "cs", pos: "CZ" },
  { name: "Suomi", lang: "fi", pos: "FI" },
  { name: "Magyar", lang: "hu", pos: "HU" },
  { name: "Ελληνικά", lang: "el", pos: "GR" },
  { name: "Lietuvių", lang: "lt", pos: "LT" },
  { name: "Filipino", lang: "tl", pos: "PH" },
  { name: "Slovenski jezik", lang: "sl", pos: "SI" },
  { name: "Български език", lang: "bg", pos: "BG" },
  { name: "Català", lang: "ca", pos: "ES" },
  { name: "Eesti", lang: "et", pos: "EE" },
  { name: "Latviešu", lang: "lv", pos: "LV" },
  { name: "Hrvatski", lang: "hr", pos: "HR" },
];

function buildQueryString(cur, pos = "", lang = null) {
  const cabins = ["ECO", "PEO", "BIZ", "FST"];
  const pax = validatePax({
    maxPaxcount: 9,
    countInf: true,
    childAsAdult: 12,
    sepInfSeat: false,
    childMinAge: 2,
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in edestinos");
    return;
  }

  let url = `cid=1841944&currency=${cur}&DisplayedPrice=${
    currentItin.price
  }&TripType=${getTripType("OneWay", "RoundTrip", "MultiCity")}`;
  url += "&Adult=" + pax.adults;
  url += "&Child=" + pax.children.length;
  url += "&InfantLap=" + pax.infLap;

  let j = 0;
  currentItin.itin.forEach((itin, i) => {
    const slices = [];

    itin.seg.forEach((seg) => {
      j++;
      slices.push(j);

      url += `&Cabin${j}=` + cabins[getCabin(seg.cabin)];
      url += `&Carrier${j}=` + seg.carrier;
      url += `&Origin${j}=` + seg.orig;
      url += `&Destination${j}=` + seg.dest;
      url += `&BookingCode${j}=` + seg.bookingclass;
      url += `&FlightNumber${j}=` + seg.fnr;
      url += `&DepartureDate${j}=${seg.dep.year}-${to2digits(
        seg.dep.month,
      )}-${to2digits(seg.dep.day)}T${seg.dep.time24}:00`;
      url += `&FareBasis${j}=` + seg.farebase;
    });

    url += `&Slice${i + 1}=` + slices.join(",");
  });

  return url;
}

function print() {
  const createUrl = (edition) =>
    `https://www.agoda.com/bookings/details?${buildQueryString(
      currentItin.cur || "USD",
      edition.pos,
      edition.lang,
    )}`;

  // get edition
  const url = createUrl({ lang: "en", pos: "US" });
  if (!url) {
    return;
  }

  let container = "";
  if (editions && editions.length > 1) {
    container +=
      ' <span class="pt-hover-container">[+]<span class="pt-hover-menu-flex"><div style="margin-right: 1rem;">';
    container += editions
      .slice(1)
      .map(function (obj, i) {
        return (
          '<a href="' +
          createUrl(obj) +
          '" target="_blank">' +
          obj.name +
          "</a>"
        );
      })
      .join("<br/>");
    container += "</div></span></span>";
  }

  return {
    url,
    title: "Agoda",
    extra: container,
  };
}

register("otas", print);
