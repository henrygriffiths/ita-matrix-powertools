import { findtarget } from "../utils";

// ITA Matrix CSS class definitions:
const itaSettings = [
  {
    matrixVersion: 5,
    startpage: {
      maindiv: "mat-app-background",
    },
    resultpage: {
      mcDiv: "info-container",
      mcHeader: "info-title",
      copyAsJsonButton: "button.share-button:nth-child(4)",
    },
  },
];

const classSettings = itaSettings[0];

export function findTargetSetVersion(classSelector, nth) {
  for (let setting of itaSettings) {
    const className = classSelector(setting);
    const target = findtarget(className, nth);
    if (target) {
      console.log(`ITA Version detected: ${className}`);
      Object.assign(classSettings, setting);
      return target;
    }
  }
}

export default classSettings;
