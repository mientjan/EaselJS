define(["require", "exports"], function (require, exports) {
    "use strict";
    var UID = (function () {
        function UID() {
        }
        UID.get = function () {
            return UID._nextID++;
        };
        UID._nextID = 0;
        return UID;
    }());
    exports.UID = UID;
});
