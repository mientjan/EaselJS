define(["require", "exports"], function (require, exports) {
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.clamp = function (x, a, b) {
            return (x < a) ? a : ((x > b) ? b : x);
        };
        MathUtil.clampBottom = function (x, a) {
            return x < a ? a : x;
        };
        MathUtil.mapLinear = function (x, a1, a2, b1, b2) {
            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        };
        MathUtil.smoothStep = function (x, min, max) {
            if (x <= min) {
                return 0;
            }
            if (x >= max) {
                return 1;
            }
            x = (x - min) / (max - min);
            return x * x * (3 - 2 * x);
        };
        MathUtil.smootherStep = function (x, min, max) {
            if (x <= min) {
                return 0;
            }
            if (x >= max) {
                return 1;
            }
            x = (x - min) / (max - min);
            return x * x * x * (x * (x * 6 - 15) + 10);
        };
        MathUtil.lerp = function (fromValue, toValue, alpha) {
            fromValue += (toValue - fromValue) * alpha;
            return fromValue;
        };
        MathUtil.random16 = function () {
            return (65280 * Math.random() + 255 * Math.random()) / 65535;
        };
        MathUtil.randInt = function (low, high) {
            return low + Math.floor(Math.random() * (high - low + 1));
        };
        MathUtil.randFloat = function (low, high) {
            return low + Math.random() * (high - low);
        };
        MathUtil.randFloatSpread = function (range) {
            return range * (0.5 - Math.random());
        };
        MathUtil.degToRad = function (degrees) {
            return degrees * MathUtil.degreeToRadiansFactor;
        };
        MathUtil.radToDeg = function (radians) {
            return radians * MathUtil.radianToDegreesFactor;
        };
        MathUtil.isPowerOfTwo = function (value) {
            return (value & (value - 1)) === 0 && value !== 0;
        };
        MathUtil.degreeToRadiansFactor = Math.PI / 180;
        MathUtil.radianToDegreesFactor = 180 / Math.PI;
        return MathUtil;
    })();
    return MathUtil;
});
