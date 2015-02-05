(function($)
{
	'use strict';
	
	$.fn.jPGNav = function(mainParameter,options)
	{
		
		options = $.extend({},$.fn.jPGNav.defaultOptions, options);
		return this.each(
			function()
			{
				var $this = $(this);
				console.log('ici');
				$( options.arrowSelector ).click(function(e) {
					var $this = $(this);
					e.preventDefault();
					console.log('clic');
					$.fn.jPGNav.tabNavigate($this, options);
				});
				
				calcTabsWith(options);
				//$.fn.jPGNav.getTabSelectedPosition();
				//$.fn.jPGNav.manageArrow();
				/*if($.fn.jPGNav.selectedTabs != null){
					$.fn.jPGNav.tabSelect($.fn.jPGNav.selectedTabs);
				}*/
			}
		);
	};
	
	$.fn.jPGNav.tabPos = 0;
	
	function calcTabsWith(options){		
		var $tabs = $( options.listElementSelector );
		
		$.fn.jPGNav.tabWidth = [0];
		$tabs.each(function(i){
			$.fn.jPGNav.tabWidth.push($.fn.jPGNav.tabWidth[i] + $($tabs[i]).outerWidth());
		});
	}
	
	$.fn.jPGNav.tabNavigate = function($arrow, options) {		
		var arrowOption = options.arrowDirection
			,direction = $arrow.attr(arrowOption.attr) == arrowOption.valueAttrNext ? arrowOption.valueNext : arrowOption.valuePrev;
				
		console.log($.fn.jPGNav.tabPos + direction, $.fn.jPGNav.tabWidth.length-1 );
		($.fn.jPGNav.tabPos +direction < $.fn.jPGNav.tabWidth.length-1 && $.fn.jPGNav.tabPos + direction >= 0)
			&& $( options.listSelector )
				.stop(true,true)
				.animate({left: "-"+($.fn.jPGNav.tabWidth[$.fn.jPGNav.tabPos+direction])},100, function() {
					console.log('animate');
					//get new position
					$.fn.jPGNav.tabPos += direction;
					//$.fn.jPGNav.manageArrow();
				});
	};

	/**
	 * default options for every instance of the plugin
	 */
	$.fn.jPGNav.defaultOptions =
	{
		arrowSelector: '.jAnimateTabs' // usualy a class on <div> or <a>
		,arrowDirection: { attr: 'data-animate-direction', valueAttrPrev: 'prev', valueAttrNext: 'next', valuePrev : 1, valueNext : 1 }
		,listSelector: '.jList' //usualy a class on a <ul>
		,listElementSelector: '.jList li'
	};

}(jQuery));