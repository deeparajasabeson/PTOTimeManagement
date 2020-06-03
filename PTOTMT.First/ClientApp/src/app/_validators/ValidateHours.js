"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValidateHours(startDate, startTime, EndDate, EndTime) {
    return function (control) {
        if (control.value <= 0) {
            return { 'valideOriginalHours': true };
        }
        return null;
    };
}
exports.ValidateHours = ValidateHours;
//# sourceMappingURL=ValidateHours.js.map