module.exports = Object.assign(new Error, {
    "config": {
        "transformRequest": {},
        "transformResponse": {},
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "headers": {"Accept": "application/json, text/plain, */*"},
        "method": "get",
        "url": "https://128807.share.worldcat.org/idaas/scim/v2/Me"
    },
    "response": {
        "config": {
            "transformRequest": {},
            "transformResponse": {},
            "timeout": 0,
            "xsrfCookieName": "XSRF-TOKEN",
            "xsrfHeaderName": "X-XSRF-TOKEN",
            "maxContentLength": -1,
            "headers": {"Accept": "application/json, text/plain, */*"},
            "method": "get",
            "url": "https://128807.share.worldcat.org/idaas/scim/v2/Me"
        },
        "data": {"schemas": ["urn:ietf:params:scim:api:messages:2.0:Error"], "detail": "Authentication failure. Missing or invalid authorization token.", "status": "401"},
        "status": 401,
        "request": {
            "config": {
                "transformRequest": {},
                "transformResponse": {},
                "timeout": 0,
                "xsrfCookieName": "XSRF-TOKEN",
                "xsrfHeaderName": "X-XSRF-TOKEN",
                "maxContentLength": -1,
                "headers": {"Accept": "application/json, text/plain, */*"},
                "method": "get",
                "url": "https://128807.share.worldcat.org/idaas/scim/v2/Me"
            },
            "headers": {"Accept": "application/json, text/plain, */*"},
            "url": "https://128807.share.worldcat.org/idaas/scim/v2/Me",
            "timeout": 0,
            "withCredentials": false
        }
    }
});