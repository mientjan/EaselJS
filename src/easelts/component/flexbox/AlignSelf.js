/**
 * Created by pieters on 11-Mar-15.
 */
define(["require", "exports"], function (require, exports) {
    var AlignSelf = (function () {
        function AlignSelf() {
        }
        AlignSelf.FLEX_START = "flex-start";
        AlignSelf.CENTER = "center";
        AlignSelf.FLEX_END = "flex-end";
        AlignSelf.STRETCH = "stretch";
        return AlignSelf;
    })();
    return AlignSelf;
});
