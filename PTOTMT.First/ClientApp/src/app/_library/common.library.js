"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dialog_1 = require("@angular/material/dialog");
var CommonLibrary = /** @class */ (function () {
    function CommonLibrary() {
    }
    //Convert NgbDateStruct date to Date format
    CommonLibrary.NgbDateStruct2Date = function (date) {
        return new Date(date.year, date.month, date.day);
    };
    //Convert NgbDateStruct Date and Time string to  Date Format
    CommonLibrary.NgbDateStruct2DateTime = function (date, time) {
        return new Date(date.year, date.month - 1, date.day, parseInt(time.substr(0, 2)), parseInt(time.substr(3, 2)));
    };
    //Convert Date to NgbDateStruct format
    CommonLibrary.Date2NgbDateStruct = function (date) {
        var toDate = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        return toDate;
    };
    //Generating GUID in Typescript
    CommonLibrary.GenerateUUID = function () {
        var d = new Date().getTime();
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16; //random number between 0 and 16
            if (d > 0) { //Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            }
            else { //Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    // Check whether User is authenticated
    CommonLibrary.IsUserAuthenticated = function () {
        var token = localStorage.getItem("jwt");
        return (token) ? true : false;
    };
    CommonLibrary.CreateDialog = function () {
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true; // User can't close the dialog by clicking outside its body
        dialogConfig.autoFocus = true;
        dialogConfig.width = "70%";
        return dialogConfig;
    };
    //convert the list to a sortedarray on the parameter given
    CommonLibrary.sortListByProperty = function (list, propName) {
        return list.sort(function (a, b) {
            if (a[propName] < b[propName]) {
                return -1;
            }
            if (a[propName] > b[propName]) {
                return 1;
            }
            return 0;
        });
    };
    return CommonLibrary;
}());
exports.CommonLibrary = CommonLibrary;
//# sourceMappingURL=common.library.js.map