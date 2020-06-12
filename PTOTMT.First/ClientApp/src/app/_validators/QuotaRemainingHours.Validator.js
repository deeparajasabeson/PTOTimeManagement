"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PTOHours_Validator_1 = require("./PTOHours.Validator");
var QuotaCustomValidators = /** @class */ (function () {
    function QuotaCustomValidators() {
    }
    QuotaCustomValidators.ValidateOriginalHours = function () {
        return function (control) {
            var startDate = control.get('startDate').value;
            var startTime = control.get('startTime').value;
            var endDate = control.get('endDate').value;
            var endTime = control.get('endTime').value;
            var remainingHours = control.get('remainingHours').value;
            var originalHours = control.get('originalHours').value;
            var calchours = PTOHours_Validator_1.PTOCustomValidators.calculateHours(false, startDate, startTime, endDate, endTime);
            if (originalHours != null && originalHours <= 0) {
                return { 'invalidHours': true };
            }
            if (calchours < originalHours) {
                return { 'hoursExceeding': true };
            }
            if (originalHours < remainingHours) {
                return { 'remainingHoursGreater': true };
            }
            return null;
        };
    };
    return QuotaCustomValidators;
}());
exports.QuotaCustomValidators = QuotaCustomValidators;
//# sourceMappingURL=QuotaRemainingHours.Validator.js.map