(function(undefined){

	// Import classes
	var NodeWebkitApp = cloudkid.NodeWebkitApp;

	/**
	*  Node Webkit Application
	*  @class _AppName_
	*  @extends cloudkid.NodeWebkitApp
	*/
	var _AppName_ = function()
	{
		NodeWebkitApp.call(this);

		if (APP)
		{
			// Create the standard OSX menu
			if (process.platform === "darwin")
			{	
				var gui = require('nw.gui');
				var menu = new gui.Menu({ type: 'menubar' });
				menu.createMacBuiltin("_AppName_");
				gui.Window.get().menu = menu;
			}
		}
	};

	// Reference to the prototype
	var p = _AppName_.prototype = Object.create(NodeWebkitApp.prototype);

	/**
	*  Called when the application is quit. Should do any cleanup here to be safe.
	*  @method close
	*/
	p.close = function()
	{

	};

	// Assign to namespace
	namespace("_namespace_")._AppName_ = _AppName_;

}());