/**
 *
 */
class Flag<T>
{
	public value:number = 0;

	public contains(value:number|T)
	{
		var n = <number> value;
		return (this.value & n) === value;
	}

	public add(value:number|T)
	{
		var n = <number> value;
		this.value |= n;
		return this.contains(value);
	}

	public remove(value:number|T)
	{
		var n = <number> value;

		this.value = (this.value ^ n) & this.value;
		return !this.contains(value);
	}

	public equals(value:number|T)
	{
		var n = <number> value;
		return this.value === (n + 0);
	}

	public valueOf():number
	{
		return this.value;
	}

}
export default Flag;
