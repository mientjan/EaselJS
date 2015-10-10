define(["require", "exports", "./FluidCalculation"], function (require, exports, FluidCalculation_1) {
    /**
     * @todo add more unit types
     * @class ValueCalculation
     * @author Mient-jan Stelling
     */
    var ValueCalculation = (function () {
        function ValueCalculation(value) {
            this.type = 0 /* UNKOWN */;
            this._value_percent = 0;
            /**
             * @property _value_calc
             * @type {Array<FluidMeasurementsUnit|CalculationUnitType>}
             * @protected
             */
            this._value_calc = null;
            this.set(value);
        }
        /**
         * @method determineCalculationType
         * @param {number|string} value
         * @returns {CalculationType}
         */
        ValueCalculation.prototype.determineCalculationType = function (value) {
            var subValue = value;
            var result = 2 /* STATIC */;
            if (typeof subValue == 'string') {
                if (subValue.substr(-1) == '%') {
                    result = 1 /* PERCENT */;
                }
                else {
                    result = 3 /* CALC */;
                }
            }
            return result;
        };
        /**
         * @method get
         * @param {number} relativeValue
         * @returns {number}
         */
        ValueCalculation.prototype.get = function (relativeValue) {
            var value = 0;
            var scopeValue = relativeValue;
            if (this.type == 1 /* PERCENT */) {
                value = this._value * scopeValue;
            }
            else if (this.type == 3 /* CALC */) {
                value = FluidCalculation_1.default.calcUnit(scopeValue, this._value_calc);
            }
            else if (this.type == 2 /* STATIC */) {
                value = this._value;
            }
            return value;
        };
        /**
         *
         * @param value
         */
        ValueCalculation.prototype.set = function (value) {
            var numberValue = value;
            var stringValue = value;
            this.type = this.determineCalculationType(value);
            if (this.type == 1 /* PERCENT */) {
                this._value_percent = parseFloat(stringValue.substr(0, stringValue.length - 1)) / 100;
            }
            else if (this.type == 3 /* CALC */) {
                this._value_calc = FluidCalculation_1.default.dissolveCalcElements(stringValue);
            }
            else if (this.type == 2 /* STATIC */) {
                this._value = numberValue;
            }
        };
        return ValueCalculation;
    })();
    exports.default = ValueCalculation;
});
