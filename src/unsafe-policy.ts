let unsafePolicy = null;

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  unsafePolicy = window.trustedTypes.createPolicy("unsafePolicy", {
    createHTML: (string) => string,
    createScriptURL: (string) => string,
    createScript: (string) => string,
  });
}

export const unsafeHTML = (string) =>
  unsafePolicy ? unsafePolicy.createHTML(string) : string;

export const unsafeScriptURL = (string) =>
  unsafePolicy ? unsafePolicy.createScriptURL(string) : string;

export const unsafeScript = (string) =>
  unsafePolicy ? unsafePolicy.createScript(string) : string;
