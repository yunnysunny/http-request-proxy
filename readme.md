# http-request-proxy
It's a package aimed at proxy http request in expressjs. Using this package, you can setup a proxy server easily.

## Install

```npm install http-request-proxy```
or
```yarn add http-request-proxy```

## How to use

### Without body-parser

You treat you server as an transparent proxy in this mode, it doesn't modify any HTTP data (both in headers and body).

```javascript
const express = require('express');
const path = require('path');

const {
    TIMEOUT_PROXY,
} = require('./config');
const requestRecordFilter = require('@yunnysunny/request-logging');
const proxy = require('http-request-proxy');

const app = express();
app.enable('trust proxy');

app.set('port', 3003);

app.use(requestRecordFilter());
app.use(proxy({
    urlsToProxy:{
        '/i/back': 'http://localhost:3004'
    },
    beforeParser: true,
    timeout: TIMEOUT_PROXY
}));
```

In this mode , you should set the parameter `beforeParser` to true. And you can set parameter `timeout` to an appropriate value you wanted in millisecond.

### With body-parser

When you want to modify the request parameter in headers or body, you should use this mode.

```java
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const {
    HEADER_SEQ_NUM
} = require('./config');
const requestRecordFilter = require('@yunnysunny/request-logging');
const afterParserProxy = require('http-request-proxy');
const {doSign} = require('./helpers/auth_helper');

const app = express();
app.enable('trust proxy');

app.set('port', 3003);
app.use(requestRecordFilter());

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));
app.use( multipart({}));
app.use(afterParserProxy({
    urlsToProxy:{
        '/i/back': 'http://localhost:3004',
    },
    dataPrepare: function(data) {
        data.sign = doSign(data);
        return data;
    },
    headerPrepare: function(req) {
        return {
            [HEADER_SEQ_NUM]: Number(req.get(HEADER_SEQ_NUM)) + 1
        };
    }
}));
```

But when you want to support uploading in this mode,you should add `connect-multiparty` to your dependencies, and write `app.use( multipart({}))` before call `http-request-proxy`.

It also can set the parameter of `timeout` to control how long you can bear before the response return.



## API

See the document of [api](docs/api.md).



## License

[MIT](LICENSE)