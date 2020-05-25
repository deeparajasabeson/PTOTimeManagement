"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* "Barrel" of Http Interceptors */
var http_1 = require("@angular/common/http");
var HttpConfigInterceptor_1 = require("./HttpConfigInterceptor");
/** Http interceptor providers in outside-in order */
exports.httpInterceptorProviders = [
    {
        provide: http_1.HTTP_INTERCEPTORS,
        useClass: HttpConfigInterceptor_1.HttpConfigInterceptor,
        multi: true
    }
];
//# sourceMappingURL=index.js.map