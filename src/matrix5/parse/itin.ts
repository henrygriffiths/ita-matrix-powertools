import classSettings from "../../matrix3/settings/itaSettings";
import {
  readItinerary as readItinerary3,
  currentItin as currentItin3
} from "../../matrix3/parse/itin";

const currentItin: typeof currentItin3 = {};

export function readItinerary() {
  if (classSettings.matrixVersion == 5) {
    Object.assign(currentItin, readItinerary5());
  } else {
    readItinerary3();
    Object.assign(currentItin, currentItin3);
  }
  console.log("parsed itinerary: ", currentItin);
}

function readItinerary5(): typeof currentItin3 {
  const bookingDetails = classSettings.resultpage.getBookingDetails();

  return {
    itin: bookingDetails.itinerary.slices.map(itin => {
      const fareMap = bookingDetails.tickets
        .flatMap(t => t.pricings.flatMap(p => p.fares))
        .reduce((acc, fare) => {
          fare.bookingInfos.forEach(bi => {
            acc[
              `${bi.segment.origin}${bi.segment.destination}${bi.bookingCode}`
            ] = {
              carrier: fare.carrier,
              code: fare.code
            };
          });
          return acc;
        }, {});
      const segments = itin.segments.flatMap(seg =>
        seg.legs.map(leg => {
          const fare =
            fareMap[
              `${seg.origin.code}${seg.destination.code}${seg.bookingInfos[0].bookingCode}`
            ];
          return {
            arr: isoToDateObj(leg.arrival),
            dep: isoToDateObj(leg.departure),
            orig: leg.origin.code,
            dest: leg.destination.code,
            carrier: seg.carrier.code,
            fnr: seg.flight.number,
            duration: seg.duration,
            cabin: getCabin(seg.bookingInfos[0].cabin),
            bookingclass: seg.bookingInfos[0].bookingCode,
            farebase: fare.code,
            farecarrier: fare.carrier
          };
        })
      );
      return {
        arr: isoToDateObj(itin.arrival),
        dep: isoToDateObj(itin.departure),
        orig: itin.origin.code,
        dest: itin.destination.code,
        seg: segments
      };
    }),
    price: +bookingDetails.displayTotal.substring(3),
    numPax: bookingDetails.passengerCount,
    carriers: [
      ...new Set<string>(
        bookingDetails.itinerary.slices.flatMap(itin =>
          itin.segments.map(seg => seg.carrier.code)
        )
      )
    ],
    cur: bookingDetails.displayTotal.substring(0, 3),
    farebases: [
      ...new Set<string>(
        bookingDetails.tickets.flatMap(t =>
          t.pricings.flatMap(p => p.fares.code)
        )
      )
    ],
    dist: bookingDetails.itinerary.distance.value
  };
}

export function waitForBookingDetails() {
  return new Promise<undefined>(resolve => {
    (function _wait() {
      setTimeout(() => {
        const bookingDetails = classSettings.resultpage?.getBookingDetails();
        if (!!bookingDetails?.itinerary) resolve(undefined);
        else _wait();
      }, 200);
    })();
  });
}

function isoToDateObj(isoDate: string) {
  const time24 = isoDate.substring(11, 16);
  let hour12 = +time24.substring(0, 2);
  if (hour12 > 12) hour12 -= 12;
  const time = hour12 + time24.substring(2, 5);
  return {
    day: +isoDate.substring(8, 10),
    month: +isoDate.substring(5, 7),
    year: +isoDate.substring(0, 4),
    time,
    time24
  };
}

function getCabin(cabin: string) {
  switch (cabin) {
    case "PREMIUM-COACH":
      return 1;
    case "BUSINESS":
      return 2;
    case "FIRST":
      return 3;
    default:
      return 0;
  }
}

export function getCurrentSegs() {
  return currentItin.itin
    .map(function(p) {
      return p.seg;
    })
    .reduce(function(a, b) {
      return a.concat(b);
    }, []);
}

export function getTripType(ow, rt, mc) {
  return currentItin.itin.length > 1
    ? currentItin.itin.length === 2 &&
      currentItin.itin[0].orig === currentItin.itin[1].dest &&
      currentItin.itin[0].dest === currentItin.itin[1].orig
      ? rt
      : mc
    : ow;
}

export function isOneway() {
  return getTripType(true, false, false);
}

export function isRoundtrip() {
  return getTripType(false, true, false);
}

export function isMulticity() {
  return getTripType(false, false, true);
}

export { currentItin };
