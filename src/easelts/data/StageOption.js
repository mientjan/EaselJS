define(["require", "exports"], function (require, exports) {
    "use strict";
    var StageOption = (function () {
        function StageOption(option) {
            this.autoResize = true;
            this.pixelRatio = 1;
            this.transparent = true;
            this.autoClear = true;
            this.autoClearColor = '#000000';
            for (var name in option) {
                if (this.hasOwnProperty(name)) {
                    var value;
                    switch (name) {
                        case 'pixelRatio': {
                            value = option[name] | 0;
                            break;
                        }
                        default: {
                            value = option[name];
                            break;
                        }
                    }
                    this[name] = value;
                }
            }
        }
        return StageOption;
    }());
    exports.StageOption = StageOption;
});
