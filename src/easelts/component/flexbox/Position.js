/**
 * Created by pieters on 11-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var Position = (function () {
        function Position() {
        }
        Position.RELATIVE = "relative";
        Position.ABSOLUTE = "absolute";
        return Position;
    })();
    return Position;
});
