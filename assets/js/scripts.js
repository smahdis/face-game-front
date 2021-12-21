
/*This is a global variable which stores the score*/
var $score = 0;

var $base_image_path = "./assets/images/";

var $player_id;
var $player_first_name;
var $player_last_name;

/*
 We shuffle the images so each time the browser opens up,
 we will face random images
 */
var $images;

/*
 This method checks the angle of mouse movement and animates the image
 towards the appropriate corner
 */
function moveTowardCorner($angle) {

    var $element_center;

    if ($angle >= 0 && $angle <= 90) {

        $element_center = getElementCenter($(".thai"));
        $("#draggable").animate({top: $element_center.centery, left: $element_center.centerx}, {
            duration: 500,
            complete: function () {
                processSelection(this, 'Thai')
            }//destroyImage(this)
        });
    } else if ($angle > 90 && $angle <= 180) {
        $element_center = getElementCenter($(".chinese"));
        $("#draggable").animate({top: $element_center.centery, left: $element_center.centerx}, {
            duration: 500,
            complete: function () {
                processSelection(this, 'Chinese')
            }
        });
    } else if ($angle < -90 && $angle > -180) {
        $element_center = getElementCenter($(".japanese"));
        $("#draggable").animate({top: $element_center.centery, left: $element_center.centerx}, {
            duration: 500,
            complete: function () {
                processSelection(this, 'Japanese')
            }
        });
    } else {
        $element_center = getElementCenter($(".korean"));
        $("#draggable").animate({top: $element_center.centery, left: $element_center.centerx}, {
            duration: 500,
            complete: function () {
                processSelection(this, 'Korean')
            }
        });
    }
}

/*
    This retuns element's centery and centerx
 */
function getElementCenter($this) {
    var offset = $this.offset();
    var width = $this.width();
    var height = $this.height();

    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;
    var center = {
        "centerx": centerX,
        "centery": centerY
    };

    console.log(center);

    return center;
}

/*
 This method checks if the player has selected the right country for the image
 and updates the score. It will also resets the image to reapear from top and
 deletes current image from the array, so that it won't apprar again.
 */
function processSelection($this, $country_collided) {
    var $current_image_country = $($this).data('country');

    if ($current_image_country === $country_collided) {
        $score += 20;
        $('.success').fadeIn(300).delay(100).fadeOut(200);
    } else {
        $score -= 5;
        $('.error').fadeIn(300).delay(100).fadeOut(200);
    }

    $('.score').text($score);

    $($this).fadeOut("slow", function () {
        $images.shift();
        resetImage($this);
    });
}

/*
 It resets the image container to its primary location and then animates it again
 It will finish the game if there are no more images in the array
 */
function resetImage($this) {
    var $box_height = $(".draggable").height();
    var $image = $images[0];
    if ($image) {
        $($this).fadeIn();
        $($this).css('background-image', 'url(' + $base_image_path + $image.filename + ')');
        $($this).css('left', 'calc(50% - 3rem)');
        $($this).css('bottom', '100%');
        $($this).css('top', '');
        $($this).data('country', $image.country);

        $(".draggable").animate({bottom: -$box_height + "px"}, {
            duration: 3000,
            easing: 'linear',
            complete: function () {
                processSelection(this)
            }
        });
    } else {
        finishGame();
    }
}

/*
 This method is called when the games is finished.
 It will hide everything and displays player's score with a
 button to replay the game
 */
function finishGame() {
//        alert('game finished');
    $('.game-env').hide();
    $('.menu_outer_parent').css('display', 'table');
    $('.summary-result').css('display', 'table');
    $('.menu_container').css('display', 'none');

    $data = {
        "score": $score
    };
    $.ajax({
        type: "POST",
        url: "https://app.smahdis.com/api/submitScore/" + $player_id,
        data: $data,
        cache: false,
        success: function(result){
        }
    });

}


$(function () {
    /*
        init user info from local storage
     */
    $player_id = localStorage.getItem('player_id');
    $player_first_name = localStorage.getItem('player_first_name');
    $player_last_name = localStorage.getItem('player_last_name');

    /*
        reload page on pressing reset game button
     */
    $('.reset-game').click(function () {
        location.reload();
    });

    /*
        Starts the game
     */
    $('.start-game').click(function () {
        startGame();
    });

    /*
        Show the leaderboard table
     */
    $('.show-leaderboard').click(function () {
        $('.summary-result').css('display', 'none');
        $('.menu_outer_parent').css('display', 'table');
        $('.menu_container').css('display', 'none');
        $('.leaderboard').css('display', 'table');

        $('.player_detail').css('display', 'none');
        // $('.menu_container').not('.leaderboard').toggle();
        handleLeaderboard();
    });

    /*
        Show about us section
     */
    $('.about-btn').click(function () {
        $('.summary-result').css('display', 'none');
        $('.menu_container').css('display', 'none');
        $('.leaderboard').css('display', 'none');
        $('.about-me').css('display', 'table');

    });

    /*
        Goes back to main menu
     */
    $('.back-to-menu').click(function () {
        $('.summary-result').css('display', 'none');
        $('.menu_outer_parent').css('display', 'table');
        $('.leaderboard').css('display', 'none');
        $('.about-me').css('display', 'none');

        $('.menu_container').not('.leaderboard').css('display', 'table');
        handleLeaderboard();
    });

});


/*
    This is responsible for retrieving leaderboard data from server
 */
function handleLeaderboard() {
    $.ajax({
        type: "GET",
        url: "https://app.smahdis.com/api/players",
        cache: false,
        success: function($players){
            $(".leaderboard_table tbody").html('');
            var $to_append = '';
            jQuery.each($players, function(index, player) {
                $to_append = '<tr>' +
                                 '<td>' + (index+1) + '</td>' +
                                 '<td>' + player.player_first_name  + ' ' + player.player_last_name + '</td>' +
                                 '<td>' + player.highest_score + '</td>' +
                              '</tr>';
                $(".leaderboard_table tbody").append($to_append);
            });
        }
    });
}


/*
    Shuffles the images, shows user input form and starts the game
 */
function startGame(){
    // startGame();
    $images = shuffle($images_mock.slice());

    if(!$player_id) {
        $('.player_detail').css('display', '');
        $('.menu_container').css('display', 'none');
    } else {
        start();
    }
}


/*
    This will submit user info on the server. It will also save user info in local storage.
 */
$(document).on('submit','form.userDataForm',function(e){
    e.preventDefault();
    $data = $(this).serialize();
    $.ajax({
        type: "POST",
        url: "https://app.smahdis.com/api/players",
        data: $data,
        cache: false,
        success: function(result){
            localStorage.setItem('player_id',result.id);
            localStorage.setItem('player_first_name',result.player_last_name);
            localStorage.setItem('player_last_name',result.player_last_name);

            $player_id = localStorage.getItem('player_id');
            $player_first_name = localStorage.getItem('player_first_name');
            $player_last_name = localStorage.getItem('player_last_name');

            start();
            // console.log(result);
        }
    });
});


/*
    Core Game Start method
 */
function start(){
    $('.summary-result').css('display', 'none');
    $draggable_element = $("#draggable");
    $('.menu_outer_parent').css('display', 'none');

    $game_env_div = $(".game-env");
    $game_env_div.css('display', '');
    resetImage($draggable_element);
}
