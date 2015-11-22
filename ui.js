

var ui = {
	resultsHidden: false,
	errorHidden: false,
	search: function(){
		console.log(' - search called');
		var search_term = $('#search-box input').val();
		if(search_term){
			var form = {searchTerm: search_term};
			callApi(api_search, form, this.processResults);
		}
		else {
			alert("Please enter a value into the search box!");
		}
	},
	refine: function(){
		var form = this.buildForm();
		callApi(api_features, form, this.updatePrice)
	},
	returnDefaults: function(){
		//Clear properties to defaults
	},
	processResults: function(data){
		console.log(' - processResults called');
		console.log(data);
		window.ui.updateFeatures(data.features);
		//window.ui.updatePrice(data.prices);
		if(window.ui.resultsHidden){
			window.ui.toggleResults();
		}
	},
	updatePrice: function(prices){
		console.log(prices);
		$('#results-box span')[0].innerText = "£" + prices.lower;
		$('#results-box span')[1].innerText = "£" + prices.median.toString();
		$('#results-box span')[2].innerText = "£" + prices.upper.toString();
	},
	updateFeatures: function(features){
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
	toggleResults: function(callback){
		if(this.resultsHidden){
			$('#lower-page').fadeIn('fast', callback);
			this.resultsHidden = false;
		}
		else {
			$('#lower-page').hide();
			this.resultsHidden = true;
		}
	}
};	




























