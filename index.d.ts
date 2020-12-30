declare function  HttpRequestProxy(
  options: HttpRequestProxy.defaultOptions,
): HttpRequestProxy.NextHandleFunction

declare namespace HttpRequestProxy {
  type NextHandleFunction = (req: any, res: any, next: (err?) => any) => any
  type ProxyUrl = string | Function;
  interface commonOptions {
    onError?: Function;
    dataPrepare?: Function;
    headerPrepare?: Function;
    beforeRequest?: Function;
    afterRequest?: Function;
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
  interface customOptions extends commonOptions {
    url: ProxyUrl;
  }
  interface UrlsToProxy {
    [key: string]: string | Function | customOptions;
  }
  interface defaultOptions extends commonOptions {
    urlsToProxy: UrlsToProxy;
  }
}

export = HttpRequestProxy;