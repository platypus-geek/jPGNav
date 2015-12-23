(function($)
{
	'use strict';
	/**
	* sliding nodes
	* @param {object} options plugin options	
	* @return {object} this
	*/
	$.fn.sliding = function(options)
	{
		options = $.extend({},$.fn.sliding.defaultOptions, options);
		var $this = this.each(
			function()
			{
				// initiate some properties				
				this.tabWidth = [0]; //array with the calculate width of each tabs since position 0
				this.tabPos = 0; //index of tabWidth
				var self			= this
					,$self			= $(this)
					,$listSelector	= $self.find( options.listSelector )
					;
				
				// initiate tabWidth
				calcTabsWith.call(this, options);
				
				// initiate position if not 0
				if (self.tabPos > 0) {
					animation.call(this, $listSelector, options, 0);
				}
				
				// initiate arrow
				manageArrow.call(this, options);
			
				// if click on an arrow, need to navigate
				$self.find(options.arrowSelector ).click(function(e) {
					var $this = $(this);
					e.preventDefault();
					tabNavigate.call(self, $this, options);
				});
				
				var timeoutResize = 0;
				$( window ).bind('resize', function(e) {
					clearTimeout(timeoutResize);
					setTimeout(function()
					{
						typeof options.beforeResize === 'function' && options.beforeResize.call($this);
						calcTabsWith.call(self, options);
						manageArrow.call(self, options);
						animation.call(self, $listSelector, options, 0);

						$self.trigger('postResized');	
					},options.resizeDelay);
				});
			}
		);

		$this.setOptions = function(newOptions){
			var oldOptions = options;
			options = $.extend({}, options, newOptions);	
			// if scroll direction change, must init the slide
			if (options.scrollDirection !== oldOptions.scrollDirection) {
				var $listSelector = $this.find( options.listSelector );
				$listSelector.css({top : '0px', left : '0px'});
				$this[0].tabWidth = [0];
			}
		};
		return $this;
	};
	
	/**
	* calculate outerSize of an element, it depend of scroll direction
	* @param {object} self plugin node instance
	* @return {void}
	*/
	var getOuterSize = function($node, options) {		
		if (options.scrollDirection === 'left' || options.scrollDirection === 'right') {			
			return $node.outerWidth(true);
		}
		return $node.outerHeight(true);
	},
	/**
	* calculate tabWidth array Use only on init and resize (resize call init)
	* @param {object} self plugin node instance
	* @param {object} options plugin options	
	* @return {void}
	*/
	calcTabsWith = function (options){
		var self = this
			,$tabs = $(self).find( options.listElementSelector ); //get all tabs
			 
		// for each tabs, calculate the end position of the tabs since position 0
		$tabs.each(function(i){
			var elementSize = self.tabWidth[i] + getOuterSize($($tabs[i]), options) + options.deltaBetweenElements;
			self.tabWidth.push(elementSize);
			
			if($($tabs[i]).is(options.elementSelectedSelector)){
				if (elementSize > getOuterSize($(self), options)) {
					var l = self.tabWidth.length -1;
					for (var j = 0; j <= l; j++) {
						if (elementSize - self.tabWidth[j] < getOuterSize($(self), options)) {
							self.tabPos = j;
							break;
						}
					}
				}
			}
		});
		if (getOuterSize($(self).find(options.navContainerSelector), options) > getOuterSize($(self).find( options.listSelector ), options) ) {
			self.tabPos = 0;
		}
	},
	
	/**
	* animate the tabs if need it
	* @param {object} $arrow node of the arrow clicked
	* @param {object} options plugin options	
	* @return {void}
	*/
	tabNavigate = function($arrow, options) {
		
		var arrowOption = options.arrowDirection // options of the navigation arrow 
			,direction = $arrow.attr(arrowOption.attr) === arrowOption.valueAttrNext ? arrowOption.valueNext : arrowOption.valuePrev //get the direction of the arrow clicked
			,self = this;

		// check if we need to animate
		(self.tabPos + direction < self.tabWidth.length-1 && self.tabPos + direction >= 0)
			&& animation.call(self, $(self).find( options.listSelector ), options, direction);				
	},
	/**
	* do the animation
	* @param {object} $this node to animate
	* @param {object} options plugin options
	* @param {integer} direction +1 or -1
	* @return {void}
	*/
	animation = function($this, options, direction) {		
		//direction = 0 => initiate position 
		var animateInstruction = {}
		,self = this;
		animateInstruction[options.scrollDirection] = "-"+(self.tabWidth[self.tabPos + direction]);
		$this
			.stop(true,true)
			.animate(animateInstruction,100, function() {
				//get new position
				self.tabPos += direction;

				// trigger event if arrive at start or end of list 
				if (self.tabPos === 0) {
					$(self).trigger('slidingStartPosition');
				}

				// no more tabs to show and there's a direction 
				if (self.tabWidth[self.tabPos] >= (self.tabWidth[self.tabWidth.length-1] - getOuterSize($(self), options)) && direction !== 0) {
					$(self).trigger('slidingEndPosition');
				}

				// manage arrow only if there's not always visible
				!options.arrowAlwaysVisible && manageArrow.call(self, options);
			});
	},
	
	/**
	* manage arrow, check if need to show or hide it
	* @param {object} options plugin options	
	* @return {void}
	*/
	manageArrow = function (options) {
		var self = this;
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
			// @todo maybe find a simpliest method			
			if((self.tabWidth[self.tabPos] ? self.tabWidth[self.tabPos] : 0) < (self.tabWidth[self.tabWidth.length-1] - getOuterSize($(self), options) + self.tabPos * options.deltaBetweenElements)){
				showNavButton(self, options, options.arrowDirection.valueAttrNext, true);
			}else{
				showNavButton(self, options, options.arrowDirection.valueAttrNext, false);
			}
		}
	},
	/**
	* Show navigation button
	* @param {object} self node instance
	* @param {object} options plugin options
	* @param {string} button attribute value of the button
	* @param {boolean} show
	* @return {void}
	*/
	showNavButton = function (self, options, button, show ) {
		if (typeof show === 'undefined') show = true;

		var $node = {}; // node of the arrow
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
	};

	/**
	 * default options for every instance of the plugin
	 */
	$.fn.sliding.defaultOptions =
	{
		arrowSelector: '.jAnimateTabs' // usualy a class on <div> or <a>
		,arrowDirection: { attr: 'data-animate-direction', valueAttrPrev: 'prev', valueAttrNext: 'next', valuePrev : -1, valueNext : 1 }
		,listSelector: '.jList' //usualy a class on a <ul>
		,listElementSelector: '.jList li'
		,arrowAlwaysVisible: false // pass to true if arrow always visible
		,deltaBetweenElements: 0 // a delta between tabs. A space for example
		,elementSelectedSelector: '.jIsSelected' // a selector if a element in the list is selected and could modify th start position
		,navContainerSelector: '.jNavTabs' // usualy a class on <nav>
		,scrollDirection: 'left' // top, bottom, right, left
		,beforeResize: function(){}
		,resizeDelay : 250 // resize temporization
	};

}(jQuery));
