import IShaderMaterialOptions = require('./IShaderMaterialOptions');

class ShaderMaterial {

	public data:IShaderMaterialOptions;

	constructor(options:IShaderMaterialOptions){
		this.data = options;
	}
}

export = ShaderMaterial;