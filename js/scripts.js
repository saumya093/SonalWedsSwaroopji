'use strict';

// 00. Preloader
$(window).load(function () {
    $('#preloader').delay(600).fadeOut(500);

    $('#audio_player').get(0).play();
});

$(document).ready(function () {

    // 01. Prevent empty links scroll to top default functionality
    /* <![CDATA[ */
    (function ($) {
        $('a[href*=#]:not([href=#])').on('click', function (e) {
            e.preventDefault();
        });
    })(jQuery);
    /* ]]> */

    // 02. Main navigation
    $('.show-menu').on('click', function (e) {
        if ($('.onepage').length > 0) {
            e.preventDefault();
        }
        $('#menu').toggleClass("show");
    });
    $('#menu li a').on('click', function (e) {
        if ($('.onepage').length > 0) {
            e.preventDefault();
        }
        $('#menu').toggleClass("show");
    });
    if ($("header").scrollTop() < $('#header').height()) {
        $(".show-menu").on('click', function () {
            $('html, body').animate({
                scrollTop: $("header").offset().top
            }, 500);
        });
    }

    // 03. Fullwidth Image Slider
    if ($('#owl-fullwidth').length > 0) {
        $('#owl-fullwidth').owlCarousel({
            autoPlay: 9000,
            navigation: true,
            navigationText: ['', ''],
            slideSpeed: 900,
            singleItem: true,
            pagination: false
        });
    }

    // 04. Gallery slider
    if ($('#owl-gallery').length > 0) {
        $("#owl-gallery").owlCarousel({
            navigation: false,
            itemsCustom: [
	            [320, 1],
	            [480, 1],
	            [768, 2],
	            [992, 3],
	            [1200, 3]
            ],
            pagination: true
        });
    }

    // 05. People Involved slider
    if ($('#owl-people').length > 0) {
        $("#owl-people").owlCarousel({
            autoPlay: 4000,
            stopOnHover: true,
            navigation: false,
            itemsCustom: [
	            [320, 1],
	            [480, 1],
	            [768, 2],
	            [992, 3],
	            [1200, 3]
            ],
            pagination: true
        });
    }

    // 06. Parallax effects
    if (!device.tablet() && !device.mobile() && $('#parallax-quote').lenght > 0) {
        $('#parallax-quote').parallax("50%", 0.2);
    }

    // 07. Lightcase
    $('a[data-rel="lightcase:mw-gallery"]').lightcase({
        transition: 'elastic',
        showSequenceInfo: false
    });
    $('a[data-rel="lightcase:mw-groomsmen"]').lightcase({
        transition: 'elastic',
        showSequenceInfo: false
    });
    $('a[data-rel="lightcase:mw-bridesmaid"]').lightcase({
        transition: 'elastic',
        showSequenceInfo: false
    });

    // 08. Scroll To Top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 80) {
                $('#top-scroll').fadeIn();
            } else {
                $('#top-scroll').fadeOut();
            }
            // Sticky header navigation
            if ($('.image-header').length > 0) {
                var headerHeight = $('.image-header').height();
            } else if ($('.video-header').length > 0) {
                var headerHeight = $('.video-header').height();
            } else if ($('.slider-header').length > 0) {
                var headerHeight = $('.slider-header').height();
            }
            if ($(this).scrollTop() > headerHeight) {
                $('header').addClass('sticky');
                $('.keep').addClass('height');
            } else {
                $('header').removeClass('sticky');
                $('.keep').removeClass('height');
            }
        });

        $('#top-scroll').on('click', function () {
            $('body,html').animate({ scrollTop: 0 }, 1200);
        });

    });

    // 09. Smooth Scroll to Section
    $(function () {
        $('a[href*=#]:not([href=#])').on('click', function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 100
                    }, 900);
                    return false;
                }
            }
        });
    });

    // 10. Countdown
    if ($('.countdown').length > 0) {
        $('[data-countdown]').each(function () {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function (event) {
                $this.html(event.strftime(
	              '<div><p>%w</p><span>Weeks</span></div><div><p>%D</p><span>Days</span></div><div><p>%H</p><span>Hours</span></div><div><p>%M</p><span>Minutes</span></div><div><p>%S</p><span>Seconds</span></div>'
	            ));
            });
        });
    }

    // 11. Material Inputs Fields
    $('#contact input').on('focus', function () {
        $(this).siblings('.text-label').addClass('active');
    });
    $('#contact input').on('blur', function () {
        if ($(this).val() == '') {
            $(this).siblings('.text-label').removeClass('active');
        } else {
            $(this).siblings('.text-label').addClass('active');
        }
    });

    $('#submitinput').on('click', function () {
        var name = $('#senderName').val();
        var message = $('#thoughts').val();
        var jsonMessage = {
            "name": name,
            "message": message
        };
        $('#submitinput').attr('value', 'Sending...');
        $('#submitinput').attr('disabled', 'disabled');

        var errorMessage = "";

        if (name.trim() == "")
            errorMessage = "<ul><li>Please enter your name.</li></ul>";
        else if (message.trim() == "")
            errorMessage = "<ul><li>Please enter some thoughts for the couple...</li></ul>";


        if (errorMessage != "") {
            $('#bad-msg').html(errorMessage);
            $('#bad-msg').css('display', 'block');
            $('#bad-server').css('display', 'none');
            $('#success').css('display', 'none');
            $('#submitinput').attr('value', 'Send Blessings');
            $('#submitinput').removeAttr('disabled');
            return;
        }

        $.ajax({
            url: 'http://api.sonalwedsswaroopji.in/Message',
            type: 'POST',
            data: JSON.stringify(jsonMessage),
            crossDomain: true,
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            success: function () {
                $('#success').css('display', 'block');
                $('#bad-server').css('display', 'none');
                $('#bad-msg').css('display', 'none');
                $('#senderName').val("");
                $('#thoughts').val("");
                $('#submitinput').attr('value', 'Send Blessings');
                $('#submitinput').removeAttr('disabled');
            },
            error: function (x) {
                var response = null;
                var errors = [];
                var errorsString = "";
                //WE IGNORE MODEL STATE EXTRACTION IF THERE WAS SOME OTHER UNEXPECTED ERROR (I.E. NOT A VALIDATION ERROR)
                if (x.status == 400) {//SINCE WE ARE RETURNING BAD REQUEST STATUS FROM OUR WEB API, SO WE CHECK IF STATUS CODE IS 400
                    try {
                        response = JSON.parse(x.responseText);
                    }
                    catch (e) { //this is not sending us a ModelState, else we would get a good responseText JSON to parse)
                    }
                }
                if (x.status == 500) {
                    $('#bad-server').css('display', 'block');
                    $('#bad-msg').css('display', 'none');
                    $('#success').css('display', 'none');
                    $('#submitinput').attr('value', 'Send Blessings');
                    $('#submitinput').removeAttr('disabled');
                }
                if (response != null) {
                    var modelState = response.modelState;
                    //THE CODE BLOCK below IS IMPORTANT WHEN EXTRACTING MODEL STATE IN JQUERY/JAVASCRIPT
                    errorsString = "<ul>";
                    for (var key in modelState) {
                        if (modelState.hasOwnProperty(key)) {
                            errorsString = (errorsString == "" ? "" : errorsString) + "<li>" + modelState[key] + "</li>";
                            errors.push(modelState[key]);//list of error messages in an array
                        }
                    }
                    errorsString = errorsString + "</ul>";
                }
                if (errorsString != "") {
                    $('#bad-msg').html(errorsString);
                    $('#bad-msg').css('display', 'block');
                    $('#bad-server').css('display', 'none');
                    $('#success').css('display', 'none');
                    $('#submitinput').attr('value', 'Send Blessings');
                    $('#submitinput').removeAttr('disabled');
                }
            }
        });
    });

    $('#pause').on('click', function () {
        $('#audio_player').get(0).pause();
        $('#play').css('display', 'block');
        $('#pause').css('display', 'none');
    });

    $('#play').on('click', function () {
        $('#audio_player').get(0).play();
        $('#play').css('display', 'none');
        $('#pause').css('display', 'block');
    });
});
