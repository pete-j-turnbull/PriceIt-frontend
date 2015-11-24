

var ui = {
	resultsHidden: false,
	errorHidden: true,
	autoSuggestControl: {
		hidden: true,
		currentSuggestion: null,
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
				this.hidden = false;
			}
			else {
				$('#suggested-box').hide();
				this.hidden = true;
			}
		},
		hover: function(event){
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
		getSuggestions: function(){
			//
		},
		buildList: function(suggestions){

		}
	},
	search: function(){
		console.log(' - search called');
		var search_term = $('#search-box input').val();
		if(search_term){
			if(!this.errorHidden){
				this.toggleError('');
			}

			var form = {searchTerm: search_term};
			callApi(api_search, form, this.processResults);
		}
		else {
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
		window.ui.refine();
	},
	updatePrice: function(obj){
		console.log(' - updatePrice called');
		console.log(obj.prices);
		$('#results-box span')[0].innerText = obj.prices.lower;
		$('#results-box span')[1].innerText = obj.prices.median;
		$('#results-box span')[2].innerText = obj.prices.upper;
		if(window.ui.resultsHidden){
			window.ui.toggleResults();
		}
	},
	updateFeatures: function(features){
		console.log(' - updateFeatures called');
		var keys    = Object.keys(features);
		var classes = "";
		var featureHtml = '';
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
		featureHtml += '<div class="clear"></div>';
		
		$('#features-box ul').html(featureHtml);
	},
	buildForm: function(){
		var form = {};

		form.searchTerm = $('#search-box input').val();
		form.features = {};

		var list_items = $('#features-box li');
		for(i=0, len=list_items.length; i<len; i++){
			var feature = $(list_items[i]).find('label').text();
			var option  = $(list_items[i]).find('select').val();
			if(option > 0){
				form.features[feature] = option;
			}
		}
		return form;
	},
	toggleResults: function(){
		if(this.resultsHidden){
			$('#lower-page').show();
			animate('#lower-page', 'zoomInUp');
			this.resultsHidden = false;
		}
		else {
			$('#lower-page').hide();
			this.resultsHidden = true;
		}
	},
	bindFeatureHandler: function(){
		$('#features-box select').change(function(){
			animate('#results-box', 'pulse');
			window.ui.refine.call(ui);
		});
	},
	toggleError: function(errorMessage){
		if(this.errorHidden){
			if(!this.resultsHidden){
				this.toggleResults();
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
	}
};	




























