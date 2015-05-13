module.exports = function(grunt)
{
	
	grunt.initConfig({
		ts: {
			options: {
				comments: false,
				compile: true,
				module: 'amd',
				target: 'es5',
				sourceMap: false

			},
			default: {

				src: [
					"!../../**/webgl.d.ts", "../../src/**/*.ts"
				]
			}
		}
	});
	grunt.loadNpmTasks("grunt-ts");
	grunt.registerTask("default", ["ts"]);
};