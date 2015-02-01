#!/usr/bin/env node

// Include needed packages
var prompt = require('prompt'),
	fs = require('fs'),
	path = require('path'),
	replace = require('replace'),
	glob = require("glob"),
	latest = require('latest'),
	mkdirp = require('mkdirp').sync,

	// The package json info
	p = require('./package.json'),

	// The result from the commandline prompting
	promptResult = {},

	// The folder where we will install to
	// can either use the first argument or the current directory
	destFolder = path.resolve(process.argv[2] || "."),

	// The folder for the template source files
	sourceFolder = path.join(__dirname, 'template_source');

// We'll do this once we publish to check for a new version
// latest.checkupdate(p, function(code, message){
// 	console.log(message);
// 	(code === 0) ? start() : process.exit(code);
// });
start();

/**
*  Start by asking the user for their choices
*  @method start
*/
function start()
{
	// Create the folder if it doesn't exist
	if (!fs.existsSync(destFolder))
	{
		mkdirp(destFolder);
	}

	var files = fs.readdirSync(destFolder);

	if (files.length > 1)
	{
		console.error("Please only run this on an empty folder.".red);
		process.exit(1);
	}

	// Start the prompt
	prompt.start();

	// Get properties from the user
	var schema = {
		properties:
		{
			appName:
			{
				description: "App name".magenta,
				type: 'string',
				default: 'MyApp',
				pattern: /^[a-zA-Z0-9]+$/,
				message: 'App name must be only letters/numbers',
				required: true
			},
			appDescription:
			{
				description: "App description".magenta,
				type: 'string',
				default: '',
				required: false
			},
			appNamespace:
			{
				description: "App namespace".magenta,
				type: 'string',
				default: 'myapp',
				pattern: /^[a-zA-Z0-9]+$/,
				message: 'Namespace must be only letters/numbers',
				required: true
			},
			githubRepo: 
			{
				description: "GitHub repository URL".magenta,
				type: 'string',
				default: 'https://github.com/username/MyApp',
				pattern: /^https\:\/\/github\.com\/[a-zA-Z0-9\-\_]+\/[a-zA-Z0-9\-\_]+$/,
				message: 'Must be a valid repository URL',
				require: true
			},
			authorName:
			{
				description: "Name of author".magenta,
				type: 'string',
				default: 'MyCompany',
				pattern: /^[a-zA-Z0-9\_\-]+$/,
				message: 'Author name must be only letters/numbers',
				require: true
			}
		}
	};

	prompt.get(schema, function(err, result){
		promptResult = result;
		copyFilesToDestination();
	});
}

/**
*  After we have asked the user for their choices, 
*  we copy the files in to place
*  @method  copyFilesToDestination
*/
function copyFilesToDestination()
{
	//ncp is a recursive copy
	var ncp = require('ncp').ncp;

	ncp(sourceFolder, destFolder, function(err){
		if (err)
		{
			console.error(("Error copying:" + err).red);
			process.exit(1);
		}
		console.info("Done copying files.".cyan);
		doSearchAndReplace();
	});
}

/**
*  To a a search in replace on the files 
*  @method doSearchAndReplace 
*/
function doSearchAndReplace()
{
	console.info("Search and replace...".cyan);

	// now do a search and replace
	// first replace IN files

	var replaceObj = {
		"_AppName_": promptResult.appName,
		"_AuthorName_" : promptResult.authorName,
		"_AppDescription_" : promptResult.appDescription,
		"_namespace_": promptResult.appNamespace,
		"_githubRepo_" : promptResult.githubRepo
	};

	//text in files
	var searchString;
	var replaceString;

	for (searchString in replaceObj)
	{
		replaceString = replaceObj[searchString];
		replace({
			regex: searchString,
			replacement: replaceString,
			paths: [destFolder],
			recursive: true,
			silent: true
		});
	}

	console.info("Done searching in files.".cyan);

	var dir;
	var filename;
	var newFilename;

	// now folder names (we have to do folders and file 
	// as two separate operations due to the issue of 
	// renaming a file's parent folder)
	var pattern = destFolder + "/**/*/";
	glob(pattern, function(err, files){
		processGlob(files, replaceObj);

		//now file names
		pattern = destFolder + "/**/*";
		glob(pattern, function(err, files){
			processGlob(files, replaceObj);
			setupDone();
		});
	});
}

/**
 * takes an array of files and a dictionary of {search: replace}
 * and renames the files it finds whose name contains the key
 * @method  processGlob
 * @param  {Array} files      Array of files from a glob pattern
 * @param  {Object} replaceObj Associative array of {searchString: replaceString}
 */
function processGlob(files, replaceObj)
{
	files.forEach(function(file) {
		var dir = path.dirname(file);
		var filename = path.basename(file);

		for (var searchString in replaceObj)
		{
			var replaceString = replaceObj[searchString];
			if (filename.indexOf(searchString) > -1)
			{
				var newFilename = filename.replace(searchString, replaceString);
				fs.renameSync(file, dir + "/" + newFilename);
			}
		}
	});
}

/**
*  The initial setup of the project is complete, everything
*  from here on out should be good, but we'll try to do 
*  an npm install anyways.
*  @method setupDone
*/
function setupDone()
{
	var cwd = process.cwd();
	process.chdir(destFolder);

	var npm = require("npm");
	npm.load(function(err){

		// Check for errors
		if (err)
		{
			process.chdir(cwd);
			console.log(err.red);
			process.exit(1);
		}

		// Install packages in package.json
		npm.commands.install([], function(){
			process.chdir(cwd);
			console.info("Setup done.".cyan);
			process.exit();
		});

		npm.registry.log.on("log", function(result){
			// log the progress of the installation
			if (typeof result == "object")
			{
				switch(result.level)
				{
					case 'warn': 
						console.log(result.message.yellow);
						break;
					case 'error':
						console.log(result.message.red);
						break;
					case 'http':
						console.log(result.message.green);
						break;
				}
			}
			else
			{
				console.log(result);
			}
		});
	});
}