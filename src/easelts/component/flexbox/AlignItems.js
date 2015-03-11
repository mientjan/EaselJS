/**
 * Created by pieters on 11-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var AlignItems = (function () {
        function AlignItems() {
        }
        AlignItems.FLEX_START = "flex-start";
        AlignItems.CENTER = "center";
        AlignItems.FLEX_END = "flex-end";
        AlignItems.STRETCH = "stretch";
        return AlignItems;
    })();
    return AlignItems;
});
