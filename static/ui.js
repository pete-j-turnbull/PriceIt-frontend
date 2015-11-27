

var ui = {
	resultsHidden: false,
	errorHidden: true,
	loadingHidden: false,
	autoSuggestControl: {
		hidden: true,
		currentSuggestion: null,
		lastSubmittedSearch: '',
		highlight: function(node){
			$('#suggested-box p').removeClass('selected');
			$(node).addClass('selected');
		},
		navigate: function(event){
			console.log('navigate called');
			var direction = ui.autoSuggestControl.getDirection(event);
			
			console.log('direction: ' + direction);

			if(direction == 'up'){
				var current = $('p.selected')[0];
				if(current){
					var next = $(current).prev()[0];
					window.ui.autoSuggestControl.highlight(next);
				}
			}
			else if (direction == 'down'){
				var current = $('p.selected')[0];
				if(current){
					var next = $(current).next()[0];
					if(next){
						window.ui.autoSuggestControl.highlight(next);
					}
				}
				else {
					var next = $('#suggested-box p')[0];
					if(next){
						window.ui.autoSuggestControl.highlight(next);
					}
				}
			}
		},
		toggleSuggestions: function(){
			console.log('toggleSuggestions called..');
			if(this.hidden){
				$('#suggested-box').show();
				if(!ui.resultsHidden){
					ui.toggleLower();
				}
				this.hidden = false;
			}
			else {
				$('#suggested-box').hide();
				if(ui.resultsHidden){
					ui.toggleLower("fast");
				}
				this.hidden = true;
			}
		},
		hover: function(event){
			//calls highlight
			ui.autoSuggestControl.highlight(event.target);
		},
		getDirection: function(event){
			if(event.keyCode == 40){
				return 'down';
			}
			else if(event.keyCode == 38){
				return 'up';
			}
		},
		buildList: function(data){
			console.log(' - build list called, recieved suggestions... ' + data.suggestions.length);
			if(data.suggestions != ""){
				console.log(' - build list called, recieved suggestions... ' + data.suggestions.length);
				console.log(data);
				var html = ""

				for (var i = 0; i < data.suggestions.length; i++) {
					var suggestion = data.suggestions[i];
					html += "<p>" + suggestion.toString() + "</p>";
				};

				console.log(html);
				
				//populate suggestions div
				document.getElementById('suggested-box').innerHTML = html;

				//if suggested-box is hidden show
				if(window.ui.autoSuggestControl.hidden){
					window.ui.autoSuggestControl.toggleSuggestions();
				}

				//bind event handlers
				window.ui.autoSuggestControl.bindEvents();
			}
			else{
				console.log(' - did not not recieve any suggestions');
				if(!window.ui.autoSuggestControl.hidden){
					window.ui.autoSuggestControl.toggleSuggestions();
				}
			}
		},
		suggestionEventHandler: function(){
			
			var suggestionText = $(this).text();
			console.log('suggestion selected... ' + suggestionText);

			//Update lastSubmittedSearch property
			window.ui.autoSuggestControl.lastSubmittedSearch = suggestionText;

			//Remove select class from all suggestions
			$('#suggested-box p').removeClass('selected');

			//update search box value with suggestion
			$('#search-box input').val(suggestionText);

			//hide the suggestions box
			if(!window.ui.autoSuggestControl.hidden){
				window.ui.autoSuggestControl.toggleSuggestions();
			}

			//Refocus cursor on search-box
			$('#search-box input').focus();
		},
		typeAheadEventHandler: function(event){
			//the event that fires on each keypress within the searchbox. It compares search terms and rquests suggestions.
			console.log('type ahead called...');

			var searchText = $('#search-box input').val();
			console.log('search text: ' + searchText);
			if(searchText != window.ui.autoSuggestControl.lastSubmittedSearch){
				if(searchText != ""){

					//If error shown, hide.
					if(!ui.errorHidden){
						ui.toggleError();
					}

					window.ui.autoSuggestControl.lastSubmittedSearch = searchText;
					callApi(api_suggest, {searchTerm: searchText}, window.ui.autoSuggestControl.buildList);
				}
				else { //Nothing in search box.. Hide suggestions if visable
					if(!window.ui.autoSuggestControl.hidden){
						window.ui.autoSuggestControl.toggleSuggestions();
					}
				}
			}
		},
		bindEvents: function(){
			$("#suggested-box p").hover(window.ui.autoSuggestControl.hover);
			$("#suggested-box p").click(window.ui.autoSuggestControl.suggestionEventHandler);
		}
	},
	search: function(){
		console.log(' - search called');

		//Empty any contents from lower-page (features-box and results-box)
		this.empty('#features-box');
		this.empty('#results-box');

		var search_term = $('#search-box input').val();
		if(search_term){
			
			//Remove firstLoad class to remove Search Bar margin-top
			$('#upper-page').removeClass('firstLoad');

			if(!this.errorHidden){
				this.toggleError('');
			}
			if(!this.autoSuggestControl.hidden){
				console.log('ASC hidden = false. hiding...');
				this.autoSuggestControl.toggleSuggestions();
			}

			if(window.ui.loadingHidden){
				window.ui.toggleLoading();
			}

			var form = {searchTerm: search_term};
			callApi(api_search, form, this.processResults);
			window.ui.refine();

		}
		else { //show error-box
			if(this.errorHidden){
				this.toggleError("Please enter a value into the search box!");
			}
			else {
				var className = 'animated shake';
				$('#error-box').addClass(className).one(animationEnd, function(){
					$(this).removeClass(className);
				});
			}
		}
	},
	refine: function(){
		console.log(' - refine called');
		var form = this.buildForm();
		console.log(form);
		callApi(api_features, form, this.updatePrice)
	},
	processResults: function(data){
		console.log(' - processResults called');
		console.log(data);
		window.ui.updateFeatures(data.features);
		window.ui.bindFeatureHandler();
	},
	updatePrice: function(obj){
		console.log(' - updatePrice called');
		console.log(obj.prices);

		//Build html string for results
		var html = '<span class="label label-default minor">' + "£" + obj.prices.lower + '</span><i class="glyphicon glyphicon-menu-left"></i><span class="label label-success">' + "£" + obj.prices.median + '</span><i class="glyphicon glyphicon-menu-right"></i><span class="label label-default minor">' + "£" + obj.prices.upper + '</span>';
		console.log(' - setting inner html of results box... ' + html);
		$('#results-box').html(html);
		console.log(' - set html.');

		if(!window.ui.loadingHidden){
			window.ui.toggleLoading();
		}
	
		if(window.ui.resultsHidden){
			console.log(' - toggling results box');
			window.ui.toggleLower();
		}
	},
	updateFeatures: function(features){
		//Loops through features object building the entire html for the #features-box

		console.log(' - updateFeatures called');
		var keys    = Object.keys(features);
		var classes = "";
		var featureHtml = '<ul class="list-group column">';
		if(keys.length > 0){
			classes += "float";
		}

		for(i=0; i<keys.length; i++){
			var feature = keys[i];
			var options = features[feature].options;

			featureHtml += '<li class="' + classes + '">';
			featureHtml += '<label>' + feature + '</label>';
			featureHtml += '<select class="form-control"><option selected>none</option>';
			for(n=0; n<options.length; n++){
				var option = options[n];
				featureHtml += '<option>' + option + '</option>';
			}
			featureHtml += '</select>';
			featureHtml += '</li>';
		}
		featureHtml += '<div class="clear"></div></ul>';
		
		$('#features-box').html(featureHtml);
	},
	buildForm: function(){
		var form = {};

		form.searchTerm = $('#search-box input').val();
		form.features = {};

		var list_items = $('#features-box li');
		console.log(list_items.length);
		for(i=0, len=list_items.length; i<len; i++){
			var feature = $(list_items[i]).find('label').text();
			var option  = $(list_items[i]).find('select').val();
			console.log('got feature ' + feature + ' with value of ' + option);
			if(option != "none"){
				form.features[feature] = option;
			}
		}
		return form;
	},
	bindFeatureHandler: function(){
		$('#features-box select').change(function(){
			window.ui.empty('#results-box');
			window.ui.toggleLoading();
			window.ui.refine.call(ui);
		});
	},
	initializeSearch: function(){
		//first run on page load. bind event handlers to search box components.
		
		//Bind search button click to call ui.search method
		$('#search-box button').click(function(){
			window.ui.search.call(ui);
		});

		//Bind return key event to trigger click event on search button.
		$("#search-box input").keyup(function(event){
			if(event.keyCode == 13){

				//If Suggestion highlighted update search box with suggestion
				var suggestion = $('p.selected')[0];
				if(suggestion){
					ui.autoSuggestControl.suggestionEventHandler.call(suggestion);
				}

				$("#search-box button").click();			
			}
			else if (event.keyCode == 27) {
				if(!ui.autoSuggestControl.hidden){
					ui.autoSuggestControl.toggleSuggestions();
				}
			};
		});

		//bind event handler for both key up and down events plus every change to search text
		$("#search-box input").keyup(ui.autoSuggestControl.navigate).keyup(ui.autoSuggestControl.typeAheadEventHandler);

		//bind event handler to body element of page to hide suggestions if shown
		$('html').click(window.ui.blankSpaceClick);
	},
	toggleError: function(errorMessage){
		if(this.errorHidden){
			if(!this.resultsHidden){
				this.toggleLower();
			}
			$('#error-box').html(errorMessage);
			$('#error-box').show();
			animate('#error-box', 'bounceIn');
			this.errorHidden = false;
		}
		else {
			$('#error-box').hide();
			this.errorHidden = true;
		}
	},
	toggleLower: function(speed){
		if(this.resultsHidden){
			if(speed == "fast"){
				$('#lower-page').show();
			}
			else {
				$('#lower-page').show();
				animate('#lower-page', 'zoomInUp');
			}
			this.resultsHidden = false;
		}
		else {
			$('#lower-page').hide();
			this.resultsHidden = true;
		}
	},
	toggleLoading: function(){
		if(this.loadingHidden){
			$('#loading').show();
			this.loadingHidden = false;
		}
		else {
			$('#loading').hide();
			this.loadingHidden = true;
		}
	},
	empty: function(elementId){
		//used to clear html contents
		$(elementId).html('');
	},
	blankSpaceClick: function(){
		//used to attempt to hide Suggestions when user clicks on blank space
		if(!window.ui.autoSuggestControl.hidden){
			window.ui.autoSuggestControl.toggleSuggestions();
		}
	}
};	



