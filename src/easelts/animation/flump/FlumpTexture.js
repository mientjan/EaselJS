define(["require", "exports"], function (require, exports) {
    "use strict";
    var FlumpTexture = (function () {
        function FlumpTexture(renderTexture, json) {
            this.type = 2048;
            this.time = 0.0;
            this.name = json.symbol;
            this.renderTexture = renderTexture;
            this.originX = json.origin[0];
            this.originY = json.origin[1];
            this.x = json.rect[0];
            this.y = json.rect[1];
            this.width = json.rect[2];
            this.height = json.rect[3];
        }
        FlumpTexture.prototype.onTick = function (delta) {
        };
        FlumpTexture.prototype.draw = function (ctx) {
            return true;
        };
        FlumpTexture.prototype.reset = function () {
            this.time = 0.0;
        };
        return FlumpTexture;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpTexture;
});
