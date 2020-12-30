## Modules

<dl>
<dt><a href="#module_http-request-proxy">http-request-proxy</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#OPTION_KEYS">OPTION_KEYS</a></dt>
<dd><p>All default option key</p>
</dd>
<dt><a href="#DEFAULT_OPTION">DEFAULT_OPTION</a></dt>
<dd><p>The part of option default</p>
</dd>
<dt><a href="#getType">getType</a> ⇒ <code>String</code></dt>
<dd><p>Obtain obj type name</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeOption">makeOption(...args)</a></dt>
<dd><p>To create new option Object to avoid the reference coverage by using the args</p>
</dd>
<dt><a href="#DataPrepareFunction">DataPrepareFunction(data, req)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#HeaderPrepareFunction">HeaderPrepareFunction(req)</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#ProxyUrlProcess">ProxyUrlProcess(req)</a> ⇒ <code>Promise</code></dt>
<dd></dd>
<dt><a href="#isString">isString(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check obj whether it is a string type.</p>
</dd>
<dt><a href="#isFunction">isFunction(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check obj whether it is a function type(&#39;Function&#39;/&#39;AsyncFunction&#39;).</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ProxyOnErrorCallback">ProxyOnErrorCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#CommonOptions">CommonOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ProxyUrl">ProxyUrl</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#CustomOptions">CustomOptions</a> : <code><a href="#CommonOptions">CommonOptions</a></code></dt>
<dd></dd>
<dt><a href="#UrlsToProxy">UrlsToProxy</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#PorxyOptionsInit">PorxyOptionsInit</a> : <code><a href="#CommonOptions">CommonOptions</a></code></dt>
<dd></dd>
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

<a name="OPTION_KEYS"></a>

## OPTION\_KEYS
All default option key

**Kind**: global constant  
<a name="DEFAULT_OPTION"></a>

## DEFAULT\_OPTION
The part of option default

**Kind**: global constant  
<a name="getType"></a>

## getType ⇒ <code>String</code>
Obtain obj type name

**Kind**: global constant  
**Returns**: <code>String</code> - 'String'/'Function'/'AsyncFunction'/'Number'/'Date'/'Null'/'Undefined'/'Object'/'Map'/'Set'  

| Param | Type |
| --- | --- |
| obj | <code>\*</code> |

<a name="makeOption"></a>

## makeOption(...args)
To create new option Object to avoid the reference coverage by using the args

**Kind**: global function  

| Param | Type |
| --- | --- |
| ...args | <code>any</code> |

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

<a name="isString"></a>

## isString(obj) ⇒ <code>Boolean</code>
Check obj whether it is a string type.

**Kind**: global function  
**Returns**: <code>Boolean</code> - true/false  

| Param | Type |
| --- | --- |
| obj | <code>\*</code> |

<a name="isFunction"></a>

## isFunction(obj) ⇒ <code>Boolean</code>
Check obj whether it is a function type('Function'/'AsyncFunction').

**Kind**: global function  
**Returns**: <code>Boolean</code> - true/false  

| Param | Type |
| --- | --- |
| obj | <code>\*</code> |

<a name="ProxyOnErrorCallback"></a>

## ProxyOnErrorCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| proxyUrl | <code>String</code> | The backend url you proxied to |
| res | <code>http.ServerResponse</code> | The express response object |

<a name="CommonOptions"></a>

## CommonOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| onError | [<code>ProxyOnErrorCallback</code>](#ProxyOnErrorCallback) |  |  |
| dataPrepare | [<code>DataPrepareFunction</code>](#DataPrepareFunction) |  |  |
| headerPrepare | [<code>HeaderPrepareFunction</code>](#HeaderPrepareFunction) |  |  |
| [beforeParser] | <code>Boolean</code> | <code>false</code> |  |
| [timeout] | <code>Number</code> | <code>10000</code> |  |
| [jsonDisabled] | <code>Boolean</code> |  | When it set true, the type of application/json request will be transformed into application/x-www-form-urlencoded |
| [agent] | <code>http.Agent</code> |  | The instance of the class of http.Agent. |

<a name="ProxyUrl"></a>

## ProxyUrl : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| url | <code>String</code> \| [<code>ProxyUrlProcess</code>](#ProxyUrlProcess) |

<a name="CustomOptions"></a>

## CustomOptions : [<code>CommonOptions</code>](#CommonOptions)
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| url | <code>String</code> \| [<code>ProxyUrlProcess</code>](#ProxyUrlProcess) |

<a name="UrlsToProxy"></a>

## UrlsToProxy : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| urlsToProxy | <code>Object.&lt;String, (String\|ProxyUrlProcess\|CustomOptions)&gt;</code> |

<a name="PorxyOptionsInit"></a>

## PorxyOptionsInit : [<code>CommonOptions</code>](#CommonOptions)
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| urlsToProxy | <code>Object.&lt;String, (String\|ProxyUrlProcess\|CustomOptions)&gt;</code> |

