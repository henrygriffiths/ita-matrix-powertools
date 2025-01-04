import { fromByteArray } from "base64-js";

import {
  getRandomInt,
  printNotification,
  to2digits,
  toUrlSafeBase64,
  uuidv4,
} from "../../utils";
import { validatePax, register } from "..";
import { currentItin } from "../../../matrix5/parse/itin";
import { PriceKeyMessage } from "../../../generated/priceline/priceKey";
import { SignatureMessage } from "../../../generated/priceline/signature";
import { getCabin } from "../../settings/appSettings";

var cabins = ["ECO", "PEC", "BUS", "FST"];

function printPriceline() {
  const pax = validatePax({
    maxPaxcount: 9,
    countInf: true,
    childAsAdult: 18,
    sepInfSeat: false,
    childMinAge: 2,
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printPriceline");
    return;
  }

  const unknownRandom = getRandomInt(200);

  const signture: SignatureMessage = {
    version: "v1",
    guid: uuidv4(),
    alwaysOne: 1,
    type: "CLASSIC",
    unknown: {
      unknownPlusOne: unknownRandom + 1,
      unknownOne: 1,
    },
    serverName: "guse4",
    workflowId: `WORKFLOW_ID_${uuidv4()}`,
  };

  const passengers: PriceKeyMessage["pax"] = [];

  if (pax.adults) {
    passengers.push({
      value: pax.adults,
      type: 1,
    });
  }
  if (pax.children?.length) {
    passengers.push({
      value: pax.children.length,
      type: 2,
    });
  }

  const fares: PriceKeyMessage["search"]["fares"] = [];

  let segmentIndex = 0;

  const priceKey: PriceKeyMessage = {
    signature: toUrlSafeBase64(
      fromByteArray(SignatureMessage.toBinary(signture)),
    ),
    referrer: {
      referrer: "KAYAKSEARCH",
      referrerUnknown: {
        alwaysSeventySix: 76,
      },
    },
    pax: passengers,
    search: {
      unknownRandom,
      unknownOne: 1,
      price: currentItin.price,
      itinerary: currentItin.itin.map((itin, i) => ({
        index: i + 1,
        segments: itin.seg.map((seg, j) => {
          segmentIndex++;
          passengers.forEach((p) => {
            fares.push({
              fareType: p.type === 2 ? "CHD" : "ADT",
              segmentIndex,
              fareBasis: seg.farebase,
            });
          });

          return {
            index: segmentIndex,
            departure: `${seg.dep.year}-${to2digits(seg.dep.month)}-${to2digits(
              seg.dep.day,
            )}T${seg.dep.time24}`,
            arrival: `${seg.arr.year}-${to2digits(seg.arr.month)}-${to2digits(
              seg.arr.day,
            )}T${seg.arr.time24}`,
            origin: seg.orig,
            destination: seg.dest,
            flightNumber: seg.fnr + "",
            carrier: seg.farecarrier,
            bookingCode: seg.bookingclass,
            cabin: cabins[getCabin(seg.cabin)],
          };
        }),
      })),
      fares,
    },
  };

  const url = `https://www.priceline.com/m/fly/search/${currentItin.itin
    .map(
      (itin) =>
        `${itin.orig}-${itin.dest}-${itin.dep.year}${to2digits(
          itin.dep.month,
        )}${to2digits(itin.dep.day)}`,
    )
    .join("/")}/details/?price-key=M-${toUrlSafeBase64(
    fromByteArray(PriceKeyMessage.toBinary(priceKey)),
  )}&item-key=META&refid=COUK100109861`;

  return {
    url,
    title: "Priceline",
  };
}

register("otas", printPriceline);
