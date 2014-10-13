module.exports = function(grunt)
{
	var path = require('path'),
		_ = require('lodash');

	// Combine the game builder and current project
	// configs into one object
	grunt.initConfig(_.extend(

		// Setup the default game tasks
		require('grunt-game-builder')(grunt, { autoInit: false }), 

		// Setup the current project tasks
		require('load-grunt-config')(grunt, {
			// The path for the tasks
			configPath: path.join(process.cwd(), 'tasks'),
			autoInit: false, 

			// We don't want to reload builder
			loadGruntTasks: { pattern: [
				'grunt-*', 
				'!grunt-game-builder'
			] },

			// Share the deploy folder with the tasks
			data: { 
				buildDir : './build',
				installerDir : './installer'
			}
		})
	));
};