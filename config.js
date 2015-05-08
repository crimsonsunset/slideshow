/**
 * Getter function that returns customized configuration options.
 * User can edit these to choose files for the slideshow
 */
function getConfig(imageFolder, randomize) {

    //TODO: write server code to get items in directory dynamically
    var imageArr = [
        "71611422.jpg",
        "74411643.jpg",
        "75883096.jpg",
        "85650222.jpg",
        "85650663.jpg",
        "102283848.jpg",
        "169674958.jpg",
        "200517399-001.jpg",
        "462467815.jpg",
        "472453410.jpg",
        "sb10067958dm-001.jpg"
    ]
    for (var i = 0; i < imageArr.length; i++) {
        imageArr[i] = imageFolder + imageArr[i];
    }
    //randomize order of pictures if desired
    (randomize) ? shuffle(imageArr) : $.noop()

    return imageArr;

}

/**
 * Function that calls baconIpsum generator for random meat-related words
 */
function getBaconIpsum() {
    return $.getJSON('http://baconipsum.com/api/?callback=?',
        {'type': 'all-meat', 'paras': '1'});
}
/**
 * Function that calls gettyimages API for random meat-related pictures
 */
function getBaconyPics() {
    return $.ajax({
        url: "https://api.gettyimages.com/v3/search/images?orientations=Horizontal&phrase=meat",
        headers: { 'Api-Key': "9qgr2g33nbuhwzhaez8v43kc" }
    })
}
