import { register } from "..";
import { currentItin } from "../../../matrix5/parse/itin";
import { buildQueryString } from "./travix";

function print() {
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ["Economy", "Economy", "Business", "First"];
  var createUrl = (edition) =>
    `https://www.flighthub.com/checkout/gdeeplink?${buildQueryString(
      currentItin.cur || "USD",
      edition.country,
      edition.lang,
      cabins,
    )}`;

  // get edition
  const url = createUrl({ lang: "en", country: "US" });
  if (!url) {
    return;
  }

  return {
    url,
    title: "FlightHub",
  };
}

register("otas", print);
