# Node Webkit Application Initializer

[![Dependency Status](https://david-dm.org/CloudKidStudio/nw-init.svg)](https://david-dm.org/CloudKidStudio/nw-init)

Node plugin for creating scaffolding necessary to start a new node-webkit application. This creates the project structure need to build Windows and OSX Applications. It also will package your application into a sexy and simple setup installer DMG or EXE. Initialized application automatically include [Bootstrap](http://getbootstrap.com/) and [JQuery](http://jquery.com).

## Installing

Install this node module globally.

```bash
npm install -g nw-init
```

## Usage

Give a path to the new project folder. If no path is set, it will install in the current working directory.

```bash
nw-init ~/Desktop/MyNewApp
```

## Dependencies

In order to build your new application, there are some external global dependencies that are required.

### grunt

Grunt is required to build. See the [getting started guide](http://gruntjs.com/getting-started).

```bash
npm install -g grunt-cli
```

### makensis

[makensis](http://nsis.sourceforge.net/Main_Page) is required to create the Windows setup executable. Can be installed with [brew](http://brew.sh/):

```bash
brew install makensis
```

### appdmg

[node-appdmg](https://github.com/LinusU/node-appdmg) is required to create the OS X DMG installer image.

```bash
npm install -g appdmg
```

### wine 

On OSX if building for Windows, Wine needs to be installed to create the application icon. Can be installed with [brew](http://brew.sh/)

```bash
brew install wine
```

## Building

The Grunt project is an extension of the [grunt-game-builder](https://github.com/CloudKidStudio/grunt-game-builder) and all those grunt tasks can be used on your app. In addition, there are several Grunt tasks that are specific and useful to building your node-webkit application:

Task | Description
---|---
**app** | Builds a release version of the node-webkit app
**app-debug** | Builds a debug version of the node-webkit app
**package** | Create the OSX and Windows installers
**open** | Open the OSX application

### Examples

Build the application in debug mode and run:

```bash
grunt app-debug open
```

Build the release application and package to installers:

```bash
grunt app package
```

## Conditional Compiling

In addition to `grunt-game-builder`'s `DEBUG` and `RELEASE` condititional constants for JavaScript, applications created with nw-init support `APP` and `WEB`.

```js

if (APP)
{
	// Only app builds will show this code
	var fs = require('fs');
	fs.readFile('data.json', function(err, data){
		data = JSON.parse(data);
		// load a json file with node
	});
}

if (WEB)
{
	// Only default builds, like grunt tasks 'build' and 'build:dev'
	$.getJSON('data.json', function(data){
		// load a json file with jQuery
	});
}
```

## Examples

* [RemoteTrace](https://github.com/CloudKidStudio/RemoteTrace)
* [CaptionCreator](https://github.com/CloudKidStudio/CaptionCreator)

##License

MIT License
