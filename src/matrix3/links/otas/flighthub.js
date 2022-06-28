import { printNotification } from "../../utils";
import { validatePax, register } from "..";
import { currentItin, getTripType } from "../../../matrix5/parse/itin";

function print() {
  var createUrl = function(edition) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    var cabins = ["Economy", "Economy", "Business", "First"];
    var pax = validatePax({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification(
        "Error: Failed to validate Passengers in printLucky2go"
      );
      return;
    }
    let url =
      "https://www.flighthub.com/checkout/gdeeplink?Adult=" +
      pax.adults +
      "&Child=" +
      pax.children.length +
      "&Infant=0&InfantLap=" +
      pax.infLap +
      "&PointOfSaleCountry=" +
      edition.country +
      "&UserCurrency=" +
      (currentItin.cur || "USD") +
      "&DisplayedPrice=" +
      currentItin.price +
      "&DisplayedPriceCurrency=" +
      (currentItin.cur || "USD") +
      "&UserLanguage=" +
      edition.lang +
      "&TripType=" +
      getTripType("OneWay", "RoundTrip", "MultiCity");

    let seg = 0;
    let slice = 1;
    let slicestr = "";
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        seg++;
        //walks each segment of leg
        var k = 0;
        // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
        while (j + k < currentItin.itin[i].seg.length - 1) {
          if (
            currentItin.itin[i].seg[j + k].fnr !=
              currentItin.itin[i].seg[j + k + 1].fnr ||
            currentItin.itin[i].seg[j + k].layoverduration >= 1440
          )
            break;
          k++;
        }
        url += "&Origin" + seg + "=" + currentItin.itin[i].seg[j].orig;
        url += "&Destination" + seg + "=" + currentItin.itin[i].seg[j + k].dest;
        url += "&Carrier" + seg + "=" + currentItin.itin[i].seg[j].carrier;
        url +=
          "&DepartureDate" +
          seg +
          "=" +
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
        url += "&FlightNumber" + seg + "=" + currentItin.itin[i].seg[j].fnr;
        url +=
          "&BookingCode" + seg + "=" + currentItin.itin[i].seg[j].bookingclass;
        url += "&Cabin" + seg + "=" + cabins[currentItin.itin[i].seg[j].cabin];
        slicestr += (slicestr === "" ? "" : "%2C") + seg;
        j += k;
      }
      url += "&Slice" + slice + "=" + slicestr;
      slice++;
      slicestr = "";
    }
    return url;
  };
  // get edition
  const url = createUrl({ lang: "en", country: "US" });
  if (!url) {
    return;
  }

  return {
    url,
    title: "FlightHub"
  };
}

register("otas", print);
