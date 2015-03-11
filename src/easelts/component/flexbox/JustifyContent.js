/**
 * Created by pieters on 11-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var JustifyContent = (function () {
        function JustifyContent() {
        }
        JustifyContent.FLEX_START = "flex-start";
        JustifyContent.CENTER = "center";
        JustifyContent.FLEX_END = "flex-end";
        JustifyContent.SPACE_BETWEEN = "space-between";
        JustifyContent.SPACE_AROUND = "space-around";
        return JustifyContent;
    })();
    return JustifyContent;
});
