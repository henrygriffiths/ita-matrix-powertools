import mptUserSettings from "../settings/userSettings";
import mtpPassengerConfig from "../settings/paxSettings";
import { Link, registerLink } from "../print/links";
import { currentItin } from "../../matrix5/parse/itin";

const req = require.context("./", true, /.[jt]s$/);

req.keys().forEach(req);

/**
 * Registers a link
 */
export function register(type: string, factory: () => Link) {
  registerLink(type, factory);
}

export function allCarriers(...args: string[]) {
  return (
    mptUserSettings.showAllAirlines ||
    currentItin.carriers.every((cxr) => args.some((arg) => cxr === arg))
  );
}

export function anyCarriers(...args: string[]) {
  return (
    mptUserSettings.showAllAirlines ||
    currentItin.carriers.some((cxr) => args.some((arg) => cxr === arg))
  );
}

export function validatePax(config: {
  maxPaxcount: number;
  countInf: boolean;
  childAsAdult: number;
  sepInfSeat: boolean;
  childMinAge: number;
}) {
  var tmpChildren = new Array();
  // push cur children
  for (var i = 0; i < mtpPassengerConfig.cAges.length; i++) {
    tmpChildren.push(mtpPassengerConfig.cAges[i]);
  }
  var ret = {
    adults: mtpPassengerConfig.adults,
    children: new Array(),
    infLap: mtpPassengerConfig.infantsLap,
    infSeat: 0,
  };
  if (config.sepInfSeat === true) {
    ret.infSeat = mtpPassengerConfig.infantsSeat;
  } else {
    for (var i = 0; i < mtpPassengerConfig.infantsSeat; i++) {
      tmpChildren.push(config.childMinAge);
    }
  }
  // process children
  for (var i = 0; i < tmpChildren.length; i++) {
    if (tmpChildren[i] < config.childAsAdult) {
      ret.children.push(tmpChildren[i]);
    } else {
      ret.adults++;
    }
  }
  // check Pax-Count
  if (
    config.maxPaxcount <=
    ret.adults +
      (config.countInf && ret.infLap) +
      ret.infSeat +
      ret.children.length
  ) {
    console.log("Too many passengers");
    return;
  }
  if (0 === ret.adults + ret.infSeat + ret.children.length) {
    console.log("No passengers");
    return;
  }
  return ret;
}
