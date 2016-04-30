define(["require", "exports"], function (require, exports) {
    "use strict";
    var FlumpLabelData = (function () {
        function FlumpLabelData(label, index, duration) {
            this.label = label;
            this.index = index;
            this.duration = duration;
        }
        return FlumpLabelData;
    }());
    exports.FlumpLabelData = FlumpLabelData;
});
