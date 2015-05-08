/**
 * Constructor used to create a Slide
 * @param {integer} startInd - the index to the current slide at
 * @param {integer} itemsPerPage - the amount of items on the current slide
 * @param {array} imgArr - an array of paths to images
 * @param {function} updateFunc - the function to be called upon button press
 */
function Slide(startInd, itemsPerPage, imgArr, updateFunc) {

    var SLIDE_CLASS = "slide"
    var CONTENT_CLASS = "contentBox"
    var IMG_CLASS = "currImg"
    var INNER_CLASS = "innerContentBox"
    var TITLE_CLASS = "title"
    var BTN_CLASS = "actionBtn"

    var slide = $("<div/>", {
        "class": SLIDE_CLASS,
        "id": "slide-" + startInd
    })
    var i = startInd;
    for (; i < itemsPerPage + startInd; i++) {

        //if you're out of items in your array, dont create element
        if (!imgArr[i]) {
            break
        } else {
            var box = $('<div>', {
                "class": CONTENT_CLASS,
                "id": "box-" + i
            });
            var img = $('<div>', {
                "class": IMG_CLASS,
                "id": "img-" + i
            });

            var innerBox = $('<div>', {
                "class": INNER_CLASS,
                "id": "innerBox-" + i
            });

            var baconyWord = slideshow.titles[i]
            var title = $('<div>', {
                "class": TITLE_CLASS,
                "text": baconyWord,
                "id": "title-" + i
            });

            var btn = $('<div>', {
                "class": BTN_CLASS,
                "text": "Tasty " + baconyWord,
                "id": "btn-" + i
            }).on( "click", title,function(event) {
                //title from corresponding button is passed in event.data, use it for callback
                updateFunc.apply(this, [$(event.data[0]).text()])
            });

            //image
            img.css("background-image", "url(" + imgArr[i] + ")");
            img.appendTo(box)

            //title and button
            title.appendTo(innerBox)
            btn.appendTo(innerBox)

            //add bottom to box
            innerBox.appendTo(box)

            box.appendTo(slide)
        }
    }

    //support for swiping without jquery
    var maxTime = 1000,
    // allow movement if < 1000 ms (1 sec)
        maxDistance = 50,
    // swipe movement of 50 pixels triggers the swipe
        target = slide,
        startX = 0,
        startTime = 0,
        touch = "ontouchend" in document,
        startEvent = (touch) ? 'touchstart' : 'mousedown',
        moveEvent = (touch) ? 'touchmove' : 'mousemove',
        endEvent = (touch) ? 'touchend' : 'mouseup';

    target.bind(startEvent, function (e) {
        // prevent image drag (Firefox)
        e.preventDefault();
        startTime = e.timeStamp;
        startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
    }).bind(endEvent, function (e) {
        startTime = 0;
        startX = 0;
    }).bind(moveEvent, function (e) {
        e.preventDefault();
        var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
            currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
        // allow if movement < 1 sec
            currentTime = e.timeStamp;
        if (startTime !== 0 && currentTime - startTime < maxTime && currentDistance > maxDistance) {
            if (currentX < startX) {
                console.log("LEFT SWIPE")
                slideshow.next()
            }
            if (currentX > startX) {
                console.log("RIGHT SWIPE")
                slideshow.prev()
            }
            startTime = 0;
            startX = 0;
        }
    });
    return slide
}

//Constructor Returns:
//<div class="slide">
//<div class="contentBox">
//<div class="currImg"></div>
//<div class="innerContentBox">
//<div class="title"> My Title Here</div>
//<button class="actionBtn">New Hotness</button>
//</div>
//</div>
//</div>