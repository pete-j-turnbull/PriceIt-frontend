

var ui = {
	resultsHidden: false,
	errorHidden: true,
	loadingHidden: false,
	autoSuggestControl: {
		hidden: true,
		currentSuggestion: null,
		lastSubmittedSearch: null,
		highlight: function(node){
			$('#suggested-box p').removeClass('selected');
			$(node).addClass('selected');
		},
		navigate: function(event){

			var direction = ui.autoSuggestControl.getDirection(event);
			
			if(direction == 'up'){
				var current = $('p.selected')[0];
				if(current){
					var next = $(current).prev()[0];
					ui.autoSuggestControl.highlight(next);
				}
			}
			else if (direction == 'down'){
				var current = $('p.selected')[0];
				if(current){
					var next = $(current).next()[0];
					if(next){
						ui.autoSuggestControl.highlight(next);
					}
				}
				else {
					var next = $('#suggested-box p')[0];
					if(next){
						ui.autoSuggestControl.highlight(next);
					}
				}
			}
		},
		toggleSuggestions: function(){
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
		getSuggestions: function(searchText){
			//get current search box value
			var searchText = $('#search-box input').val();
			//call api with {searchTerm: ‘’}	
		},
		buildList: function(data){
			if(data.suggestions){
				console.log(' - build list called, recieved suggestions... ' + data.suggestions.length);
				var html = ""

				for (var i = 0; i < data.suggestions.length; i++) {
					var suggestion = data.suggestions[i];
					html += "<p>" + suggestion.toString() + "</p>";
				};

				console.log(html);
				
				//populate suggestions div
				document.getElementById('suggested-box').innerHTML = html;

				//bind event handlers
				window.ui.autoSuggestControl.bindEvents();
			}
		},
		suggestionEventHandler: function(event){
			var suggestionText = $(this).text();

			//the event that fires when a suggestions is clicked or highlighted
			console.log('suggestion selected... ' + suggestionText);

			//update search box value with suggestion
			$('#search-box input').val(suggestionText);
		},
		typeAheadEventHandler: function(event){
			//the event that fires on each keypress within the searchbox
			console.log('type ahead called...');
			if(window.ui.autoSuggestControl.hidden){
				window.ui.autoSuggestControl.toggleSuggestions();
			}

			var searchText = $('#search-box input').val();
			if(searchText != window.ui.autoSuggestControl.lastSubmittedSearch){
				window.ui.autoSuggestControl.lastSubmittedSearch = searchText;
				callApi(api_suggest, {searchTerm: searchText}, window.ui.autoSuggestControl.buildList);
			}
		},
		bindEvents: function(){
			//$("#search-box input").keyup(window.ui.autoSuggestControl.navigate, ui.autoSuggestControl.typeAheadEventHandler);
			$("#suggested-box p").hover(window.ui.autoSuggestControl.hover);
			$("#suggested-box p").click(window.ui.autoSuggestControl.suggestionEventHandler);
		}
	},
	search: function(){
		console.log(' - search called');
		var search_term = $('#search-box input').val();
		if(search_term){
			
			if(!this.errorHidden){
				this.toggleError('');
			}
			if(!this.autoSuggestControl.hidden){
				this.autoSuggestControl.toggleSuggestions();
			}
			
			//Empty any contents from lower-page (features-box and results-box)
			this.empty('#features-box');
			this.empty('#results-box');

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
		window.ui.updateFeatures(data.result.features);
		window.ui.bindFeatureHandler();
		//window.ui.refine();
	},
	updatePrice: function(obj){
		console.log(' - updatePrice called');
		console.log(obj.result.prices);

		//Build html string for results
		var html = '<span class="label label-default minor">' + "£" + obj.result.prices.lower + '</span><i class="glyphicon glyphicon-menu-left"></i><span class="label label-success">' + "£" + obj.result.prices.median + '</span><i class="glyphicon glyphicon-menu-right"></i><span class="label label-default minor">' + "£" + obj.result.prices.upper + '</span>';
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
		if(keys.length > 5){
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
		if(!this.autoSuggestControl.hidden){
			this.autoSuggestControl.toggleSuggestions();
		}
	}
};	




























