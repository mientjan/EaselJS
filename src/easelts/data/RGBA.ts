class RGBA
{
	constructor(public r:number = 0.0, public g:number = 0.0, public b:number = 0.0, public a:number = 0.0)
	{

	}

	public toString()
	{
		return 'rgba(' + this.r + ',' + this.g + ','
		this.b + ',' + this.a + ')';
	}
}

export = RGBA;