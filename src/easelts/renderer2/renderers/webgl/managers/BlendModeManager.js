var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var BlendModeManager = (function (_super) {
        __extends(BlendModeManager, _super);
        function BlendModeManager(renderer) {
            _super.call(this, renderer);
            this.currentBlendMode = 99999;
        }
        BlendModeManager.prototype.setBlendMode = function (blendMode) {
            if (this.currentBlendMode === blendMode) {
                return false;
            }
            this.currentBlendMode = blendMode;
            var mode = this.renderer.blendModes[this.currentBlendMode];
            this.renderer.gl.blendFunc(mode[0], mode[1]);
            return true;
        };
        return BlendModeManager;
    }(WebGLManager));
    exports.BlendModeManager = BlendModeManager;
});
