var app = angular.module('ionicApp', ['ionic', 'ngCordova'])

	app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
	//disable caching
	$ionicConfigProvider.views.maxCache(0);
	$stateProvider
		.state('login',{
			url: '/login',
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl'
		})
		.state('home',{
			url: '/home',
			templateUrl: 'templates/home.html',
			controller: 'HomeCtrl'
		})
		.state('map',{
			url: '/map',
			templateUrl: 'templates/map.html',
			controller: 'MapCtrl',
			cache: false
		})
		.state('site',{
			url: '/site',
                        templateUrl: 'templates/site.html',
                        controller: 'SiteCtrl'
		})
		.state('collect',{
			url: '/collect',
			templateUrl: 'templates/collect.html',
			controller: 'CollectCtrl'
		})
		.state('view',{
			url: '/view',
			templateUrl: 'templates/view.html',
			controller: 'ViewCtrl'
		})
		.state('create_user',{
			url: '/create_user',
			templateUrl: 'templates/create_user.html',
			controller: 'LoginCtrl'
		})
		.state('reset_password',{
			url: '/reset_password',
		templateUrl: 'templates/reset_password.html',
			controller: 'LoginCtrl'
		})
		.state('admin',{
			url: '/admin',
			templateUrl: 'templates/admin.html',
			controller: 'AdminCtrl'
		})
		.state('create_project',{
			url: '/create_project',
			templateUrl: 'templates/create_project.html',
			controller: 'CreateProjectCtrl'
		})
		.state('assign_to_project',{
			url: '/assign_to_project',
			templateUrl: 'templates/assign_to_project.html',
			controller: 'AssignToProjectCtrl'
		})
		.state('create_site',{
			url: '/create_site',
			templateUrl: 'templates/create_site.html',
			controller: 'CreateSiteCtrl'
		})
		.state('assign_to_site',{
			url: '/assign_to_site',
			templateUrl: 'templates/assign_to_site.html',
			controller: 'AssignToSiteCtrl'
		})
	$urlRouterProvider.otherwise('/login')
	
	window.localStorage.setItem("admin", "false");
	
	if(ionic.Platform.isWindowsPhone() || ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
		setTimeout(function(){
			navigator.splashscreen.hide();
		}, 1000);
	}else{
		window.localStorage.setItem("admin", "true");
	}
	
})

	app.run(function($ionicPlatform, $state) {

		$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins.Keyboard) {
			     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if(window.StatusBar) {
			     StatusBar.styleDefault();
			}
			var loggedInUser = window.localStorage.getItem('loggedInUser');
			if(loggedInUser != null){
				$state.go('home');	
			}
		});
	})

	app.controller('CreateProjectCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createProjectService){

		console.log("In CreateProjectCtrl");
	});

app.controller('CreateSiteCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createSiteService, projectService){

	console.log("In CreateSiteCtrl");
	$scope.user = {};
	$scope.create_site = {};
	$scope.user.id = window.localStorage.getItem("userId");
	
	$scope.showSpinner = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});
	};
	
	$scope.goBack = function(){ $state.go('admin'); }
	$scope.hideSpinner = function(){ $ionicLoading.hide(); };

	$scope.current_project = projectService.getCurrentProject();
	$scope.createSite = function(){
		
		$scope.showSpinner();
			
		var site = {
			name: $scope.create_site.name,
			description: $scope.create_site.descr,
			lat: $scope.create_site.site_lat,
			lon: $scope.create_site.site_lon,
			project_uid: $scope.current_project.id
		};
		console.log("Attempting to add site: ", site);

		var request = $http({
			method: "post",
			url: 'http://sciencetap.us/ionic/createSite.php',
			data:{ uploadData: site }
		});
		request.success(function(data){
			$scope.hideSpinner();
			console.log("Create Site Success");
			$state.go('view');
		});
		request.error(function(data){
			$scope.hideSpinner();
			console.log("Error creating site");
			console.log(data);
		});
	};
});

app.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, LoginService, $ionicScrollDelegate){
	$scope.data = {};
	$scope.newUserFirstName = '';
	$scope.newUserLastName = '';
	$scope.newUserEmail = '';
	$scope.newUserPhone = '';
	$scope.resetEmail = '';
	$scope.loginDisabled = false;

	$scope.showSpinner = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});
	};

	$scope.hideSpinner = function(){ $ionicLoading.hide(); };
	$scope.scrollTop = function(){ $ionicScrollDelegate.scrollTop(); };
	$scope.createUser = function(){ $state.go('create_user'); }
	$scope.openResetPassword = function(){ $state.go('reset_password'); }

	$scope.login = function(){
		LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data){
			$scope.showSpinner();
			$scope.loginDisabled = true;
			var request = $http({
			    method: "post",
			    url: 'http://sciencetap.us/ionic/login.php',
			    data:{
				emailLogin: $scope.data.username,
				passLogin: $scope.data.password
			    }
			});
			request.success(function(data){
				if (data.Status == 'Success'){
					window.localStorage.setItem("userId", data.userId);
					window.localStorage.setItem("firstName", data.firstName);
					window.localStorage.setItem("lastName", data.lastName);
					window.localStorage.setItem("email", data.email);
					window.localStorage.setItem("phone", data.phone);
					if(data.superAdmin === undefined){
						if(data.projectAdmin === undefined){
							window.localStorage.setItem("role", 'projectUser');
						}else{
							window.localStorage.setItem("role", 'projectAdmin');
						}	
					}else{
						window.localStorage.setItem("role", 'superAdmin');
					}
					if(data.Message === undefined){
						window.localStorage.setItem("message", '');
					}else{
						window.localStorage.setItem("message", data.Message);
					}
					window.localStorage.setItem('loggedInUser', true);
					$scope.hideSpinner();
					$scope.loginDisabled = false;
					$scope.data.password = '';
					$state.go('home');
				}else{
					$scope.data.password = '';
					$scope.hideSpinner();
					var alertPopup = $ionicPopup.alert({
					    title: 'Login failed',
					    template: 'Please check your credentials'
					});
					$scope.loginDisabled = false;
				}
			});
			request.error(function(){
				$scope.data.password = '';
				$scope.hideSpinner();
				$scope.loginDisabled = false;
			});
		}).error(function(){
			$scope.data.password = '';
			$scope.hideSpinner();
			var alertPopup = $ionicPopup.alert({
			    title: 'Login failed',
			    template: 'Please check your credentials'
			});
			$scope.loginDisabled = false;
		});
	}

	var mainPopup = function(title, message){
		var popup = $ionicPopup.alert({
			title: title,
			template: message
		});
		popup.then(function(res){
			console.log("main popup closed");
		});
	};

	$scope.resetPassword = function(){
		$scope.showSpinner();
		console.log($scope.resetEmail);
		if($scope.resetEmail == ""){
			$scope.hideSpinner();
			mainPopup('A required field was not entered','');
			return;
		}
		var uploadData = {
			email : $scope.resetEmail
		};
		var request = $http({
		    method: "post",
		    url: 'http://sciencetap.us/ionic/resetPassword.php',
		    data:{
			uploadData: uploadData 
		    }
		});
		request.success(function(data){
			console.log(data);
			if(data.Status == 'Success'){
				setTimeout(function(){
					$scope.hideSpinner();
					mainPopup('Data Submitted Successfully','An email has been sent with the new password');
				}, 1000);
				$state.go('login');
			}else{
				setTimeout(function(){
					$scope.hideSpinner();
					mainPopup('Data Not Submitted Successfully', 'No Sciencetap account has been created with that email address');
				}, 1000);
				$state.go('login');
			}
		});
		request.error(function(data){
			console.log(data);
			setTimeout(function(){
				$scope.hideSpinner();
				mainPopup('Data Not Submitted Successfully', 'No Sciencetap account has been created with that email address');
			}, 1000);
			$state.go('login');
		});
	}
	$scope.submitNewUser = function(){
		$scope.showSpinner();
		console.log($scope.newUserFirstName);
		console.log($scope.newUserLastName);
		console.log($scope.newUserEmail);
		if($scope.newUserFirstName == "" || $scope.newUserLastName == "" || $scope.newUserEmail == ""){
			$scope.hideSpinner();
			mainPopup('A required field was not entered','');
			return;
		}
		var uploadData = {
			first_name : $scope.newUserFirstName,
			last_name : $scope.newUserLastName,
			email : $scope.newUserEmail,
			phone : $scope.newUserPhone
		};
		var request = $http({
		    method: "post",
		    url: 'http://sciencetap.us/ionic/createNewUser.php',
		    data:{
			uploadData: uploadData 
		    }
		});
		request.success(function(data){
			console.log(data);
			setTimeout(function(){
				$scope.hideSpinner();
				mainPopup('Data Submitted Successfully','A request has been put in to create the account.  You will be notified via email when the account is created');
			}, 1000);
			$state.go('login');
		});
		request.error(function(data){
			console.log(data);
			setTimeout(function(){
				$scope.hideSpinner();
				mainPopup('Data Not Submitted Successfully', 'The request could not be processed at this time');
			}, 1000);
			$state.go('login');
		});
	}
});

app.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, GoogleMaps){
});	

app.controller('CollectCtrl', function($scope, $state,  $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, projectService, $ionicLoading, $ionicScrollDelegate){

	console.log('Collect Controller');
	$scope.logout = function(){
                window.localStorage.removeItem('loggedInUser');
                $state.go('login');
        }

        $scope.form = projectService.getCurrentForm();
	console.log("Current Form: ", $scope.form );

});

app.controller('SiteCtrl', function($scope, $ionicPopup, $state, $cordovaGeolocation, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, projectService, $ionicLoading, $ionicScrollDelegate){
	console.log('Site Controller');
	$scope.isAdmin = window.localStorage.getItem("admin");
        $scope.logout = function(){
                window.localStorage.removeItem('loggedInUser');
                $state.go('login');
        }

	$scope.site = projectService.getCurrentSite();
        console.log("Current Site: ", $scope.site);

	$scope.forms = projectService.getForms();

	$scope.selectForm = function(form){
		projectService.setCurrentForm(form);
		$state.go('collect');
	}
	
	$ionicModal.fromTemplateUrl('site-info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })

        $scope.getSiteInfo = function() {
                $scope.modal.show()
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });


});

app.controller('ViewCtrl', function($scope, $ionicPopup, $state, $cordovaGeolocation, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, $ionicLoading, $ionicScrollDelegate, projectService){

	console.log('View Controller');
	//$scope.isAdmin = window.localStorage.getItem("admin");
	$scope.isAdmin = true;

	$scope.logout = function(){
		window.localStorage.removeItem('loggedInUser');
                $state.go('login');
	}
	
	$scope.project = projectService.getCurrentProject();
	console.log("CURRENT PROJECT: ", $scope.project);

	$scope.selectProjectSite = function(site){
		projectService.setCurrentSite(site);
		$state.go('site');	
	}
	$scope.addSite = function(site_uid){
		console.log('create site or add existing');
		$state.go('create_site');
	}
	$ionicModal.fromTemplateUrl('project-info.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })

        $scope.getProjectInfo = function() {
                $scope.modal.show()
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });


});

app.controller('HomeCtrl', function($scope, $ionicPopup, $state, $cordovaGeolocation, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, LoginService, projectService, $ionicLoading, $ionicScrollDelegate){
	$scope.user = {};
	$scope.user.firstName = window.localStorage.getItem("firstName");
	$scope.user.role = window.localStorage.getItem("role");
	$scope.user.email = window.localStorage.getItem("email");
	$scope.user.phone = window.localStorage.getItem("phone");
	$scope.user.id = window.localStorage.getItem("userId");
	$scope.user.lastName = window.localStorage.getItem("lastName");
	$scope.projects = [];
	$scope.isAdmin = window.localStorage.getItem("admin");

	$scope.logout = function(){
		window.localStorage.removeItem('loggedInUser');
		$state.go('login');
	}

	projectService.loadProjects().then(function( response ){
		$scope.projects = response.data; 
	});

	//will navigate to new view and load selected project
	$scope.selectProject = function( project_uid ){
		projectService.setCurrentProject( project_uid );
		$state.go('view');
	}
	
	$ionicModal.fromTemplateUrl('home-info.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal
	})  

	$scope.getHomeInfo = function() {
   		$scope.modal.show()
  	}
	
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};

	$scope.$on('$destroy', function() {
	    $scope.modal.remove();
	});

});

app.service('LoginService', function($q, $http, $state){
	return{ 
		loginUser: function(name, pw){
			var deferred = $q.defer();
			var promise = deferred.promise;

			if(name == "" || name == null ){
				deferred.reject('Wrong credentials');
				window.localStorage.removeItem('loggedInUser');
			}else{
				deferred.resolve('Welcome ' + name + '!');
			}
			promise.success = function(fn){
				promise.then(fn);
				return promise;
			}
			promise.error = function(fn){
				promise.then(null, fn);
				return promise;
			}
			return promise;
		}
	}
})

app.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    },
    getGallery: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      return q.promise;
    }
  }
}]);


app.directive('compareStrings', function(){
	return{
		require: "ngModel",
		link: function(scope, element, attributes, ngModel){
				ngModel.$validators.compareTo = function(modelValue){
					return modelValue == scope.otherModelValue;
				};

				scope.$watch("otherModelValue", function(){
					ngModel.$validate();
				});

			}

	};
}); 

app.service('projectService', function( $http ) {
  
	var projects = [];
	var projects_indexed = [];
	var current_project = null;
	var current_site = null;

	var forms = [];
	var current_form = null;

  	var addProject = function(newObj) {
  	    project.push(newObj);
  	};

  	var loadProjects = function(){
		return $http.get("http://sciencetap.us/ionic/getProjects.php").then(function(response){
			data = response.data;
			projects = data.data;
			console.log("Projects: ", response);
			for( var i = 0; i< projects.length; i++ )
			{
				projects_indexed[projects[i].id] = projects[i];
			}		
	
			return data;
		});
	};
	
	var getProjects = function(){
		return projects;
	};

	var setCurrentProject = function(project_uid){
		current_project = projects_indexed[project_uid];
		console.log("Current Project: ", current_project);
		forms = current_project.forms;
	};
	
	var getCurrentProject = function(){
		return current_project;	
	};
	var setCurrentSite = function(site){
		currentSite = site;
	};
	var getCurrentSite = function(){
		return currentSite;
	};
	var loadForms = function(){
		return forms;
	}

	var getForms = function(){
		return forms;
	}
	
	var setCurrentForm = function(form){
		current_form = form;	
	};

	var getCurrentForm = function(){
		return current_form;
	};

  	return {
  		addProject: addProject,
		loadProjects: loadProjects,
   		getProjects: getProjects,
		setCurrentProject: setCurrentProject,
		getCurrentProject: getCurrentProject,
		setCurrentSite: setCurrentSite,
		getCurrentSite: getCurrentSite,
		loadForms: loadForms,
		getForms: getForms,
		setCurrentForm: setCurrentForm,
		getCurrentForm: getCurrentForm
  	};

});

app.factory('Projects', function($http){
	var data = [];
	return{
		getProject: function(){
			return $http.get("http://sciencetap.us/ionic/getProjects.php").then(function(response){
				data = response;
				return data;
			});
		}
	}

})

app.factory('Markers', function($http){
	var markers = [];
	return{
		getMarkers: function(){
			return $http.get("http://sciencetap.us/ionic/getMarkers.php").then(function(response){
				markers = response;
				return markers;
			});
		}
	}
})

app.factory('GoogleMaps', function($cordovaGeolocation, $ionicPopup, $ionicLoading, $rootScope, $cordovaNetwork, Markers, ConnectivityMonitor){

	var apiKey = false;
	var map = null;

	function initMap(){
		var options = {timeout: 10000, enableHighAccuracy: true};

		$cordovaGeolocation.getCurrentPosition(options).then(function(position){

			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var mapOptions = {
				center: latLng,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			layer = new google.maps.FusionTablesLayer({
				query: {
					select: 'geometry',
					from: '1_kb24whPAZttu2FPYLAFPUAUb8f6PNnSUL48TzX7'
				},
				options: {
					styleId: 3,
					templateId: 4,
					strokeWeight: 3 
				}
			});
			map = new google.maps.Map(document.getElementById("map"), mapOptions);
			layer.setMap(map);

			var GeoMarker = new GeolocationMarker(map);

			//wait until map loads
			google.maps.event.addListenerOnce(map, 'idle', function(){
				loadMarkers();
				enableMap();
			});

		}, function(error){
			console.log("Could not get location");
			enableMap();
		});
	}

	function enableMap(){
		$ionicLoading.hide();
	}

	function disableMap(){
		$ionicLoading.show({
			template: 'You must be connected to the Internet to view this map'
		});
	}
	var warnNoConnection = function(){
		var popup = $ionicPopup.alert({
			title: 'Network Connection Lost',
			template: 'The network connection was lost, this will prevent the map from updating, and the ability to submit data'
		});
		popup.then(function(res){ ; });
	};

	function loadGoogleMaps(){
		//$ionicLoading.show({ template: 'Loading Map' });

		//function called once SDK loaded
		window.mapInit = function(){
			var geoScript = document.createElement("script");
			geoScript.type = "text/javascript";
			geoScript.id = "geolocationMarker";
			geoScript.src = "js/geolocation-marker.js";
			document.body.appendChild(geoScript);
			initMap();
		};

		//create script element to insert API key
		if(document.getElementById("googleMaps") == null){
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.id = "googleMaps";
			if(apiKey){
				script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
			}else{
				script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
			}
			document.body.appendChild(script);
		}
	}

	function checkLoaded(){
		if(typeof google == "undefined" || typeof google.maps == "undefined"){
			loadGoogleMaps();
		}else{
			enableMap();
		}
	}

	function loadMarkers(){
		Markers.getMarkers().then(function(markers){
			console.log(markers.data);
			var records = markers.data.sites;
			for(var i = 0; i < records.length; i++){
				var record = records[i];
				var markerPos = new google.maps.LatLng(record.site_lat, record.site_lon);
				var marker = new google.maps.Marker({
					map: map,
					animation: google.maps.Animation.DROP,
					position: markerPos 
				});
				var infoWindowContent = "<h4>Project: " + record.project_name + "</h4>";
				infoWindowContent += "<h5>Site: " + record.site_name + "</h5>";
				infoWindowContent += "<h6>" + record.site_description + "</h6>";
				addInfoWindow(marker, infoWindowContent, record);
			}
		});
	}

	function addInfoWindow(marker, message, record){
		var infoWindow = new google.maps.InfoWindow({
			content: message
		});
		google.maps.event.addListener(marker, 'click', function(){
			infoWindow.open(map, marker);
		});
	}

	function addConnectivityListeners(){
		if(ionic.Platform.isWebView()){
			//check to load map
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
				checkLoaded();
			});
			//disable map if offline
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
				warnNoConnection();
			});
		}else{
			//for not running on a device
			window.addEventListener("online", function(e){
				checkLoaded();
			},false);
			window.addEventListener("offline", function(e){
				warnNoConnection();
			},false);
		}
	}

	return{
		init: function(key){
			if(typeof key != "undefined"){
				apiKey = key;
			}
			if(typeof google =="undefined" || typeof google.maps == "undefined"){
				console.warn("Google Maps SDK needs to be loaded");
				var networkState = navigator.connection.type;
				console.log(networkState);
				if(ConnectivityMonitor.isOnline()){
					loadGoogleMaps();
				}
			}else{
				if(ConnectivityMonitor.isOnline()){
					console.log("right here");
					initMap();
					enableMap();
				}else{
					warnNoConnection();
				}
			}
			console.log("but");
			addConnectivityListeners();
		}
	}
})

app.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
	return{
		isOnline: function(){
			if(ionic.Platform.isWebView()){
				console.log("here");
				return $cordovaNetwork.isOnline();
			}else{
				console.log("there");
				return navigator.onLine;
			}
		},
		isOffline: function(){
			if(ionic.Platform.isWebView()){
				return !$cordovaNetwork.isOnline();
			}else{
				return !navigator.onLine;
			}
		}
	}
});

app.service('createProjectService', function(){
	var newProjectData = {};
	
	var addProjectName = function(name){ newProjectData.name = name; }
	var addProjectDescr = function(descr){ newProjectData.descr = descr; }
	var addProjectId = function(id){ newProjectData.id = id; }
	var addProjectUsers = function(users){ newProjectData.users = users; }
	var addProjectSites = function(sites){ newProjectData.sites = sites; }
	var addProjectForms = function(forms){ newProjectData.forms = forms; }
	var getProjectData = function(){ return newProjectData; }
	
	return{
		addProjectName: addProjectName,
		addProjectDescr: addProjectDescr,
		addProjectId: addProjectId,
		addProjectUsers: addProjectUsers,
		addProjectSites: addProjectSites,
		addProjectForms: addProjectForms,
		getProjectData: getProjectData
	}
	
});

app.service('createSiteService', function(){
	var new_site = {};
	
	var getSiteData = function(){ return newSiteData; }
	
	var createSite = function( data ){
		console.log("NEW SITE: ", data);	
	}
	
	return{
		createSite: createSite,
		getSiteData: getSiteData
	}
	
});

