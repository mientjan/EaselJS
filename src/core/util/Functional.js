define(["require", "exports"], function (require, exports) {
    var Functional = (function () {
        function Functional() {
        }
        return Functional;
    })();
    function debounce(callback, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout = -1;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var self = this;
            var callbackLater = function () {
                timeout = -1;
                callback.apply(self, args);
            };
            var now = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(callbackLater, wait);
            if (now) {
                callback.apply(self, args);
            }
        };
    }
    exports.debounce = debounce;
    function throttle(callback, threshhold, scope) {
        var last, timer = -1;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var context = scope || this;
            var now = +new Date();
            if (last && now < last + threshhold) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    callback.apply(context, args);
                }, threshhold);
            }
            else {
                last = now;
                callback.apply(context, args);
            }
        };
    }
    exports.throttle = throttle;
});
