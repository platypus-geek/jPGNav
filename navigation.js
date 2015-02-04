/**
 * Tabs scrolling
 * 
 * @author Julien Specker <jspecker@ccmbenchmark.com>
 * @version 18/11/2014 Creation
 */
(function($)
{
	"use strict";
		
	/**
	 * navigate tabs : actions of tabs bar
	 */
	$.navTabs = {
		/** @var {array} : width of all tabs**/
		tabWidth : []
		/** @var int : tabs position**/
		,tabPos : 0
		/** @var int : tabs position of selected tab**/
		,selectedTabs : $( ".jNavTabsList li:not(.fillin):first" )
		,selectedTabPos : 0
		,selectedTabsPosWidth : 0
		,isInit : false
		,init : function()
		{
			// first try init
			$.navTabs.tryInit();
			
			// look for resiz event and try init.
			$( window ).resize(function() {
				$.navTabs.tryInit();
			});
		}
		,tryInit : function(){
			if(!$.navTabs.isInit){
				if($('.dico_mobile_nav').css('display') == 'block'){
					$.navTabs.initNav();
					$.navTabs.isInit = true;
				}
			}else{
				if($('.dico_mobile_nav').css('display') != 'block'){
					$.navTabs.removeNav();
					$.navTabs.isInit = false;
				}
			}
		}
		,removeNav : function(){
			$('.tabsContent').show();
			$( ".jAnimateTabs, jSelectTabs, jTabsSelect" ).unbind('click');
		}
		,initNav : function()
		{
			//tabs to select when click with tabs content already load
			// example on season in program page
			$( ".jTabsSelect" ).click(function(e) {
				var $this = $(this);
				e.preventDefault();
				$.navTabs.tabSelect($this);
			});
			
			//If other link in page could select a tab
			// example, header bloc on program page when they are season
			$( ".jSelectTabs" ).click(function(e) {
				var $this = $(this)
					,$tabToSwitch = $( ".jTabsSelect[data-key|='"+$this.attr('data-key')+"']" );
				e.preventDefault();
				// select the tab
				$.navTabs.tabSelect($tabToSwitch);
				
				// scroll to the block with the tab
				$('html,body').animate({
					scrollTop: $tabToSwitch.offset().top - 50
				}, 1000);
			});
			
			// arraow to animate tabs (left/right) when they're more tabs than the space to show it
			$( ".jAnimateTabs" ).click(function(e) {
				var $this = $(this);
				e.preventDefault();
				$.navTabs.tabNavigate($this);
			});
			
			$.navTabs.calcTabsWith();
			$.navTabs.getTabSelectedPosition();
			$.navTabs.manageArrow();
			if($.navTabs.selectedTabs != null){
				$.navTabs.tabSelect($.navTabs.selectedTabs);
			}
		}
		,calcTabsWith: function(){
			var $tabs = $( ".jNavTabsList li:not(.fillin)" );
			
			$.navTabs.tabWidth = [0];
			$tabs.each(function(i){
				$.navTabs.tabWidth.push($.navTabs.tabWidth[i] + $($tabs[i]).outerWidth() + $( ".jNavTabsList li.fillin:first" ).outerWidth());
				if($($tabs[i]).hasClass('jIsSelected')){
					$.navTabs.selectedTabs = $($tabs[i]);
					$.navTabs.selectedTabsPos = $.navTabs.tabWidth[i];
					$.navTabs.selectedTabsPosWidth = $($tabs[i]).outerWidth();
				}
			});
		}
		,showNavButton: function($tabs, button, show)
		{
			if (typeof show === 'undefined') show = true;

			var $node = null;
			var $navTabs = $tabs.find('.jNavTabs');
			if (show) {
				$node = $tabs.find('.jAnimateTabs[data-animate-direction="'+button+'"]:hidden');
				if ($node.length > 0) {
					$node.show();
				}
			} else {
				$node = $tabs.find('.jAnimateTabs[data-animate-direction="'+button+'"]:visible');
				if ($node.length > 0) {
					$node.hide();
				}
			}
		}
		// function to show the content of a tab and select it
		,tabSelect: function($this){
			$( ".jTabsSelect" ).removeClass('ui-tabs-selected ui-state-active');
			$this.addClass('ui-tabs-selected');
			$this.addClass('ui-state-active');
			$('.tabsContent').hide();
			$('#'+$this.attr('data-key')).show();
		}
		
		// animate tab sliding when nivigate on it
		,tabNavigate: function($this){			
			var direction = $this.attr('data-animate-direction') == 'more'?1:-1; //get the direction
			($.navTabs.tabPos +direction <= $.navTabs.tabWidth.length-1 && $.navTabs.tabPos +direction >= 0)
				&& $( ".jNavTabsList" )
				.stop(true,true)
				.animate({left: "-"+($.navTabs.tabWidth[$.navTabs.tabPos+direction])},100, function() {
					
					//get new position
					$.navTabs.tabPos += direction;
					$.navTabs.manageArrow();
				});
		}
		
		// manage navigation arrow
		,manageArrow: function(){
			//hide or show less button
			if($.navTabs.tabPos > 0){
				$.navTabs.showNavButton($('.jTabs'), 'less');
			}else{
				$.navTabs.showNavButton($('.jTabs'), 'less', false);
			}

			//hide or show more button
			if(($.navTabs.tabWidth[$.navTabs.tabPos]?$.navTabs.tabWidth[$.navTabs.tabPos]:0) < ($.navTabs.tabWidth[$.navTabs.tabWidth.length-1] - $( ".jNavTabs").outerWidth())){
				$.navTabs.showNavButton($('.jTabs'), 'more');
			}else{
				$.navTabs.showNavButton($('.jTabs'), 'more', false);
			}
		}
		// start position with selected tabs selected visible
		,getTabSelectedPosition: function($this){
			var navWidth = $( ".jNavTabs").outerWidth(),
				arrowWidth = $( ".jAnimateTabs[data-animate-direction]:last").outerWidth();
			
			// if selected tabs outer of the visible nav, need to calculate the slide start have it visible
			if($.navTabs.selectedTabsPos > navWidth){
				
				var relativeSelectedPos = 0, // calculated position of selected tab if visible
					navWidthWithoutSelectedTab = navWidth - $.navTabs.selectedTabsPosWidth - 2*arrowWidth; // width of vivisble nav zone without the seleced tab and navigation arrow
					
				// loop on tabWidth to find the new start position
				for(var j=0; j<$.navTabs.tabWidth.length; j++){
					relativeSelectedPos = $.navTabs.selectedTabsPos-$.navTabs.tabWidth[j];
					
					if(relativeSelectedPos <= navWidthWithoutSelectedTab){
						// set the tabPos start
						$.navTabs.tabPos = j;
						// start position is not 0
						// start position is start of the tab - arraowidth
						var startPos = $.navTabs.tabWidth[j] - $.navTabs.selectedTabsPosWidth - arrowWidth;
						$( ".jNavTabsList" ).css('left',"-"+startPos+"px");
						break;
					}
				}
				//manage arrow
				$.navTabs.manageArrow();
			}
		}
	}
	
	var activeClass = $('body').attr('class').match(/j([A-Za-z]*)Active/);
	if ( activeClass != null ) {
		$( ".jWebTabs a" ).removeClass('active');
		$('.jWebTabs .j'+activeClass[1]).addClass('active');
		
		$( ".jNavTabsList li" ).removeClass('jIsSelected');
		$('.jNavTabsList .j'+activeClass[1]).addClass('jIsSelected');
	}
	
	$(document)
		.bind('hammerLoaded',function(){
			$('.jTabs').touchslide({slidesSelector:'.jNavTabsList'});
		})
		.ready(
			function(){
				$.navTabs.init();
			}
		);
	
}(jQuery));
