import FluidMeasurementsUnit from "./FluidMeasurementsUnit";
//import IResize from "lib/createjs/easeljs/component/interface/IResize";
import CalculationType from "../enum/CalculationType";
import CalculationUnitType from "../enum/CalculationUnitType";
import MeasurementUnitType from "../enum/MeasurementUnitType";


/**
 * @todo add more unit types
 * @class FluidCalculation
 * @author Mient-jan Stelling
 */
class FluidCalculation
{
	/**
	 *
	 */
	private static _calculationUnitType:CalculationUnitType[] = [
		CalculationUnitType.ADDITION,
		CalculationUnitType.SUBSTRACTION,
		CalculationUnitType.MULTIPLICATION,
		CalculationUnitType.DIVISION
	];

	/**
	 * @property _measurementUnitTypeString
	 **/
	private static _measurementUnitTypeString:string[] = [
		'%', 'px', 'pt', 'in', 'cm', 'mm', 'vw', 'vh'
	];

	private static _calculationUnitypeString = '+-*/';

	private static _valueUnitDisolvement:RegExp = /([\+\-]?[0-9\.]+)(%|px|pt|in|cm|mm|vw|vh)?/;
	private static _spaceSplit:RegExp = /\s+/;

	/**
	 *
	 * @method dissolveCalcElements
	 * @param {string[]} statement
	 * @returns {Array}
	 */
	public static dissolveCalcElements(statement:string):Array<FluidMeasurementsUnit|CalculationUnitType>
	{
		statement = statement.replace('*', ' * ').replace('/', ' / ');
		var arr = statement.split(FluidCalculation._spaceSplit);

		var calculationElements = [];
		for(var i = 0; i < arr.length; i++)
		{
			var d = FluidCalculation.dissolveElement(arr[i]);
			calculationElements.push(d);
		}
		return calculationElements;
	}

	/**
	 * @method dissolveElement
	 * @param {String} val
	 * @return ( FluidMeasurementsUnit | CalculationUnitType )
	 * @public
	 * @static
	 */
	public static dissolveElement(val:string):FluidMeasurementsUnit|CalculationUnitType
	{
		var index = FluidCalculation._calculationUnitypeString.indexOf(val);
		if(index >= 0)
		{
			return FluidCalculation._calculationUnitType[index];
		}

		var unit:FluidMeasurementsUnit;
		var match = FluidCalculation._valueUnitDisolvement.exec(val);

		var mesUnitTypeString = match.length >= 3 ? match[2] : MeasurementUnitType[MeasurementUnitType.PIXEL];
		var mesUnitType:MeasurementUnitType = FluidCalculation._measurementUnitTypeString.indexOf(mesUnitTypeString);

		if(match)
		{
			var v = match.length >= 2 ? match[1] : match[0];
			unit = new FluidMeasurementsUnit(FluidCalculation.toFloat(v), mesUnitType)
		}
		else
		{
			unit = new FluidMeasurementsUnit(FluidCalculation.toFloat(val), mesUnitType)
		}

		return unit;
	}

	/**
	 * @method calcUnit
	 * @param size
	 * @param data
	 * @returns {number}
	 */
	public static calcUnit(size:number, data:Array<FluidMeasurementsUnit|CalculationUnitType>):number
	{
		var sizea = FluidCalculation.getCalcUnitSize(size, <FluidMeasurementsUnit> data[0]);

		for(var i = 2, l = data.length; i < l; i = i + 2)
		{
			sizea = FluidCalculation.getCalcUnit(
				sizea,
				<CalculationUnitType> data[i - 1],
				FluidCalculation.getCalcUnitSize(size, <FluidMeasurementsUnit> data[i])
			);
		}

		return sizea;
	}

	/**
	 * Calculates arithmetic on 2 units.
	 *
	 * @author Mient-jan Stelling
	 * @param unit1
	 * @param math
	 * @param unit2
	 * @returns number;
	 */
	public static getCalcUnit(unit1:number, math:CalculationUnitType, unit2:number):number
	{
		var result = 0;
		switch(math)
		{
			case CalculationUnitType.ADDITION:
			{
				result = unit1 + unit2;
				break;
			}

			case CalculationUnitType.SUBSTRACTION:
			{
				result = unit1 - unit2;
				break;
			}

			case CalculationUnitType.MULTIPLICATION:
			{
				result = unit1 * unit2;
				break;
			}

			case CalculationUnitType.DIVISION:
			{
				result = unit1 / unit2;
				break;
			}

			default:
			{
				result = 0;
				break;
			}
		}

		return result;
	}

	/**
	 * @author Mient-jan Stelling
	 * @method getCalculationTypeByValue
	 * @param value {number|string}
	 * @returns {CalculationType}
	 * @public
	 * @static
	 */
	public static getCalculationTypeByValue(value:number|string):CalculationType
	{
		if(typeof(value) == 'string')
		{
			if((<string> value).substr(-1) == '%')
			{
				return CalculationType.PERCENT;
			}
			else
			{
				return CalculationType.CALC;
			}
		}

		return CalculationType.STATIC;
	}

	/**
	 * @author Mient-jan Stelling
	 * @method getCalculationTypeByValue
	 * @param value {number|string}
	 * @returns {CalculationType}
	 * @public
	 * @static
	 */
	public static getPercentageParcedValue(value:string):number
	{
		return parseFloat(value.substr(0, value.length - 1)) / 100;
	}

	/**
	 *
	 * @todo add support for more unit types.
	 *
	 * @author Mient-jan Stelling
	 * @method getCalcUnitSize
	 * @param size
	 * @param data
	 * @returns {number}
	 * @public
	 * @static
	 */
	public static getCalcUnitSize(size:number, data:FluidMeasurementsUnit):number
	{
		var result = 0;
		switch(data.unit)
		{
			case MeasurementUnitType.PROCENT:
			{
				result = size * ( data.value / 100 );
				break;
			}

			default:
			{
				result = data.value;
				break;
			}
		}
		
		return result;
	}

	public static toFloat(value)
	{
		return parseFloat(value) || 0.0;
	}
}

export default FluidCalculation;