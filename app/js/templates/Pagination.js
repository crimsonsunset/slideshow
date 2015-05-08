/**
 * Constructor used to create Pagination Dots
 * @param {string} id - an id associated with an slide
 * @param {number} total - the total number of items
 * @param {number} itemsPerPage - the number of items per page
 */
function Pagination(id, total,itemsPerPage) {

    var COMPONENT_CLASS = "pager"

    var pager = $("<div/>", {
        "class": COMPONENT_CLASS,
        "id": id
    })

    var pageNum=1;
    for (var i = 0; i < total; i=i+itemsPerPage) {

        var clickElem = $('<a/>', {
            "text": pageNum,
            "id": "pageDot-"+String(pageNum-1)
        }).on( "click", function(data) {
            //register function to be fired on pagination dot click
            slideshow.goToPage(data.target,data.target.parentNode);
        });
        //append dots to main container
        pager.append(clickElem)
        pageNum++;
    }

    $(pager.children()[0]).addClass('active');

    return pager
}

//Main Pagination Constructor Returns:
//<div id="pager">
//<a  class="">1</a>
//<a  class="">2</a>
//<a class="activeSlide">3</a>
//</div>

/**
 * Constructor used to create Mobile Pagination (Words)
 * @param {string} id - an id associated with an slide
 * @param {number} total - the total number of items
 * @param {number} startAt - the index to display on pagination initialization
 */
function MobilePagination(id, total,startAt) {

    var COMPONENT_CLASS = "mobilePager"
    var BTN_CONT_CLASS = "mobilePagerBtnCont"
    var BTN_CLASS = "mobilePageBtn"
    var NUMBER_CLASS = "mobilePageNum"

    var pager = $("<div/>", {
        "class": COMPONENT_CLASS,
        "id": id
    })

    var btnCont = $("<div/>", {
        "class": BTN_CONT_CLASS
    })
    var numbers = $("<div/>", {
        "class": NUMBER_CLASS,
        "text": startAt + " of " + total
    })
    var leftArrow = $("<button/>", {
        "class": BTN_CLASS,
        "text": "«"
    }).on( "click", function(data) {
        slideshow.prev();
    });
    var rightArrow = $("<button/>", {
        "class": BTN_CLASS,
        "text": "»"
    }).on( "click", function(data) {
        slideshow.next();
    });

    btnCont.append(leftArrow).append(numbers).append(rightArrow)
    pager.append(btnCont)
    return pager
}

//Mobile Constructor returns:
//<div class="mobilePager">
//<div class="mobilePagerBtnCont">
//<button class="mobilePageBtn">«</button>
//<div class="mobilePageNum">1 of 10</div>
//<button class="mobilePageBtn">»</button>
//</div>
//</div>