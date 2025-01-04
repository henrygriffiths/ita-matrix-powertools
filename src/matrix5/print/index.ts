import { printNotification, findtarget, hasClass, findtargets } from "../utils";
import { printLinksContainer } from "./links";

export async function render() {
  printLinksContainer();
}

export function cleanUp() {
  // empty outputcontainer
  if (document.getElementById("powertoolslinkcontainer") != undefined) {
    var div = document.getElementById("powertoolslinkcontainer");
    div.innerHTML = "";
  }
  //  S&D powertool items
  var elems = findtargets("powertoolsitem");
  for (var i = elems.length - 1; i >= 0; i--) {
    elems[i].parentElement.removeChild(elems[i]);
  }
  // S&D price breakdown
  var pbd = findtarget("pricebreakdown", 1);
  if (pbd != undefined) pbd.parentElement.removeChild(pbd);
}
