/**
 * Created by pieters on 11-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var FlexDirection = (function () {
        function FlexDirection() {
        }
        FlexDirection.COLUMN = "column";
        FlexDirection.ROW = "row";
        return FlexDirection;
    })();
    return FlexDirection;
});
