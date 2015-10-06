import IHashMap from "../interface/IHashMap";
class Flag<T extends Number>
{
	private value:number = 0;

	private isPowerOfTwo(n:number):boolean
	{
		return n !== 0 && (n & (n - 1)) === 0
	}

	public contains(val:T):boolean
	{
		var n:number = <number> val;
		return (this.value & val) === val;
	}

	public add(val:T):boolean
	{
		this.value |= <number> val;
		return this.contains(val);
	}

	public remove(val:T):boolean
	{
		this.value = (this.value ^ val) & this.value;
		return !this.contains(val);
	}

	public intersect(val:T):boolean
	{
		var final:number = 0;
		for(var i:number = 1; i < max; i = (i << 1))
		{
			if((this.value & i) !== 0 && (val & i) !== 0)
			{
				final += i;
			}
		}
		return final;
	}

	public equals(val:number):boolean
	{
		return this.value === (val + 0);
	}

	public valueOf():number
	{
		return <number> this.value;
	}
}
