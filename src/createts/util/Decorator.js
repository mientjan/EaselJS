define(["require", "exports", "./Functional"], function (require, exports, Functional) {
    var Decorator = (function () {
        function Decorator() {
        }
        return Decorator;
    })();
    function log(name) {
        if (name === void 0) { name = ''; }
        return function (target, propertyKey, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log('log|in:', propertyKey, '|' + name, JSON.stringify(args));
                var result = originalMethod.apply(this, args);
                console.log('log|out:', propertyKey, '|' + name, JSON.stringify(args));
                return result;
            };
            return descriptor;
        };
    }
    exports.log = log;
    function debounce(wait) {
        return function (target, propertyKey, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = Functional.debounce(originalMethod, wait);
            return descriptor;
        };
    }
    exports.debounce = debounce;
    function throttle(threshhold) {
        return function (target, propertyKey, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = Functional.throttle(originalMethod, threshhold, target);
            return descriptor;
        };
    }
    exports.throttle = throttle;
    function readonly(target, key, descriptor) {
        descriptor.writable = false;
    }
    exports.readonly = readonly;
    function enumerable(value) {
        if (value === void 0) { value = false; }
        return function (target, key, descriptor) {
            descriptor.enumerable = value;
        };
    }
    exports.enumerable = enumerable;
    function configurable(value) {
        if (value === void 0) { value = false; }
        return function (target, key, descriptor) {
            descriptor.configurable = value;
        };
    }
    exports.configurable = configurable;
});
