## JS/JQuery Slider 

* I used jQuery as my primary JS framework. Most manipulation of the HTML occurs using jQuery selectors.
* The code is all home-grown, with the exception of a few common-use functions I found just googling around (namely, shuffle and window-resize throttling)
* I separated the code out into logical pieces, even though some of the js files (namely, the templates) were relatively small. 
* Extras: 
* Can check out the extras by calling slideshow.init() with different parameters.
* Flipping the first boolean to true will randomize the order of the pictures as well as the next buttons. 
* Flipping the second boolean will make actual API calls to bacon ipsum and gettyimages, and will populate the slideshow with dynamic data from the responses.
* Slide events are captured and will register the same as tapping next/previous buttons.