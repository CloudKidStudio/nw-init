module.exports = {
	css: {
		files: [
			'<%= project.css.main %>',
			'<%= project.file %>',
			'src/less/**/*.less'
		],
		tasks: [
			'less:development'
		]
	}
};