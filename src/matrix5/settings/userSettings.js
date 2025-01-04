import appSettings from "./appSettings";

const defaultSettings = {
  linkFontsize: 100, // fontsize of links - valid: 50-200
  showAllAirlines: 0, // shows all airline links regardless of search results
  enableIMGautoload: 0, // enables images to auto load - valid: 0 / 1
  enableAffiliates: 1,
};

export const registeredSettings = {};

/**
 * Registers a link
 * @param {string} name
 * @param {string} id
 * @param {{ name: string, value: string }[]} values
 * @param {string} defaultValue
 */
export function registerSetting(name, id, values, defaultValue) {
  registeredSettings[id] = { name, values };
  defaultSettings[id] = defaultValue;
}

export async function saveUserSettings(settings = defaultSettings) {
  if (appSettings.isUserscript)
    await GM.setValue("mptUserSettings", JSON.stringify(settings));
  else localStorage.setItem("mptUserSettings", JSON.stringify(settings));
}

export async function loadUserSettings() {
  let gmSavedUserSettings;
  if (appSettings.isUserscript)
    gmSavedUserSettings = await GM.getValue("mptUserSettings");
  else gmSavedUserSettings = localStorage.getItem("mptUserSettings");

  if (!gmSavedUserSettings || typeof gmSavedUserSettings !== "string") return;

  /** @type typeof defaultSettings */
  const savedUserSettings = JSON.parse(gmSavedUserSettings);
  if (!savedUserSettings) return;

  Object.assign(defaultSettings, savedUserSettings);
}

export default defaultSettings;
