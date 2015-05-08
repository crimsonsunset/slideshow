/**
 * The slideshow operator will maintain all information about the current slideshow,
 * and provide methods to interact with it
 */
var slideshow = (function () {
    var slideshow = {}
    var slideIndex = 0;
    var currDotElem;
    var paginationElem;
    var random =false;
    var isMobile=false;
    var resizeTimer; // Set resizeTimer to empty so it resets on page load
    var ITEMS_PER_PAGE =4
    var DEFAULT_PER_PAGE =4
    var NUM_ITEMS =11
    var MOBILE_BREAKPOINT =562;
    var TIMER_INTERVAL=500;
    slideshow.imageArr = []
    slideshow.titles = "Brisket corned beef t-bone rump shank drumstick sirloin pork loin meatloaf picanha ball tip shankle fatback pork chop. Tail rump pork loin".split(" ")

    /**
     * Go to the next set of pictures in the slideshow
     */
    slideshow.prev = function () {
        rotateSlide(false)
        swapPage()
    }
    /**
     * Go to the previous set of pictures in the slideshow
     */
    slideshow.next = function () {
        rotateSlide(true)
        swapPage()
    }
    /**
     * Go to the previous picture in the slideshow
     */
    slideshow.goToPage = function (activePageBtn,pagination) {

        paginationElem = $(pagination);
        currDotElem = $(activePageBtn);
        paginationElem.children().removeClass("active");
        currDotElem.addClass('active');

        //get id for new page
        var id = activePageBtn.id
        var newPageInd = id.substring(id.indexOf("-")+1)
        slideIndex = newPageInd
        swapPage()
    }

    /**
     * Function that handles changing out the slide with the next slide
     * utilizes the random variable as well as a directional boolean
     * @param {boolean} isNext - directional boolean -- previous or next
     */
    function rotateSlide(isNext) {

        var useInd;

        //randomize?
        if(random){
            //find topbound of available slides
            var topBound = (isMobile) ? slideshow.imageArr.length-1 : Math.floor(slideshow.imageArr.length/ITEMS_PER_PAGE)
            useInd = getRandomInt(0,topBound)
            //prevent same index two times in a row
            while(slideIndex == useInd){
                useInd =getRandomInt(0,topBound)
            }
            slideIndex = useInd
        }
        else{
            (isNext) ? slideIndex++ : slideIndex--;

            //next arrow has past bounds of array
            if (slideIndex*ITEMS_PER_PAGE > slideshow.imageArr.length - 1) {
                slideIndex = 0
            }
            //prev arrow has past bounds of array
            else if (slideIndex*ITEMS_PER_PAGE < 0) {
                slideIndex = Math.round(slideshow.imageArr.length / ITEMS_PER_PAGE)-1
            } else {}

            useInd = slideIndex
        }

        //once indices are straightened out, can move to the next slide
        $('#img-0').css("background-image", "url("+slideshow.imageArr[useInd]+")");
        (isMobile) ? $(".mobilePageNum").text(useInd+1+" of " +slideshow.imageArr.length) : updatePageDot(useInd)
    }

    /**
     * Creates a new page utilizing the sanitized slideIndex
     */
    function swapPage(){
        $("#slideInnerContainer").empty().append(Slide(slideIndex*ITEMS_PER_PAGE,ITEMS_PER_PAGE,slideshow.imageArr,btnClick))
    }

    /**
     * Updates the pagination dots accordingly when they are clicked
     * @param {boolean} newInd - the index of the new page
     */
    function updatePageDot(newInd){
        paginationElem.children().removeClass("active");
        currDotElem = $("#pageDot-"+newInd)
        currDotElem.addClass('active');
    }

    /**
     * Callback function for button click
     */
    function btnClick(titleTxt){
        alert("You're right, "+ titleTxt + " is quite tasty!")
    }


    //register listener for resizing, will have to re-do what is
    // displayed if it enters/exits mobile view without reloading
    //use throttling approach to control over-firing
    //http://gomakethings.com/javascript-resize-performance/
    $( window ).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeFunction, TIMER_INTERVAL);
    });

    /**
     * Function fired upon resizing the window
     */
    function resizeFunction() {

        if (isMobile && window.innerWidth >= MOBILE_BREAKPOINT) {
            console.log("going to bigger layout")
            isMobile =false;
            redraw()

        }else if (!isMobile && window.innerWidth <= MOBILE_BREAKPOINT) {
            console.log("going to smaller layout")
            isMobile =true;
            redraw()
        } else {

        }
    }

    /**
     * Utilized on window resize to swap out slideshow inner content and change pagination style
     */
    function redraw(){

        //empty pagination elements, they will be re-populated appropriately
        paginationElem.empty()
        $("#paginationInnerContainer").empty()

        //user has resized to mobile
        if (isMobile) {
            slideIndex =slideIndex*ITEMS_PER_PAGE
            paginationElem = MobilePagination("pagerz",slideshow.imageArr.length,slideIndex+1)
            ITEMS_PER_PAGE = 1
        } else {
            //user has resized to tablet/desktop
            //reset back to defaults
            ITEMS_PER_PAGE = DEFAULT_PER_PAGE
            slideIndex =Math.round(slideIndex/ITEMS_PER_PAGE)
            paginationElem = Pagination("pager",slideshow.imageArr.length,ITEMS_PER_PAGE)
            $("#slideInnerContainer").empty().append(Slide(0,ITEMS_PER_PAGE,slideshow.imageArr,btnClick))

            //need timeout to let divs populate, then can fire functions to update the inner content
            setTimeout(function(){
                swapPage();
                updatePageDot(slideIndex)
            }, 10);
        }
        $("#paginationInnerContainer").append(paginationElem)
    }

    /**
     * Initialization Function to be called from main.
     * readies controller for interaction with other parts of the app
     * @param {boolean} randomize - dictates whether buttons will produce the next logical img
     * @param {string} srcPath - the path to where the images are stored
     * @param {boolean} useAPIs - dictates whether to call APIs to dynamically populate slideshow
     */
    slideshow.init = function (randomize,srcPath, useAPIs) {
        random = randomize
        slideshow.imageArr = getConfig(srcPath, random)

        if (useAPIs) {

            $.when(getBaconIpsum(),getBaconyPics())
                .done(function( resp ,resp2) {

                    slideshow.titles = resp[0][0].split(" ")
                    //remove blank items from array
                    slideshow.titles = slideshow.titles.filter(Boolean)
                    //parse out actual image urls
                    slideshow.imageArr = $.map(resp2[0].images, function(e ) {
                        return e.display_sizes[0].uri
                    });

                    //randomize the cool meat pics then limit to 11
                    shuffle(slideshow.imageArr)
                    slideshow.imageArr.splice(NUM_ITEMS)
                })
                .fail(function( err ) {
                    console.log("error" + err)
                    slideshow.titles = "Bacon Ipsum Must Be Offline Or The Internet Has Been Destroyed. Oh Dear.".split(" ")
                })
                .always(function() {
                    finishInit()
                })

        } else {
            finishInit()
        }

        function finishInit(){
            //wire up the next and previous buttons
            $("#prevSlideBtn").click(slideshow.prev);
            $("#nextSlideBtn").click(slideshow.next);

            //randomize first img if necessary
            var useInd = (random) ? getRandomInt(0,slideshow.imageArr.length-1) : slideIndex;

            //build pagination based on regular/mobile layout
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                isMobile = true
                ITEMS_PER_PAGE = 1
                paginationElem = MobilePagination("pagerz",slideshow.imageArr.length,1)
            } else {
                isMobile = false
                paginationElem = Pagination("pager",slideshow.imageArr.length,ITEMS_PER_PAGE)
                currDotElem = $(paginationElem.children()[0])
            }

            //create a slide and put it into the inner container
            $("#slideInnerContainer").append(Slide(0,ITEMS_PER_PAGE,slideshow.imageArr,btnClick))
            $("#paginationInnerContainer").append(paginationElem);
        }


    }
    return slideshow;
}());

$(document).ajaxError(function(e, xhr, settings, exception) {

    console.log('asd')

});