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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpLabelData;
});
