define(["require", "exports"], function (require, exports) {
    "use strict";
    var FluidMeasurementsUnit = (function () {
        function FluidMeasurementsUnit(value, unit) {
            this.value = value;
            this.unit = unit;
        }
        return FluidMeasurementsUnit;
    }());
    exports.FluidMeasurementsUnit = FluidMeasurementsUnit;
});
