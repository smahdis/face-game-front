
/*
    This method is a general method which randomly shuffles any array,
     We use it to randomise images on page reload.
*/
function shuffle(array) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

/*
    This method calculates the direction of the mouse and
    will return a value form -360 to +360.
    We use this to know which corner the mouse has targeted.
 */
function getDirection(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.atan2(dx, dy) / Math.PI * 180
}

/*
    This part is copied from stackoverflow. It is using jquery-ui and it is
    resposible for for  making the image draggable.
    When the animations finishes, it calls our function to make the image
    move towards the corresponding corner.
 */

$(function () {
    var $d = $("#draggable");

    var x1, x2,
        y1, y2,
        t1, t2;  // Time

    var minDistance = 40; // Minimum px distance object must be dragged to enable momentum.

    var onMouseMove = function (e) {
        var mouseEvents = $d.data("mouseEvents");
        if (e.timeStamp - mouseEvents[mouseEvents.length - 1].timeStamp > 40) {
            mouseEvents.push(e);
            if (mouseEvents.length > 2) {
                mouseEvents.shift();
            }
        }
    };

    var onMouseUp = function () {
        $(document).unbind("mousemove mouseup");
    };

    $d.draggable({
        start: function (e, ui) {
            $d.data("mouseEvents", [e]);
            $(document)
                .mousemove(onMouseMove)
                .mouseup(onMouseUp);
        },
        stop: function (e, ui) {
            $d.stop();
            $d.css("text-indent", 100);

            var lastE = $d.data("mouseEvents").shift();

            x1 = lastE.pageX;
            y1 = lastE.pageY;
            t1 = lastE.timeStamp;
            x2 = e.pageX;
            y2 = e.pageY;
            t2 = e.timeStamp;

            $angle = getDirection(x1, y1, e.pageX, e.pageY)
            moveTowardCorner($angle);
        }
    });
});

