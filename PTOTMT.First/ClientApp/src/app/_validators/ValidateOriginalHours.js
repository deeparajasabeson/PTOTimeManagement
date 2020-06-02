"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValidateOriginalHours(remainingHours) {
    return function (control) {
        if (control.value <= 0 || control.value < remainingHours) {
            return { 'valideOriginalHours': true };
        }
        return null;
    };
}
exports.ValidateOriginalHours = ValidateOriginalHours;
//# sourceMappingURL=ValidateOriginalHours.js.map