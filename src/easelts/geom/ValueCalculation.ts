import FluidMeasurementsUnit = require('./FluidMeasurementsUnit');
import FluidCalculation = require('./FluidCalculation');

import CalculationType = require('../enum/CalculationType');
import CalculationUnitType = require('../enum/CalculationUnitType');
import MeasurementUnitType = require('../enum/MeasurementUnitType');


/**
 * @todo add more unit types
 * @class ValueCalculation
 * @author Mient-jan Stelling
 */
class ValueCalculation
{
	public type:CalculationType = CalculationType.UNKOWN;

	private _value:number;

	protected _value_percent:number = 0;

	/**
	 * @property _value_calc
	 * @type {Array<FluidMeasurementsUnit|CalculationUnitType>}
	 * @protected
	 */
	protected _value_calc:Array<FluidMeasurementsUnit|CalculationUnitType> = null;

	constructor(value:number|string)
	{
		this.set(value);
	}

	/**
	 * @method determineCalculationType
	 * @param {number|string} value
	 * @returns {CalculationType}
	 */
	public determineCalculationType(value:number|string):CalculationType
	{
		var subValue = value;
		var result:CalculationType = CalculationType.STATIC;
		if(typeof subValue == 'string'){
			if((<string>subValue).substr(-1) == '%'){
				result =  CalculationType.PERCENT;
			} else {
				result =  CalculationType.CALC;
			}
		}
		return result;
	}

	/**
	 * @method get
	 * @param {number} relativeValue
	 * @returns {number}
	 */
	public get(relativeValue:number):number
	{
		var value = 0;
		var scopeValue = relativeValue;

		if( this.type == CalculationType.PERCENT ){
			value = this._value * scopeValue;
		} else if( this.type == CalculationType.CALC ){
			value = FluidCalculation.calcUnit(scopeValue, this._value_calc);
		} else if( this.type == CalculationType.STATIC ){
			value = this._value;
		}

		return value;
	}

	/**
	 *
	 * @param value
	 */
	public set(value:number|string)
	{
		var numberValue:number = <number> value;
		var stringValue:string = <string> value;

		this.type = this.determineCalculationType(value);

		if( this.type == CalculationType.PERCENT ){
			this._value_percent = parseFloat(stringValue.substr(0, stringValue.length - 1)) / 100;
		} else if( this.type == CalculationType.CALC ){
			this._value_calc = FluidCalculation.dissolveCalcElements( stringValue );
		} else if( this.type == CalculationType.STATIC ){
			this._value = numberValue;
		}
	}
}

export = ValueCalculation;