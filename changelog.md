# v0.5.0
## Add
1. The property of `urlsToProxy` of `PorxyOptionsInit` can be an Object which properties can override the PorxyOptionsInit's.

# v0.4.0
## Add
1. Add the property of `_res_data` to `http.ServerResponse` when come across proxy request error, such as the request is timeout or the backend is broken.

# v0.3.0
## Add
1. Add the parameter of `agent` to enable `keep-alive` in http request.

# v0.2.0
## Add
1. Add the parameter of `jsonDisabled` to force the request of `application/json` to be transformed into `application/x-www-form-urlencoded`.

# v0.1.1
## Fix

1. Fix the issue of not sending prepare data to backend when use GET method. 

# v0.1.0
1. Project init.