export const JsonToUrlString = (JsonObject) => {
  let urlString = '';
  Object.keys(JsonObject).forEach((key) => {
    if (JsonObject[key] !== undefined) {
      if (urlString) {
        urlString += '&';
      } else {
        urlString += '?';
      }
      if (
        typeof JsonObject[key] === 'object' &&
        !Array.isArray(JsonObject[key])
      ) {
        urlString += `${key}=${JSON.stringify(JsonObject[key])}`;
      } else {
        urlString += `${key}=${JsonObject[key]}`;
      }
    }
  });
  return urlString;
};
