define(["require", "exports"], function (require, exports) {
    var StageOption = (function () {
        function StageOption(option) {
            this.autoResize = false;
            this.pixelRatio = 1;
            this.autoClear = true;
            this.autoClearColor = null;
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
    })();
    exports.StageOption = StageOption;
});
