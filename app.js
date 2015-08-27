angular.module('beacon-test', [
	'ionic',
	'beacon-test.controllers'
]).config(function ($stateProvider, $urlRouterProvider) {

	console.log('Configuring beacon-test');

	$urlRouterProvider.otherwise('');

}).run(function () {
	console.log('Running beacon-test');

	if (window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}
	if (window.StatusBar) {
		// Set the statusbar to use the default style, tweak this to
		// remove the status bar on iOS or change it to use white instead of dark colors.
		StatusBar.styleDefault();
	}
});

window.ionic.Platform.ready(function () {
	angular.bootstrap(document, ['beacon-test']);
});