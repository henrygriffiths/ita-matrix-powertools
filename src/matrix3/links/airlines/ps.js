import { register, anyCarriers } from "..";
import { buildQueryString } from "../otas/travix";

function printPS() {
  if (!anyCarriers("PS")) {
    return;
  }

  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ["Economy", "Economy", "Business", "First"];
  var createUrl = (edition, currency) =>
    `http://www.iberia.com/web/partnerLink.do?${buildQueryString(
      currency,
      edition[1],
      edition[0],
      cabins
    )}`;

  var url = createUrl(["EN", "US"], "USD");
  if (!url) {
    return;
  }

  return {
    url,
    title: "UIA"
  };
}

register("airlines", printPS);
