import classSettings from "../settings/itaSettings";

const doNothing = new Promise<void>(() => {});

// initialize local storage for current itin
let currentItin: {
  cur?: string;
  price?: number;
  basefares?: number;
  taxes?: number;
  surcharges?: number;
  dist?: number;
  numPax?: number;
  carriers?: string[];
  farebases?: string[];
  itin?: {
    orig: string;
    dest: string;
    dist?: number;
    dep: {
      day: number;
      month: number;
      year: number;
      time: string;
      offset?: string;
    };
    arr: {
      day: number;
      month: number;
      year: number;
      time: string;
      offset?: string;
    };
    seg?: {
      carrier: string;
      orig: string;
      dest: string;
      dist?: number;
      dep: {
        day: number;
        month: number;
        year: number;
        time: string;
        time24: string;
        timeDisplay: string;
        offset?: string;
      };
      arr: {
        day: number;
        month: number;
        year: number;
        time: string;
        time24: string;
        timeDisplay: string;
        offset?: string;
      };
      fnr: string;
      duration: number;
      aircraft: string;
      cabin: number;
      bookingclass: string;
      codeshare: number;
      layoverduration: number;
      airportchange: number;
      farebase: string;
      farecarrier: string;
    }[];
  }[];
} = {};

export async function readItinerary() {
  Object.assign(currentItin, await readItinerary5());
  console.log("parsed itinerary: ", currentItin);
}

async function readItinerary5(): Promise<typeof currentItin> {
  const bookingDetails = await getBookingDetails();

  return {
    itin: bookingDetails.itinerary.slices.map((itin) => {
      const fareMap = bookingDetails.tickets
        .flatMap((t) => t.pricings.flatMap((p) => p.fares))
        .reduce((acc, fare) => {
          fare.bookingInfos.forEach((bi) => {
            acc[
              `${bi.segment.origin}${bi.segment.destination}${bi.bookingCode}`
            ] = {
              carrier: fare.carrier,
              code: fare.code,
            };
          });
          return acc;
        }, {});
      const segments = itin.segments.flatMap((seg) =>
        seg.legs.map((leg) => {
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
            farecarrier: fare.carrier,
          };
        }),
      );
      return {
        arr: isoToDateObj(itin.arrival),
        dep: isoToDateObj(itin.departure),
        orig: itin.origin.code,
        dest: itin.destination.code,
        seg: segments,
      };
    }),
    price: +bookingDetails.displayTotal.substring(3),
    numPax: bookingDetails.passengerCount,
    carriers: [
      ...new Set<string>(
        bookingDetails.itinerary.slices.flatMap((itin) =>
          itin.segments.map((seg) => seg.carrier.code),
        ),
      ),
    ],
    cur: bookingDetails.displayTotal.substring(0, 3),
    farebases: [
      ...new Set<string>(
        bookingDetails.tickets.flatMap((t) =>
          t.pricings.flatMap((p) => p.fares.code),
        ),
      ),
    ],
    dist: bookingDetails.itinerary.distance.value,
  };
}

function getBookingDetails() {
  return new Promise<any>((resolve, reject) => {
    (function _wait() {
      setTimeout(async () => {
        const copyAsJsonButton: HTMLElement = document.querySelector(
          classSettings.resultpage.copyAsJsonButton,
        );
        if (!copyAsJsonButton) {
          return _wait();
        }

        const clipboard =
          window?.navigator?.clipboard ?? unsafeWindow?.navigator?.clipboard;
        if (!clipboard) {
          return reject("Could not access the clipboard");
        }

        const _writeText = clipboard.writeText;
        clipboard.writeText = (data: string) => {
          clipboard.writeText = _writeText;
          resolve(JSON.parse(data));
          return doNothing;
        };
        copyAsJsonButton.click();
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
    time24,
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
    .map(function (p) {
      return p.seg;
    })
    .reduce(function (a, b) {
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
