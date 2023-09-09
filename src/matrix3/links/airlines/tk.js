import { printNotification, to2digits } from "../../utils";
import { validatePax, register, anyCarriers } from "..";
import { currentItin, getCurrentSegs } from "../../../matrix5/parse/itin";

const cabins = ["ECONOMY", "ECONOMY", "BUSINESS", "FIRST"];
function printTK() {
  if (!anyCarriers("TK")) {
    return;
  }

  const pax = validatePax({
    maxPaxcount: 9,
    countInf: false,
    childAsAdult: 12,
    sepInfSeat: false,
    childMinAge: 2,
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printTK");
    return;
  }

  let url = `https://www.turkishairlines.com/en-us/flights/booking/availability-multicity?D=1`;
  url += `&dom=0`;
  url += `&prc=${currentItin.price}`;
  url += `&cur=${currentItin.cur || "USD"}`;
  url += `&lp=PROM`;
  url += `&pax=A:${pax.adults},C:${pax.children.length},I:${pax.infLap}`;
  url += `&cc=${cabins[Math.max(...getCurrentSegs().map((seg) => seg.cabin))]}`;
  currentItin.itin.forEach((itin, i) => {
    url += `&so${i}=${itin.seg.length}`;
    url += `&b${i + 1}=org:${itin.orig}/dst:${itin.dest}/fb:${itin.seg
      .map((seg) => seg.farebase)
      .join(",")}/orgd:${formatDate(itin.dep)}/fn:${itin.seg
      .map((seg) => seg.carrier + seg.fnr)
      .join(",")}`;
  });

  return {
    url,
    title: "Turkish",
  };
}

function formatDate(time) {
  return `${to2digits(time.day)}${to2digits(time.month)}${time.year
    .toString()
    .slice(-2)}`;
}

register("airlines", printTK);
