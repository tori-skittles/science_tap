var app = angular.module('ionicApp', ['ionic'])
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
		.state('projAdmin', {
			url: '/projAdmin',
			templateUrl: 'templates/projAdmin.html',
			controller: 'ProjAdmin'
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
		.state('map',{
                        url: '/map',
			templateUrl: 'templates/map.html',
			controller: 'MapCtrl'
		})
		.state('view',{
			url: '/view',
			templateUrl: 'templates/view.html',
			controller: 'ViewCtrl'
		})
		.state('manage_users',{
                        url: '/manage_users',
                        templateUrl: 'templates/manage_users.html',
                        controller: 'ProjUsers'
                })
		.state('manage_forms',{
			url: '/manage_forms',
			templateUrl: 'templates/manage_forms.html',
			controller: 'ProjForms'
		})
		.state('form_builder',{
			url: '/form_builder',
			templateUrl: 'templates/form_builder.html',
			controller: 'FormBuilder'
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
			//templateUrl: 'templates/assign_to_site.html',
			controller: 'AssignToSiteCtrl'
		})
		.state('create_user',{
			url: '/create_user',
                        templateUrl: 'templates/create_user.html',
                        controller: 'CreateUserCtrl'
		})
		.state('data',{
			url: '/data',
			templateUrl: 'templates/data.html',
			controller:'DataCtrl'
		});
	$urlRouterProvider.otherwise('/login')
	
	
	if(ionic.Platform.isWindowsPhone() || ionic.Platform.isAndroid() || ionic.Platform.isIOS()){
		setTimeout(function(){
			navigator.splashscreen.hide();
		}, 1000);
	}else{
	}
	
})
	app.run(function($ionicPlatform, $state) {

		$ionicPlatform.ready(function() {
			/*if(window.cordova && window.cordova.plugins.Keyboard) {
			     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}*/
			if(window.StatusBar) {
			     StatusBar.styleDefault();
			}
			var loggedInUser = window.localStorage.getItem('loggedInUser');
			if(loggedInUser != null){
				$state.go('home');	
			}
		});
	})

	app.controller('DataCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createProjectService){

		$scope.projects = null;

                var request = $http({
                        method: "post",
                        url: 'http://sciencetap.us/ionic/getProjectsDataList.php',
                        data:{  }
                });
                request.success(function(data){
			
                	$scope.projects = data.data;
		});
                request.error(function(data){
                });	

	});

	app.controller('CreateProjectCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createProjectService){


	$scope.create_project = {};
	$scope.user = {};
	$scope.user.id = window.localStorage.getItem("userId");
	
	$scope.cancelCreateProject = function(){
		$state.go('home');
	}
	$scope.back = function(){
		$state.go('home');
	};
	$scope.createProject = function(){
		
		createProjectService.addProjectName($scope.create_project.name);
		createProjectService.addProjectDescr($scope.create_project.descr);
		
		var uploadData = {
			project_name: $scope.create_project.name,
			project_descr: $scope.create_project.descr,
			user_id: $scope.user.id
		};
		var request = $http({
			method: "post",
			url: 'http://sciencetap.us/ionic/createProject.php',
			data:{ uploadData: uploadData }
		});
		request.success(function(data){
			$state.go('home');
		});
		request.error(function(data){
			$scope.hideSpinner();
		});
	};


	});

app.controller('MapCtrl', function($scope, $compile, $state, GoogleMaps, $http, projectService){
	//GoogleMaps.init('AIzaSyAWStknXNZGYHFiPNEHPEETgBkAnuN7_kc');
    $scope.logout = function(){
                window.localStorage.removeItem('loggedInUser');
                $state.go('login');
        }

    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(39.980441, -75.156498),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

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

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var map = $scope.map;
    layer.setMap(map);
    $scope.markers = [];
    
    var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.lon),
            title: info.name + " (" + info.lat + " , " + info.lon + ") "
        });
	
	marker.content = "<div>";
		 marker.content += "<h3>" + info.name + "</h3>" + " (" + info.lat + " , " + info.lon + ") ";
		marker.content += "<div>";
			marker.content += "<button class='button button-block button-royal' ng-click='submitData(" + info.project_uid+","+info.id+")'>Collect Data</button>";
		marker.content += "</div>";
	marker.content += "</div>";	
	var compiled = $compile(marker.content)($scope);

	var infoWindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

	google.maps.event.addListener(marker, 'click', function(){
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  


    var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/getMarkers.php',
                            data:{
                                user_uid: window.localStorage.getItem("userId")
                            }
    });

    request.success(function(data){
	var markers = data.data;
	for (i = 0; i < markers.length; i++){
    	    createMarker(markers[i]);
    	}

    });


    $scope.submitData = function( project_uid, site_uid ){

	projectService.setCurrentProjectById( project_uid );
	projectService.setCurrentSiteById( site_uid );
	$state.go('site');
    };    

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

});	


app.controller('ProjUsers', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createSiteService, projectService, infoService){

	$scope.current_project = projectService.getCurrentProject();
	$scope.addUsers = [];
	$scope.newUsers = [];

	infoService.getAllUsers().then(function(data) {
                $scope.allUsers = data;
	});

	$scope.back = function(){
                $state.go('projAdmin');
        }

	$scope.createUser = function(){
		$state.go('create_user');
	};

        $scope.cancelAdminEdits = function(){
                $state.go('projAdmin');
        };
        $scope.saveAdminEdits = function(){
                for( var i = 0; i<$scope.allUsers.length; i++ )
                {
                        if( $scope.allUsers[i].checked == true){
                                $scope.addUsers.push($scope.allUsers[i].id);
                                $scope.newUsers.push($scope.allUsers[i]);
                        };

                }

                var data = {
                        user_uids: $scope.addUsers,
                        project_uid: $scope.current_project.id
                }

                var request = $http({
                        method: "post",
                        url: 'http://sciencetap.us/ionic/addUsersToProject.php',
                        data:{ data: data }
                });
                request.success(function(data){
                        console.log('Add Sites To Project: ', data);
                        $state.go('home');
                });

        };

});

app.controller('FormBuilder',function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createSiteService, projectService, infoService){

	$scope.user = {};
	$scope.user.id = window.localStorage.getItem("userId");
	$scope.current_project = projectService.getCurrentProject();
	
	$scope.new_form = {
		name: null,
		description: null,
		fields: []
	};
	$scope.new_field = {
		value: null,
		type: null,
		options: []
	};
	
	$scope.field_types = ['text', 'select', 'number', 'checkbox', 'radio', 'list', 'range'];

	$scope.addField = function(){
		if( $scope.new_field.type != null && $scope.new_field.value != null )
		{	
			$scope.new_form.fields.push($scope.new_field);
			$scope.new_field = {
				value: null,
                		type: null,
                		options: []
			};
		}
	};	

	$scope.rmOpt = function( i ){
		$scope.new_field.options.splice(i, 1);
	};

	$scope.addOpt = function(){
		console.log('new option: ', $scope.new_field);
		var opt = {
			value: $scope.new_field.opt
		}
		$scope.new_field.options.push(opt);
		$scope.new_field.opt = null;
	};

	$scope.rmNewField = function(field, index){
		$scope.new_form.fields.splice(index, 1);	
	};

	$scope.cancelAdminEdits = function(){
                $state.go('view');
        };
        $scope.saveAdminEdits = function(){
		if( $scope.new_form.name != null && $scope.new_form.fields.length > 0 )
		{
                	var data = {
                	        form: $scope.new_form,
                	        project_uid: $scope.current_project.id
                	}

                	var request = $http({
                	        method: "post",
                	        url: 'http://sciencetap.us/ionic/createForm.php',
                	        data:{ data: data }
                	});
                	request.success(function(data){
                	        console.log('Add Forms To Project: ', data);
            			$scope.current_project.forms.push($scope.new_form);
				$state.go('view');
                	});
		}
        };


});

app.controller('ProjForms', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createSiteService, projectService, infoService){
	
	$scope.user = {};
	$scope.user.id = window.localStorage.getItem("userId");
	$scope.addForms = [];
	$scope.current_project = projectService.getCurrentProject();

	$scope.back = function(){
                $state.go('projAdmin');
        };	
	infoService.getAllForms().then(function(data) {

                $scope.allForms = data;
		for( var i = 0; i < $scope.current_project.forms.length; i++ )
		{
			jQuery.grep( $scope.allForms, function(e){
				if( e.id == $scope.current_project.forms[i].id )
				{
					e.checked = true;
				}
			});
		}
	});

	$scope.createForm = function(){
		$state.go('form_builder');
	};

	$scope.cancelAdminEdits = function(){
                $state.go('view');
        };
        $scope.saveAdminEdits = function(){
		
		for( var i = 0; i < $scope.allForms.length; i++ )
		{
			if( $scope.allForms[i].checked == true)
			{
                                $scope.addForms.push($scope.allForms[i].id);
                        };

                }

                var data = {
                        form_uids: $scope.addForms,
                        project_uid: $scope.current_project.id
                }

                var request = $http({
                        method: "post",
                        url: 'http://sciencetap.us/ionic/addFormsToProject.php',
                        data:{ data: data }
                });
                request.success(function(data){
                        console.log('Add Forms To Project: ', data);
                        $state.go('home');
                });
	};
});

app.controller('CreateSiteCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicScrollDelegate, createSiteService, projectService, infoService){

	console.log("In CreateSiteCtrl");
	$scope.user = {};
	$scope.create_site = {};
	$scope.user.id = window.localStorage.getItem("userId");
	if( $scope.user.id == null || $scope.user.id == undefined )
        {
                $state.go('login');
        }
	$scope.back = function(){
                $state.go('projAdmin');
        };
	$scope.showSpinner = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner>'
		});
	};
	
	$scope.goBack = function(){ $state.go('admin'); }
	$scope.hideSpinner = function(){ $ionicLoading.hide(); };
	$scope.addSites = [];
	$scope.newSites = [];
	$scope.current_project = projectService.getCurrentProject();

	infoService.getAllSites().then(function(data) {
		
		$scope.allSites = data;
		for( var i = 0; i < $scope.current_project.sites.length; i++ )
		{
			jQuery.grep( $scope.allSites, function(e){
				if( e.id == $scope.current_project.sites[i].id )
				{
					e.checked = true;
				}
			});
		}
	});


	$scope.cancelAdminEdits = function(){
		$state.go('view');
	};
	$scope.saveAdminEdits = function(){

		for( var i = 0; i<$scope.allSites.length; i++ )
		{
			console.log($scope.allSites[i].checked);
			if( $scope.allSites[i].checked == true || $scope.allSites[i].checked == "true"){ 
				$scope.addSites.push($scope.allSites[i].id);
				$scope.newSites.push($scope.allSites[i]);
			};
			
		}

		var data = {
			site_uids: $scope.addSites,
			project_uid: $scope.current_project.id
		}
		console.log("SITES: ", data);

		var request = $http({
                        method: "post",
                        url: 'http://sciencetap.us/ionic/addSitesToProject.php',
                        data:{ data: data }
                });
                request.success(function(data){
			console.log('Add Sites To Project: ', data);	
			$state.go('home');	
		});	
			
	};

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
			site.checked = true;
			site.id = data.site_uid;	
			console.log("New Site", site);	
			console.log("Create Site Success");
			$scope.current_project.sites.push(site);
			$scope.allSites.unshift(site);
			$scope.addSites.push(site.id);
			
			//clear form
			$scope.create_site.name = '';
			$scope.create_site.descr = '';
			$scope.create_site.site_lat = '';
			$scope.create_site.site_lon = '';
		});
		request.error(function(data){
			$scope.hideSpinner();
			console.log("Error creating site");
			console.log(data);
		});
	};
});

app.controller('CreateUserCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, LoginService, $ionicScrollDelegate){
        $scope.data = {};
        $scope.newUserFirstName = '';
        $scope.newUserLastName = '';
        $scope.newUserEmail = '';
        $scope.newUserPhone = '';
        $scope.resetEmail = '';
        $scope.loginDisabled = false;
	$scope.submitNewUser = function(){

	$scope.back = function(){
                $state.go('login');
        }
	
	if($scope.newUserFirstName == "" || $scope.newUserLastName == "" || $scope.newUserEmail == ""){
                        return;
	}
	var uploadData = {
		first_name : $scope.newUserFirstName,
		last_name : $scope.newUserLastName,
		email : $scope.newUserEmail,
		phone : $scope.newUserPhone,
		password: $scope.newUserPassword
	};
	var request = $http({
	    method: "post",
	    url: 'http://sciencetap.us/ionic/registerUser.php',
	    data:{
		uploadData: uploadData
	    }
	});
	request.success(function(data){
		console.log(data);
		$state.go('login');
	});
	request.error(function(data){
		console.log(data);
		$state.go('create_user');
                });
        }

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

	$scope.register = function(){
		$state.go('create_user');
	};

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
					if( data.admin == 1 )
					{
						window.localStorage.setItem("admin", "manager");
					}else{
						window.localStorage.setItem("admin", "user");
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

app.controller('CollectCtrl', function($scope, $state,  $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, projectService, $ionicLoading, $ionicScrollDelegate){
	$scope.submit = {};
	$scope.user = {};
	$scope.user.id = window.localStorage.getItem('userId');
	console.log('Collect Controller');
	$scope.logout = function(){
                window.localStorage.removeItem('loggedInUser');
                $state.go('login');
        }
	$scope.back = function(){
                $state.go('site');
        }


	if( $scope.user.id == null || $scope.user.id == undefined )
        {
                $state.go('login');
        }

	$scope.showSpinner = function(){
                 $ionicLoading.show({
                         template: '<ion-spinner icon="spiral"></ion-spinner>'
                 });
        };

	var form_uid = projectService.getCurrentForm();
	$http
                        .get(
                                "http://sciencetap.us/ionic/getFormById.php",
                                {
                                        params: {
                                                form_uid: form_uid
                                        }
                                }).then(function(response){
                                data = response.data;
                                $scope.form = data.data;
        			$scope.fields = $scope.form.fields;        
				$scope.selectedForm = $scope.form;
	});

 
        $scope.hideSpinner = function(){ $ionicLoading.hide(); };

	$ionicModal.fromTemplateUrl('templates/collect_imageName.html', {
                scope: $scope,
                animation: 'slide-in-up'
        }).then(function(modal) {
                $scope.imageNameModal = modal;
        });

        $scope.openImageNameModal = function() { $scope.imageNameModal.show(); };
        $scope.closeImageNameModal = function(image) {
                $scope.imageName = image.name;
                $scope.images.push({
                        "fileURI" : $scope.fileURI,
                        "imageName" : $scope.imageName
                });
                console.log("Name Image Modal closed");
                console.log($scope.images);
                $scope.showImagesItem = $scope.images.length;
                $scope.imageName = '';
                $scope.fileURI = '';
                $scope.imageNameModal.hide();
        };

	$scope.getPhoto = function() {
                var options = {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: 1,
                        encodingType: 0
                }
                Camera.getPicture(options).then(function(FILE_URI){
                        console.log(FILE_URI);
                        $scope.fileURI = FILE_URI;
                       $scope.openImageNameModal();
                }, function(err){
                        console.log("failed" + err);
                });
        };

	$scope.drag = function(value) {
	};

	$scope.submitForm = function(data){
		$scope.showSpinner();
		console.log("Submit - Form Id");
		console.log($scope.selectedForm.id);
		console.log("Submit - Form Fields and Inputs");
		for(i = 0; i < $scope.selectedForm.fields.length; i++){
			console.log($scope.selectedForm.fields[i]);
		}
		var project = projectService.getCurrentProject();
		var site = projectService.getCurrentSite();
		var form_uid = $scope.form.id;
		var uploadData = {
			project_uid: project.id,
			site_uid: site.id,
			user_uid: window.localStorage.getItem("userId"),
			form: $scope.selectedForm
		}	
		console.log("UPLOAD DATA: ", uploadData);
		
		var request = $http({
		    method: "post",
		    url: 'http://sciencetap.us/ionic/uploadData.php',
		    data:{ uploadData: uploadData }
		});
		request.success(function(data){
			$scope.hideSpinner();
			$state.go('site');
		});
		
	}
	
	$scope.cancelSubmitForm = function(){
		$state.go('site');
	};

});

app.controller('SiteCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, projectService, $ionicLoading, $ionicScrollDelegate){
	console.log('Site Controller');
	var role = window.localStorage.getItem("admin");
	console.log("Site ROle: ", role);
        if( role == 'manager' )
	{
		$scope.isAdmin = true;
	} else {
		$scope.isAdmin = false;
	}
	 $scope.isAdminView = false;

	$scope.adminView = function(){
                $scope.isAdminView = !$scope.isAdminView;
        }

	$scope.logout = function(){
                window.localStorage.removeItem('loggedInUser');
                $state.go('login');
        }

	$scope.back = function(){
                $state.go('view');
        }

	$scope.site = projectService.getCurrentSite();
        console.log("Current Site: ", $scope.site);

	$scope.forms = projectService.getForms();

	projectService.getImagesBySite().then(function( response ){
		$scope.images = response;
		console.log("Current images: ", $scope.images);
	});
	$scope.selectForm = function(form, index){
		if( $scope.isAdminView )
		{
			$scope.forms.splice(index, 1);
			rm_forms = [form.id];
			var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/updateProjectForm.php',
                            data:{
                                project_uid: $scope.project.id,
                                rm_forms: $scope.rmForms,
                                add_forms: []
                            }
                	});
	
		} else {
			console.log(form.id);
			projectService.setCurrentForm(form.id);
			$state.go('collect');
		}
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

app.controller('ViewCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, $ionicLoading, $ionicScrollDelegate, projectService){

	console.log('View Controller');
	var role = window.localStorage.getItem("admin");
	console.log("View Role: ", role);
        if( role == 'manager' )
        {
                $scope.isAdmin = true;
        } else {
                $scope.isAdmin = false;
        }

	$scope.isAdminView = false;
	$scope.user = {};
	$scope.user.id = window.localStorage.getItem("userId");
	if( $scope.user.id == null || $scope.user.id == undefined )
        {
                $state.go('login');
        }
	$scope.adminView = function(){
        	$state.go('projAdmin');
	}
	$scope.back = function(){
		$state.go('home');
	}

	$scope.logout = function(){
		window.localStorage.removeItem('loggedInUser');
                $state.go('login');
	}
	
	$scope.project = projectService.getCurrentProject();
	console.log("CURRENT PROJECT: ", $scope.project);

	$scope.selectProjectSite = function(site, index){
		if( $scope.isAdminView )
		{
                	$scope.project.sites.splice(index, 1);	
			sites = [site.id];
			var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/removeProjectSite.php',
                            data:{
                                project_uid: $scope.project.id,
                                sites: sites,
                            }
	                });

			

		}else{

			projectService.setCurrentSite(site);
			$state.go('site');	
		}
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

app.controller('HomeCtrl', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, LoginService, projectService, $ionicLoading, $ionicScrollDelegate){
	$scope.user = {};
	$scope.user.firstName = window.localStorage.getItem("firstName");
	$scope.user.role = window.localStorage.getItem("role");
	$scope.user.email = window.localStorage.getItem("email");
	$scope.user.phone = window.localStorage.getItem("phone");
	$scope.user.id = window.localStorage.getItem("userId");
	$scope.user.lastName = window.localStorage.getItem("lastName");
	$scope.projects = [];
	var role = window.localStorage.getItem("admin");
	console.log("Home Role", role);
        if( role == 'manager' )
        {
                $scope.isAdmin = true;
        } else {
                $scope.isAdmin = false;
        }

	$scope.isAdminView = false;
	$scope.logout = function(){
		window.localStorage.removeItem('loggedInUser');
		$state.go('login');
	}

	if( $scope.user.id == null || $scope.user.id == undefined )
	{
		$state.go('login');
	}

	projectService.loadProjects( $scope.user.id, $scope.isAdmin ).then(function( response ){
		$scope.projects = response.data; 
	});

	//will navigate to new view and load selected project
	$scope.selectProject = function( project_uid ){
		projectService.setCurrentProject( project_uid );
		if( !$scope.isAdminView )
		{
			$state.go('view');
	
		} else {

			$state.go('projAdmin');
		}
	}


	$scope.adminView = function(){
		$scope.isAdminView = !$scope.isAdminView;
	}

	$scope.createProject = function(){
		$state.go('create_project');
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

app.controller('ProjAdmin', function($scope, $ionicPopup, $state, $ionicLoading, $compile, $ionicModal, $ionicHistory, $http, $ionicSlideBoxDelegate, Camera, LoginService, projectService, infoService, $ionicLoading, $ionicScrollDelegate){
        $scope.user = {};
        $scope.user.firstName = window.localStorage.getItem("firstName");
        $scope.user.role = window.localStorage.getItem("role");
        $scope.user.email = window.localStorage.getItem("email");
        $scope.user.phone = window.localStorage.getItem("phone");
        $scope.user.id = window.localStorage.getItem("userId");
        $scope.user.lastName = window.localStorage.getItem("lastName");
        $scope.projects = [];
	var role = window.localStorage.getItem("admin");
	console.log("Adming Role", role);
        if( role == 'manager' )
        {
                $scope.isAdmin = true;
        } else {
                $scope.isAdmin = false;
        }

	$scope.rmUsers = [];
	$scope.rmForms = [];
	$scope.rmSites = [];
	$scope.addSites = [];
	$scope.addUsers = [];
	$scope.rmEntireProj = false;
        $scope.project = projectService.getCurrentProject();
	$scope.forms = $scope.project.forms;
	$scope.sites = $scope.project.sites;
	
	

	if( $scope.user.id == null || $scope.user.id == undefined )
        {
                $state.go('login');
        }

	$scope.back = function(){
                $state.go('projAdmin');
        }

	var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/getProjectUsers.php',
                            data:{
                                project_uid: $scope.project.id,
                            }
        });
	request.success(function(data){
		console.log("Project User Data: ", data);	
		$scope.users = data.data;
	});
	request.error(function(data){
		console.log("Error: cant retrieve project users");
	});

        $ionicModal.fromTemplateUrl('you_sure.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })


	$scope.addSite = function( ){
		$state.go('create_site');
	};

	$scope.addUsers = function( ){
		$state.go('manage_users');	
	};

	$scope.addForm = function( ){
		$state.go('manage_forms');
	};

	$scope.rmProject = function( ){
		console.log("Remove entire Project: ", $scope.project.id);
		$scope.modal.show()
		
		//dont remove the project, cancel
		$scope.cancelDelete = function() {
            		$scope.modal.hide();
        	};

		//confirm remove project
		$scope.confirmDelete = function() {
			$scope.modal.hide();
			$scope.project.is_active = 0;
        	        var request = $http({
        	                    method: "post",
        	                    url: 'http://sciencetap.us/ionic/updateProject.php',
        	                    data:{
        	                        project: $scope.project
        	                    }
        	        });
			$scope.modal.hide();	
			$state.go('home');
		};
		
	        $scope.$on('$destroy', function() {
         	   $scope.modal.remove();
        	});
	
	
	};

	$scope.rmProjectSite = function(site, index){
                if( $scope.sites[index].status == 'delete' )
		{
			$scope.sites[index].status = null;
			i = $scope.rmSites.indexOf(site.id);
			console.log("RemoveSites: ", $scope.rmSites);
			console.log(i);
			$scope.rmSites.splice( $scope.rmSites.indexOf(site.id), 1 );
        	}else{
			$scope.rmSites.push(site.id);
			$scope.sites[index].status = 'delete';	
		}
	};
	
	$scope.rmProjectFromUser = function( user, index ){
		if( $scope.users[index].status == 'delete' )
                {
                       $scope.users[index].status = null;
                       $scope.rmUsers.splice( $scope.rmUsers.indexOf(user.id), 1 );
                }else{
			$scope.rmUsers.push(user.user_uid);
			$scope.users[index].status = 'delete';
		}
	};	

	$scope.rmProjectForm = function(form, index){
		if( $scope.forms[index].status == 'delete' )
                {
                        $scope.forms[index].status = null;
                        $scope.rmForms.splice( $scope.rmForms.indexOf(form.id), 1);	

		}else{
			$scope.rmForms.push(form.id);	
			$scope.forms[index].status = 'delete';
		}
	};

	$scope.saveAdminEdits = function( ){
		 var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/updateProjectUsers.php',
                            data:{
                                project_uid: $scope.project.id,
                            	rm_users: $scope.rmUsers,
			    }
        	});

		var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/updateProjectForm.php',
                            data:{
                                project_uid: $scope.project.id,
                                rm_forms: $scope.rmForms,
				add_forms: []
                            }
                });

		var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/updateProjectSite.php',
                            data:{
                                project_uid: $scope.project.id,
                                rm_sites: $scope.rmSites,
                                add_sites: []
                            }
                });
		$state.go('home');
	};
	$scope.cancelAdminEdits = function( ){
		$state.go('view');

	};

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
app.service('infoService', function( $http ) {

	var users = [];
	var forms = [];
	var sites = [];

	var getAllUsers = function() {
		return $http
                        .get(
                                "http://sciencetap.us/ionic/getUsers.php",
                                {
                                }).then(function(response){
                                data = response.data.data;
                                return data;
                        });		
	};

	var getAllSites = function() {
		return $http
                        .get(
                                "http://sciencetap.us/ionic/getSites.php",
                                {
                                }).then(function(response){
                                data = response.data.data;
                                console.log("ALL SITES: ", data);
				return data;
                        });
	};
	
	var getAllForms = function() {
		return $http
                        .get(
                                "http://sciencetap.us/ionic/getForms.php",
                                {
                                }).then(function(response){
                                data = response.data.data;
                                return data;
                        });
	};		

	return{
		getAllUsers : getAllUsers,
		getAllForms : getAllForms,
		getAllSites : getAllSites
	

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

  	var loadProjects = function(user_uid, isAdmin){
		console.log("Admin Load Projs: ", isAdmin);
		return $http
			.get(
				"http://sciencetap.us/ionic/getUserProjects.php",
				{
        				params: {
            					admin: isAdmin, 
						user_uid: user_uid
        				}
				}).then(function(response){
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
		current_site = site;
	};
	var setCurrentSiteById = function(site){
		var site = jQuery.grep( current_project.sites, function(e){ return e.id = site });
		if( site.length != 0 )
		{
			current_site = site[0];
		}
	};
	var setCurrentProjectById = function(project_uid){
		current_project = projects_indexed[project_uid];
	};
	var getCurrentSite = function(){
		return current_site;
	};
	var loadForms = function(){
		return forms;
	}

	var getForms = function(){
		return forms;
	}
	
	var getCurrentForm = function(){
		return current_form;
	};
	var setCurrentForm = function(form_uid){
		current_form = form_uid;	
	};
	
	var getImagesBySite = function(){
		
		return $http
                        .get(
                                "http://sciencetap.us/ionic/getImagesByProjectSite.php",
                                {
                                        params: {
                                                site_uid: current_site.id,
                                                project_uid: current_project.id
                                        }
                                }).then(function(response){
                                data = response.data.data;
                                console.log("Images: ", data);
				for( var i = 0; i< data.length; i++ )
				{
					data[i].link = 'http://sciencetap.us/' + data[i].link
				}	
				return data;
                        });
	}

  	return {
  		addProject: addProject,
		loadProjects: loadProjects,
   		getProjects: getProjects,
		setCurrentProject: setCurrentProject,
		setCurrentProjectById: setCurrentProjectById,
		getCurrentProject: getCurrentProject,
		setCurrentSite: setCurrentSite,
		getCurrentSite: getCurrentSite,
		setCurrentSiteById: setCurrentSiteById,
		loadForms: loadForms,
		getForms: getForms,
		setCurrentForm: setCurrentForm,
		getCurrentForm: getCurrentForm,
		getImagesBySite: getImagesBySite
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

app.factory('Markers', function($http){
	var markers = [];
	return{
		getMarkers: function(){
		
			 var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/getMarkers.php',
                            data:{
                                user_uid: window.localStorage.getItem("userId")
                            }
                	});
               	 	request.success(function(data){
                        	console.log(data);
				return data;
                	});
		}
	}
})

app.factory('GoogleMaps', function($ionicPopup, $ionicLoading, $rootScope, Markers, $http){

	var apiKey = false;
	var map = null;

	function initMap(){
		var options = {timeout: 10000, enableHighAccuracy: true};

		//$cordovaGeolocation.getCurrentPosition(options).then(function(position){

			//var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var mapOptions = {
			//	center: latLng,
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

		//	var GeoMarker = new GeolocationMarker(map);
			google.maps.event.addListenerOnce(map, 'idle', function(){
				loadMarkers();
				enableMap();
			});

		//}, function(error){
		//	console.log("Could not get location");
		//	enableMap();
		//});
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
		window.mapInit = function(){
			console.log("loadGM mapInit");
			var geoScript = document.createElement("script");
			geoScript.type = "text/javascript";
			geoScript.id = "geolocationMarker";
			geoScript.src = "js/geolocation-marker.js";
			document.body.appendChild(geoScript);
			initMap();
		};
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
			
			var request = $http({
                            method: "post",
                            url: 'http://sciencetap.us/ionic/getMarkers.php',
                            data:{
                                user_uid: window.localStorage.getItem("userId")
                            }
                        });
                        request.success(function(data){
                                console.log(data);
				var records = data.data;
				for(var i = 0; i < records.length; i++){
					var record = records[i];
					var markerPos = new google.maps.LatLng(record.lat, record.lon);
					var marker = new google.maps.Marker({
						map: map,
						animation: google.maps.Animation.DROP,
						position: markerPos 
					});
					var infoWindowContent = "<h4>Project: " + "Project Name" + "</h4>";
					infoWindowContent += "<h5>Site: " + record.name + "</h5>";
					infoWindowContent += "<h6>" + record.description + "</h6>";
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
/*		if(ionic.Platform.isWebView()){
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
				checkLoaded();
			});
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
				warnNoConnection();
			});
		}else{

			window.addEventListener("online", function(e){
				checkLoaded();
			},false);
			window.addEventListener("offline", function(e){
				warnNoConnection();
			},false);
		}
*/	}

	return{
		init: function(key){
			console.log("Google Maps init");
			if(typeof key != "undefined"){
				console.log("Assigning key: ", key);
				apiKey = key;
			}
			if(typeof google =="undefined" || typeof google.maps == "undefined"){
				console.warn("Google Maps SDK needs to be loaded");
				var networkState = navigator.connection.type;
				console.log(networkState);
			//	if(ConnectivityMonitor.isOnline()){
					loadGoogleMaps();
			//	}
			}else{
				console.log("Its all good now");
			//	if(ConnectivityMonitor.isOnline()){
					console.log("right here");
					loadGoogleMaps();
			//		initMap();
			//		enableMap();
			//	}else{
			//		warnNoConnection();
			//	}
			}
		//	console.log("but");
		//	addConnectivityListeners();
		}
	}
})
/*
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
})*/


