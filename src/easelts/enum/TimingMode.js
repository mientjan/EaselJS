define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (TimingMode) {
        TimingMode[TimingMode["TIMEOUT"] = 0] = "TIMEOUT";
        TimingMode[TimingMode["RAF"] = 1] = "RAF";
        TimingMode[TimingMode["RAF_SYNCHED"] = 2] = "RAF_SYNCHED";
    })(exports.TimingMode || (exports.TimingMode = {}));
    var TimingMode = exports.TimingMode;
});
