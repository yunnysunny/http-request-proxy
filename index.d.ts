declare function  HttpRequestProxy(
    options: HttpRequestProxy.ProxyOptions,
  ): HttpRequestProxy.NextHandleFunction
  
  declare namespace HttpRequestProxy {
    type NextHandleFunction = (req: any, res: any, next: (err?) => any) => any
    type ProxyUrl = string | Function;
    /**
     * @param {Object} data The original request data, merged by querystring and body.
     * @param {http.IncomingMessage} req The http request object.
     * @returns {Object} The data after prepared.
     */
    type DataPrepareFunction = (data: object, req: http.IncomingMessage) => object
    /**
     * @param {string} proxyUrl The backend url you proxied to 
     * @param {http.ServerResponse} res The express response object
     */
    type ProxyOnErrorCallback = (proxyUrl: string, res: http.ServerResponse) => undefined

    /**
     * @param {http.IncomingMessage} req The express request object.
     * @returns {Object} The headers after prepared.
     */
    type HeaderPrepareFunction = (req: http.IncomingMessage) => object

    interface CommonOptions {
      onError?: ProxyOnErrorCallback;
      dataPrepare?: DataPrepareFunction;
      headerPrepare?: HeaderPrepareFunction;
      /**
       * default: false
       */
      beforeParser?: boolean;
      /**
       * default: false
       */
      jsonDisabled?: boolean;
      /**
       * default: 10000ms
       */
      timeout?: Number;
    }
    interface CustomOptions extends CommonOptions {
      url: ProxyUrl;
    }
    interface UrlsToProxy {
      [key: string]: string | Function | CustomOptions;
    }
    interface ProxyOptions extends CommonOptions {
      urlsToProxy: UrlsToProxy;
    }
  }
  
  export = HttpRequestProxy;