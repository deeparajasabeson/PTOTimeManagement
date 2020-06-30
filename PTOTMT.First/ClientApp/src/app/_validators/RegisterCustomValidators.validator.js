"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegisterCustomValidators = /** @class */ (function () {
    function RegisterCustomValidators() {
    }
    RegisterCustomValidators.MustMatchPassword = function (password) {
        return function (control) {
            var confirmPassword = control.get('confirmPassword').value;
            if (password != confirmPassword) {
                return { 'invalidPassword': true };
            }
            return null;
        };
    };
    return RegisterCustomValidators;
}());
exports.RegisterCustomValidators = RegisterCustomValidators;
//# sourceMappingURL=RegisterCustomValidators.validator.js.map