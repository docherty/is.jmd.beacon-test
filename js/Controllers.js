// JMD iBeacon test
angular.module('beacon-test.controllers', [])
    .controller('MainCtrl', ['$scope', '$window', function ($scope, $window) {
        //console.log('MainCtrl is loaded.');
        $scope.demoUrl = "";
        $scope.demoCount = 0;

        // functions called by UI buttons
        $scope.startMonitoring = function () {
            for (i = 0; i < $scope.beaconRegions.length; i++) {
                var beaconRegion = $window.cordova.plugins.locationManager.Regions.fromJson($scope.beaconRegions[i]);
                $window.cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                    .fail(function () {
                        console.log(JSON.stringify(error))
                    })
                    .done($scope.monitoring = true);
            }
        };

        $scope.stopMonitoring = function () {
            for (i = 0; i < $scope.beaconRegions.length; i++) {
                var beaconRegions = $window.cordova.plugins.locationManager.Regions.fromJson($scope.beaconRegions[i]);
                $window.cordova.plugins.locationManager.stopMonitoringForRegion(beaconRegions)
                    .fail(function () {
                        console.log(JSON.stringify(error))
                    })
                    .done($scope.monitoring = false);
            }
        };

        $scope.fetchImg = function () {
            // set the URL for testing (a random big image)
            if ($scope.demoCount === 0) {
                $scope.demoUrl = "http://cctv-africa.com/wp-content/uploads/2015/05/BIGCAT.jpg";
                $scope.demoCount = 1;
            } else {
                $scope.demoUrl = "https://upload.wikimedia.org/wikipedia/commons/6/6b/Big_Sur_June_2008.jpg";
                $scope.demoCount = 0;
            }
            $scope.status = "Fetching..." + $scope.demoUrl;
        };

        /*************************
         Initialize some stuff
         **************************/
        $scope.resetStuff = function () {
            // a variable to update the UI with messages
            $scope.status = "";
            $scope.pingCount = 0;

            // set up an array of beacon region objects
            $scope.beaconRegions = [
                {
                    'uuid': '1FFC3175-ECEE-4D63-BEB7-470431B12FED',
                    'identifier': 'A',
                    'major': 1,
                    'minor': 1,
                    'typeName': 'BeaconRegion'
                },
                {
                    'uuid': '1FFC3175-ECEE-4D63-BEB7-470431B12FED',
                    'identifier': 'B',
                    'major': 1,
                    'minor': 2,
                    'typeName': 'BeaconRegion'
                },
                {
                    'uuid': '1FFC3175-ECEE-4D63-BEB7-470431B12FED',
                    'identifier': 'C',
                    'major': 1,
                    'minor': 3,
                    'typeName': 'BeaconRegion'
                }
            ];
        };

        // helper function to get the index from an object's property
        // example: var data = myArray[myArray.getIndexFromValue("key", "value")];

        Array.prototype.getIndexFromValue = function (name, value) {
            for (var i = 0; i < this.length; i++) {
                if (this[i][name] == value) {
                    return i;
                }
            }
        };

        window.ionic.Platform.ready(function () {
            //console.log("Cordova Plugins ready");
            $scope.resetStuff();
            $window.cordova.plugins.locationManager.enableDebugNotifications();

            // ask iOS 8 for permission
            $window.cordova.plugins.locationManager.requestAlwaysAuthorization();

            // set the delegate
            delegate = new $window.cordova.plugins.locationManager.Delegate();
            $window.cordova.plugins.locationManager.setDelegate(delegate);

            delegate.didDetermineStateForRegion = function (pluginResult) {
                console.log("didDetermineStateForRegion: " + pluginResult.region.identifier + " -> " + pluginResult.state + " :: " + JSON.stringify(pluginResult));
            };

            delegate.didStartMonitoringForRegion = function (pluginResult) {
                console.log("Monitoring:" + pluginResult.region.identifier);
            };

            delegate.didEnterRegion = function (pluginResult) {
                console.log("didEnterRegion: " + pluginResult.region.identifier);
            };

            delegate.didExitRegion = function (pluginResult) {
                console.log("didExitRegion: " + pluginResult.region.identifier);
            };

            delegate.didRangeBeaconsInRegion = function (pluginResult) {

                // There must be a beacon within range.
                if (pluginResult.beacons.length === 0) {
                    //console.log(JSON.stringify(pluginResult));
                    return;
                } else {
                    //console.log(pluginResult.beacons[0].major +" : "+ pluginResult.beacons[0].minor +" -> "+pluginResult.beacons[0].proximity);
                    for (var i = 0; i < $scope.beaconRegions.length; i++) {
                        if ($scope.beaconRegions[i].uuid == pluginResult.beacons[0].uuid.toLowerCase() && $scope.beaconRegions[i].major == pluginResult.beacons[0].major && $scope.beaconRegions[i].minor == pluginResult.beacons[0].minor) {
                            $scope.$apply($scope.beaconRegions[i].proximity = pluginResult.beacons[0].proximity);
                        }
                    }
                }
            };

            // update the UI
            $scope.loaded = true;
            var tgt = angular.element(document.querySelector('.hidden'));
            tgt.css({'display': 'block'});

        }); // end of window.ionic.Platform.ready
    }]);