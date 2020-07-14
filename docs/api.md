## Modules

<dl>
<dt><a href="#module_http-request-proxy">http-request-proxy</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#DataPrepareFunction">DataPrepareFunction(data, req)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#HeaderPrepareFunction">HeaderPrepareFunction(req)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#ProxyUrlProcess">ProxyUrlProcess(req)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ProxyOnErrorCallback">ProxyOnErrorCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#PorxyOptionsInit">PorxyOptionsInit</a> : <code>Object</code></dt>
<dd><p>The options for proxy request</p>
</dd>
</dl>

<a name="module_http-request-proxy"></a>

## http-request-proxy
<a name="exp_module_http-request-proxy--module.exports"></a>

### module.exports(options) ⏏
The express proxy middleware.

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| options | [<code>PorxyOptionsInit</code>](#PorxyOptionsInit) | 

<a name="DataPrepareFunction"></a>

## DataPrepareFunction(data, req) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - The data after prepared.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The original request data, merged by querystring and body. |
| req | <code>http.IncomingMessage</code> | The http request object. |

<a name="HeaderPrepareFunction"></a>

## HeaderPrepareFunction(req) ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - The headers after prepared.  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> | The express request object. |

<a name="ProxyUrlProcess"></a>

## ProxyUrlProcess(req) ⇒ <code>Promise</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| req | <code>http.IncomingMessage</code> | 

<a name="ProxyOnErrorCallback"></a>

## ProxyOnErrorCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| proxyUrl | <code>String</code> | The backend url you proxied to |
| res | <code>http.ServerResponse</code> | The express response object |

<a name="PorxyOptionsInit"></a>

## PorxyOptionsInit : <code>Object</code>
The options for proxy request

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [urlsToProxy] | <code>Object.&lt;String, (String\|ProxyUrlProcess)&gt;</code> |  | The map of url prefix and backend base url. |
| [onError] | [<code>ProxyOnErrorCallback</code>](#ProxyOnErrorCallback) |  |  |
| [dataPrepare] | [<code>DataPrepareFunction</code>](#DataPrepareFunction) |  |  |
| [headerPrepare] | [<code>HeaderPrepareFunction</code>](#HeaderPrepareFunction) |  |  |
| [beforeParser] | <code>Boolean</code> |  |  |
| [timeout] | <code>Number</code> | <code>10000</code> |  |
| [jsonDisabled] | <code>Boolean</code> |  | When it set true, the type of application/json request will be transformed into application/x-www-form-urlencoded |

