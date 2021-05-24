/*!
* jQuery StickIt plugin
 * Original author: Edward Karisch (@efkarisch)
 * Description: Plugin to watch an element and apply/remove classes to a target element when scrolling to or from the watched reference element
 * Licensed under the MIT license
 */

(function($){

    $.stickIt = function(targetElementSelector, triggerElementSelector, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(triggerElementSelector);
        base.el = triggerElementSelector;
        base.$targetEls = $(targetElementSelector);

        private = {};
        
        // Add a reverse reference to the DOM object
        base.$el.data("stickIt", base);

        private.check = function(JqueryObject, selector, actionString){
            
            if( JqueryObject.length == 0 ){

                var msg = 'Unable to find element for' + actionString + ' action using '

                if(typeof triggerElementSelector === 'string'){

                    $.error( msg + 'selector: ' + selector );

                }else {

                    $.error( msg + 'the Jquery object supplied for : selector not found.');
                }

            }
        }
        
        base.init = function(){

            //make sure good selectors are passed in:
            private.check(base.$el,triggerElementSelector, 'triggering')
            private.check(base.$el,targetElementSelector, 'attaching scroll observation ')


            //set properties
            base.options = $.extend({},$.stickIt.defaultOptions, options);
            
            //get element to scroll to plus/minus offset
            base.pos = base.$el.offset().top  + base.options.offsetY;

            if(base.options.debug){
                console.log('offset of triggering element is set to' + base.pos);
            }
            
        };

        base.stick = function(){

            base.$targetEls.removeClass(base.options.inActiveClasses);
            base.$targetEls.addClass(base.options.activeClasses);
        }
    
        base.unstick = function(){

            base.$targetEls.removeClass(base.options.activeClasses);
            base.$targetEls.addClass(base.options.inActiveClasses)
        }

        private.determineAction = function(){

            switch(base.options.ref){

                case 'after':
                    default:
                        return base.pos > $(document).scrollTop()
                    break;
                case 'before':
                        return base.pos < $(document).scrollTop()
                    break;
            }
        }

        base.detach = function(){

            $(document).unbind('scroll');
        }

        private.runOnce = function(){
            // only stick a single time
            base.stick()
            base.detach();
        }

        private.action = function(){

            var determineAction = private.determineAction();

            if(base.options.toggle){

                if(determineAction){

                    base.unstick()

                }else{

                    base.stick()
                    
                }

            }else{

                if(determineAction) private.runOnce()

            }
            
        }

        private.attach = function(){

            $(document).scroll(function(){
                private.action();
            })
        }


        base.destroy = function(){
    
                base = null;
                private = null;
                this.detach();
        }

        //run these on initialization
        base.init(); //setup properties and options
        private.attach(); //attach scroll functionality
        base.unstick();

        return this;

    };
    
    $.stickIt.defaultOptions = {
        toggle: true,
        ref: 'after',
        offsetY: 0,
        activeClasses:'stick',
        inActiveClasses:'unstick',
        debug:false,
    };

    $.fn.stickIt = function(triggerElementSelector, options){
        
        return this.each(function(){

           return (new $.stickIt(this, triggerElementSelector, options));

        });

    }
    
})(jQuery);


//Usage::::::::::::

// $(function() {

//     (targetElementSelector).stickIt(triggerElementSelector, {
//          toggle: [true,false]  - boolean - // toggle or make the stick action apply only once
//          ref: ['before','after], - string - //fire the trigger before you get to the element target
//          offsetY: [ -# , +#] - integer (negative or positive) // trigger offset of triggering element increases / decreases with +/- (use with ref=before/after to determine when trigger will fire)
//          activeClasses: - string - // can be single string or space delimited list, sets one or many classes to the active method. (toggling or once)
//          inActiveClasses: - string - // can be single string or  space delimited list, sets one or many classes to the Inactive method (when toggling).
//          debug: - boolean - //if set to true, console some things (update needs more things)
//     });
// });


//other examples:

//perform class manipulation to <footer> element and attach scroll listener to <section class="content"> element 
//when scroll past section 

$('footer').stickIt('section.content',{/** options object **/})