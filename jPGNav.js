(function($)
{
	'use strict';
	
	$.fn.jPGNav = function(options)
	{
		// initiate some properties
		this.tabWidth = [0]; //array with the calculate width of each tabs since position 0
		this.tabPos = 0; //index of tabWidth
		var self = this;
		console.log( options);
		options = $.extend({},$.fn.jPGNav.defaultOptions, options);
		return this.each(
			function()
			{
				// initiate tabWidth
				calcTabsWith(self, options);
				// manage navigation arrow
				manageArrow(self, options);
			
				// if click on an arrow, need to navigate
				$(this).find(options.arrowSelector ).click(function(e) {
					var $this = $(this);
					e.preventDefault();
					tabNavigate(self, $this, options);
				});
			}
		);		
	};
	
	// some function
	var 
	// calculate tabWidth array
	calcTabsWith = function (self, options){
		var $tabs = $(self).find( options.listElementSelector ); //get all tabs
		// for each tabs, calculate the end position of the tabs since position 0
		$tabs.each(function(i){
			self.tabWidth.push(self.tabWidth[i] + $($tabs[i]).outerWidth());
		});
	},
	// animate the tabs
	tabNavigate = function(self, $arrow, options) {
		var arrowOption = options.arrowDirection // options of the navigation arrow 
			,direction = $arrow.attr(arrowOption.attr) == arrowOption.valueAttrNext ? arrowOption.valueNext : arrowOption.valuePrev; //get the direction of the arrow clicked

		// check if we need to animate
		(self.tabPos +direction < self.tabWidth.length-1 && self.tabPos + direction >= 0)
			&& $(self).find( options.listSelector )
				.stop(true,true)
				.animate({left: "-"+(self.tabWidth[self.tabPos+direction])},100, function() {
					//get new position
					self.tabPos += direction;
					// manage arrow only if there's not always visible
					!options.arrowAlwaysVisible && manageArrow(self, options);
				});
	},
	// manage arrow, check if need to show or hide it
	manageArrow = function (self, options) {
		// be sure to show the arrow
		if (options.arrowAlwaysVisible) {
			showNavButton(self, options, options.arrowDirection.valueAttrPrev, true);
			showNavButton(self, options, options.arrowDirection.valueAttrNext, true);
		}else{
			//hide or show less button
			if(self.tabPos > 0){
				showNavButton(self, options, options.arrowDirection.valueAttrPrev, true);
			}else{
				showNavButton(self, options, options.arrowDirection.valueAttrPrev, false);
			}

			//hide or show more button
			if((self.tabWidth[self.tabPos] ? self.tabWidth[self.tabPos] : 0) < (self.tabWidth[self.tabWidth.length-1] - $(self).outerWidth())){
				showNavButton(self, options, options.arrowDirection.valueAttrNext, true);
			}else{
				showNavButton(self, options, options.arrowDirection.valueAttrNext, false);
			}
		}
	},
	// show or hide arrow
	showNavButton = function (self, options, button, show ) {
		if (typeof show === 'undefined') show = true;

		var $node = null; // node of the arrow
		if (show) {
			$node = $(self).find(options.arrowSelector+'['+options.arrowDirection.attr+'="'+button+'"]:hidden');
			if ($node.length > 0) {
				$node.show();
			}
		} else {
			$node = $(self).find(options.arrowSelector+'['+options.arrowDirection.attr+'="'+button+'"]:visible');
			if ($node.length > 0) {
				$node.hide();
			}
		}
	}

	/**
	 * default options for every instance of the plugin
	 */
	$.fn.jPGNav.defaultOptions =
	{
		arrowSelector: '.jAnimateTabs' // usualy a class on <div> or <a>
		,arrowDirection: { attr: 'data-animate-direction', valueAttrPrev: 'prev', valueAttrNext: 'next', valuePrev : -1, valueNext : 1 }
		,listSelector: '.jList' //usualy a class on a <ul>
		,listElementSelector: '.jList li'
		,arrowAlwaysVisible: false // pass to true if arrow always visible
	};

}(jQuery));