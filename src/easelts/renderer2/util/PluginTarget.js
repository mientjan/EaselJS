define(["require", "exports"], function (require, exports) {
    "use strict";
    var PluginTarget = (function () {
        function PluginTarget() {
        }
        PluginTarget.mixin = function (obj) {
            obj.__plugins = {};
            obj.registerPlugin = function (pluginName, ctor) {
                obj.__plugins[pluginName] = ctor;
            };
            obj.prototype.initPlugins = function () {
                this.plugins = this.plugins || {};
                for (var o in obj.__plugins) {
                    this.plugins[o] = new (obj.__plugins[o])(this);
                }
            };
            obj.prototype.destroyPlugins = function () {
                for (var o in this.plugins) {
                    this.plugins[o].destroy();
                    this.plugins[o] = null;
                }
                this.plugins = null;
            };
        };
        return PluginTarget;
    }());
    exports.PluginTarget = PluginTarget;
});
