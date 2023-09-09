import { getCurrentSegs } from "../../../matrix5/parse/itin";
import { register } from "..";

function printWheretocredit() {
  return {
    url:
      "https://www.wheretocredit.com/calculator#" +
      getCurrentSegs()
        .map((seg) =>
          [seg.orig, seg.dest, seg.carrier, seg.bookingclass].join("-"),
        )
        .join("/"),
    title: "Where to Credit",
  };
}

register("other", printWheretocredit);
