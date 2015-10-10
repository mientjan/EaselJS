define(["require", "exports"], function (require, exports) {
    /**
     * @enum MeasurementUnitType
     * %|px|pt|in|cm|mm|vw|vh
     */
    var MeasurementUnitType;
    (function (MeasurementUnitType) {
        MeasurementUnitType[MeasurementUnitType["PROCENT"] = 0] = "PROCENT";
        MeasurementUnitType[MeasurementUnitType["PIXEL"] = 1] = "PIXEL";
        MeasurementUnitType[MeasurementUnitType["POINT"] = 2] = "POINT";
        MeasurementUnitType[MeasurementUnitType["INCH"] = 3] = "INCH";
        MeasurementUnitType[MeasurementUnitType["CENTIMETER"] = 4] = "CENTIMETER";
        MeasurementUnitType[MeasurementUnitType["MILLIMETER"] = 5] = "MILLIMETER";
        MeasurementUnitType[MeasurementUnitType["VIEWPORT_WIDTH"] = 6] = "VIEWPORT_WIDTH";
        MeasurementUnitType[MeasurementUnitType["VIEWPORT_HEIGHT"] = 7] = "VIEWPORT_HEIGHT";
    })(MeasurementUnitType || (MeasurementUnitType = {}));
    exports.default = MeasurementUnitType;
});
