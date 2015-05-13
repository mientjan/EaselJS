define(["require", "exports"], function (require, exports) {
    var UID = (function () {
        function UID() {
        }
        UID.get = function () {
            return UID._nextID++;
        };
        UID._nextID = 0;
        return UID;
    })();
    return UID;
});
