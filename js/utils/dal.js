import * as Utils from './index';

const FetchMethod = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const FetchOption = {
  method: FetchMethod[0], // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, cors, *same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, same-origin, *omit
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate',
  },
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // no-referrer, *client
  body: null, // body data type must match "Content-Type" header Example:JSON.stringify(data)
};

class DataService {
  /**
   * params = {
   *  url:string,
   *  method: GET|POST|PUT|DELETE|PATCH,
   *  headers: jsonObject,
   *  parameters: jsonObject
   * }
   */
  request = (params) => {
    let {url} = params;
    const option = Object.assign({}, FetchOption);
    if (url) {
      if (params.headers && Object.keys(params.headers).length > 0) {
        option.headers = Object.assign({}, option.headers, params.headers);
      }
      if (params.parameters) {
        if (option.method === FetchMethod[0]) {
          url += Utils.JsonToUrlString(params.parameters);
        } else {
          option.body = JSON.stringify(params.parameters);
        }
      }
      if (params.abortController) {
        option.signal = params.abortController.signal;
      }

      return fetch(url, option)
        .then(async (response) => {
          const r = await this.getResponse(response);
          return r;
        })
        .catch(async (error) => {
          console.warn(error);
          throw error;
        });
    }
    return undefined;
  };

  getResponse = async (response) => {
    // access-control-allow-origin: "http://act.shanghaicity.openservice.kankanews.com"

    if (
      response.headers.map['content-type'].indexOf('json') > -1 ||
      (response.headers.map['access-control-allow-origin'] &&
        response.headers.map['access-control-allow-origin'].indexOf(
          'shanghaicity',
        ) > -1)
    ) {
      const rs = await response.json();
      return rs;
    }
    const rs = await response.text();
    return rs;
  };

  getData = async (url, headers, body) =>
    this.request({
      url,
      method: FetchMethod[0],
      headers,
      parameters: body,
    });
}

export const HttpService = new DataService();
