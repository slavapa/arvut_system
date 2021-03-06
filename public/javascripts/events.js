(function ($) {

    if (!window.kabtv) {
        window.kabtv = {};
    }
    if (!kabtv.sketches) {
        kabtv.sketches = {};
    }

    $.extend(kabtv.sketches, {
        total: 0,
        $current: 0,
        $images: 0,
        $first: 0,
        $last: 0,
        $in_transition: false,
        url_for_classboard: '',

        pollID: 0,
        pollSketches: function() {
            $.ajax({
                url: kabtv.sketches.url_for_classboard,
                data: {
                    total: kabtv.sketches.total
                },
                success: kabtv.sketches.transit_init
            });
        },

        startPollingSketches: function (){
            kabtv.sketches.pollID = setInterval(kabtv.sketches.pollSketches, 30000);
        },

        stopPollingSketches: function (){
            if (kabtv.sketches.pollID == 0) return;
            clearInterval(kabtv.sketches.pollID);
            kabtv.sketches.pollID = 0;
        },

        transit_init: function (data){
            // Note: data is already inserted by JS received from server
            show_new_sketches = false;
            transition_to_last = false;
            kabtv.sketches.$images = $('.content .images img');
            if (kabtv.sketches.total == 0) {
                // There were no images before
                if (kabtv.sketches.$images.length > 0) {
                    // But now there is something...
                    // The first time some images were added
                    kabtv.sketches.total = kabtv.sketches.$images.length;
                    kabtv.sketches.$last = kabtv.sketches.$current = kabtv.sketches.$images.last();
                    kabtv.sketches.$first = kabtv.sketches.$images.first();
                    kabtv.sketches.$last.css('z-index', 10); // Become the upper for sure
                    $('#sketches .title').text(kabtv.sketches.total + '/' + kabtv.sketches.total);
                } else {
            // And still there are no images
            }
            } else {
                // There were some images
                if (kabtv.sketches.$images.length > 0) {
                    // And now we have some...
                    if (kabtv.sketches.$images.length < kabtv.sketches.total) {
                        // And now there are less: full or partial reset
                        kabtv.sketches.total = kabtv.sketches.$images.length;
                        kabtv.sketches.$last = kabtv.sketches.$current = kabtv.sketches.$images.last();
                        kabtv.sketches.$first = kabtv.sketches.$images.first();
                        kabtv.sketches.$last.css('z-index', 10); // Become the upper for sure
                        $('#sketches .title').text(kabtv.sketches.total + '/' + kabtv.sketches.total);
                    } else if (kabtv.sketches.total < kabtv.sketches.$images.length) {
                        // Only if new amount of images are here now (either appended or resetted)
                        if (kabtv.sketches.$current == kabtv.sketches.$last) {
                            // We're on the last image...
                            transition_to_last = true;
                        } else {
                            show_new_sketches = true;
                        }
                        kabtv.sketches.total = kabtv.sketches.$images.length;
                        kabtv.sketches.$last = kabtv.sketches.$images.last();
                        $('#sketches .title').text((kabtv.sketches.$current.index() + 1) + '/' + kabtv.sketches.total);
                    }
                } else {
                    // And now there are nothing: full reset
                    kabtv.sketches.total = 0;
                    kabtv.sketches.$last = kabtv.sketches.$current = kabtv.sketches.$first = 0;
                    $('#sketches .title').text('0/0');
                }
            }
            if (show_new_sketches)
                $('#new_sketches').show();
            else
                $('#new_sketches').hide();
            kabtv.sketches.$in_transition = false;
            if (transition_to_last)
                kabtv.sketches.last();
        },

        first: function (){
            if (kabtv.sketches.total <= 1)
                return;
            kabtv.sketches.$item = kabtv.sketches.$first;
            kabtv.sketches.transit_to();
        },

        last: function (){
            if (kabtv.sketches.total <= 1)
                return;
            kabtv.sketches.$item = kabtv.sketches.$last;
            kabtv.sketches.transit_to();
            $('#new_sketches').hide();
        },

        prev: function (){
            if (kabtv.sketches.total <= 1)
                return;
            kabtv.sketches.$item = kabtv.sketches.$current.prev();
            kabtv.sketches.transit_to();
        },

        next: function (){
            if (kabtv.sketches.total <= 1)
                return;
            kabtv.sketches.$item = kabtv.sketches.$current.next();
            kabtv.sketches.transit_to();
        },

        transit_to: function (){
            if (kabtv.sketches.$item.length == 0 ||
                kabtv.sketches.$current === kabtv.sketches.$item || kabtv.sketches.$in_transition) return;
            kabtv.sketches.$in_transition = true;

            kabtv.sketches.$item.css('z-index', 9); // Beneath the upper one
            kabtv.sketches.$current.animate({
                opacity: 0
            }, 1000, 'linear', // Hide the upper one
            function(){
                kabtv.sketches.$item.css('z-index', 10); // Become the upper
                kabtv.sketches.$current.css({
                    'z-index': 1,
                    'opacity': 1
                }); // Go back
                kabtv.sketches.$current = kabtv.sketches.$item;
                $('#sketches .title').text((kabtv.sketches.$current.index() + 1) + '/' + kabtv.sketches.total);
                kabtv.sketches.$in_transition = false;
            }
            );
        }
    });

})(jQuery);

(function ($) {
    if (!window.kabtv) {
        window.kabtv = {};
    }
    if (!kabtv.schedule) {
        kabtv.schedule = {};
    }

    $.extend(kabtv.schedule, {
        show_day: function(me, day){
            var $me = $(me);
            $me.parent().children().removeClass('active');
            $me.addClass('active');
            $(".weekdays>div").hide();
            $(".D_" + day).show();
        }
    });

})(jQuery);

(function ($) {

    if (!window.kabtv) {
        window.kabtv = {};
    }
    if (!kabtv.questions) {
        kabtv.questions = {};
    }

    $.extend(kabtv.questions, {
        url_for_more_questions: '',
        pollID: 0,
        pollQuestions: function() {
            $.ajax({
                url: kabtv.questions.url_for_more_questions,
                data: {
                    last_question_id: last_question_id
                }
            });
        },

        startPollingQuestions: function (){
            kabtv.questions.pollID = setInterval(kabtv.questions.pollQuestions, 30000);
        },

        stopPollingQuestions: function (){
            if (kabtv.questions.pollID == 0) return;
            clearInterval(kabtv.questions.pollID);
            kabtv.questions.pollID = 0;
        },

        toggleAskAndQuestions: function (){
            $(".question-list").toggle();
            $(".question-ask").toggle();
        }
    });

})(jQuery);


(function ($) {

    if (!window.kabtv) {
        window.kabtv = {};
    }
    if (!kabtv.tabs) {
        kabtv.tabs = {};
    }

    $.extend(kabtv.tabs, {
        presets : null,
        presets_data : null,
        timestamp: 0,

        url_for_presets_update: '',
        poll_tabs: true,
        poll_support: true,
        pollID: 0,
        pollPresets: function() {
            $.ajax({
                url: kabtv.tabs.url_for_presets_update,
                data: {
                    timestamp: kabtv.tabs.timestamp,
                    stream_url: $("select#quality").val()
                },
                success: kabtv.tabs.init
            });
            kabtv.tabs.poll_support && $.ajax({
                url: 'http://live.kab.tv/button.php',
                data: {
                    image: 'tech',
                    lang: 'ru',
                    no_image: 1
                },
                dataType: 'jsonp',
                success: function(msg){
                    $('.online-status').html(msg.res);
                }
            });
        },

        // init
        init: function(data){
            if (data == "")
                return;
            eval(data);
            // Now we have local presets_data (what to show; activity status) and presets themselves
            //var reload_player = false; -- initialized in responce from server

            // If activity status was changed - reload player
            // If not active and stream state was changed - reload player 
            if ((kabtv.tabs.presets_data == null) || (kabtv.tabs.presets_data.stream_preset.is_active != presets_data.stream_preset.is_active) ||
            (!presets_data.stream_preset.is_active && presets_data.stream_preset.stream_state_id != kabtv.tabs.presets_data.stream_preset.stream_state_id)) {
                reload_player = true;
            }

            // If presets were changed...
            if (kabtv.tabs.presets != presets || kabtv.tabs.presets_data != presets_data) {
                kabtv.tabs.presets = presets;
                kabtv.tabs.presets_data = presets_data;
                // Reload dropboxes
                //                var current_stream_url = $("select#quality").val();
                var lang_id = $("select#language_id").val();
                $("select#quality option").remove();
                $(kabtv.tabs.presets[lang_id].options).appendTo('#quality');
                $("select#quality").prev().text( $("select#quality :selected").text() );

                //                // To reload player?
                var stream_url = $("select#quality").val();
            //                if (current_stream_url != stream_url) {
            //                    reload_player = true;
            //                }
            }
            
            // Sync presets and redraw player
            if (reload_player) {
                kabtv.tabs.draw_player(stream_url);
            }
        },
        
        startPollingPresets: function (){
            var elem = $("select#language_id");
            var parent = $("#uniform-" + elem[0].id);
            if (parent.length == 0) elem.uniform();
            elem = $("select#quality");
            parent = $("#uniform-" + elem[0].id);
            if (parent.length == 0) elem.uniform();

            kabtv.tabs.pollID = setInterval(kabtv.tabs.pollPresets, 30000);
        },

        stopPollingPresets: function (){
            if (kabtv.tabs.pollID == 0) return;
            clearInterval(kabtv.tabs.pollID);
            kabtv.tabs.pollID = 0;
            kabtv.tabs.timestamp = 0;
        },

        select_me: function(me, name) {
            $('.tabs span').removeClass('active');
            $(me).parent().addClass('active');
            $('.content>div').hide();
            $('.content #' + name).show();
            return false;
        },

        object: '<object width="320" height="305" name="player" id="player" type="video/x-ms-wmv" data="URL_PATTERN"> \
        <param value="URL_PATTERN" name="src"/> \
        <param value="true" name="autostart"/> \
        <param value="true" name="controller"/> \
        <param value="50" name="volume"/> \
        <param value="full" name="uiMode"/> \
        <param value="true" name="animationAtStart"/> \
        <param value="false" name="showDisplay"/> \
        <param value="true" name="ShowAudioControls"/> \
        <param value="false" name="ShowPositionControls"/> \
        <param value="false" name="transparentAtStart"/> \
        <param value="true" name="ShowControls"/> \
        <param value="true" name="ShowStatusBar"/> \
        <param value="false" name="ShowTracker"/> \
        <param value="false" name="ClickToPlay"/> \
        <param value="#000000" name="DisplayBackColor"/> \
        <param value="#ffffff" name="DisplayForeColor"/> \
        <param value="false" name="balance"/> \
        <param value="false" name="enableContextMenu"/> \
        </object>',
        objectMSIE: '<object classid="clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6" \
        style="background-color:#000000" id="player" name="player" type="application/x-oleobject" \
        width="320" height="288" standby="Loading Windows Media Player components...">\
        <param name="URL" value="URL_PATTERN" /><param name="AutoStart" value="1" />\
        <param name="AutoPlay" value="1" /><param name="volume" value="50" />\
        <param name="uiMode" value="full" /><param name="animationAtStart" value="1" />\
        <param name="showDisplay" value="1" /><param name="transparentAtStart" value="0" />\
        <param name="ShowControls" value="1" /><param name="ShowStatusBar" value="1" />\
        <param name="ClickToPlay" value="0" /><param name="bgcolor" value="#000000" />\
        <param name="enableContextMenu" value="0" />\
        <param name="windowlessVideo" value="1" /><param name="balance" value="0" />',

        draw_player: function(url){
            if (url == null) return;

            var object;
            if (kabtv.tabs.presets_data.stream_preset.is_active) {
                if ($.browser.msie)
                    object = kabtv.tabs.objectMSIE.replace(/URL_PATTERN/g, url);
                else
                    object = kabtv.tabs.object.replace(/URL_PATTERN/g, url);
            } else {
                var lang_id = $("select#language_id").val();
                object = kabtv.tabs.presets[lang_id].image;
            }

            $('#object').html(object);
        },

        detach: function(){
            var $obj = $('#player');
            if ($obj) {
                var obj = $obj[0];
                if (obj.URL){
                    if (obj.controls && obj.controls.isAvailable('Stop')){
                        obj.controls.stop();
                    }
                    obj.openPlayer(obj.URL);
                }
            }
        },

        fs: function(){
            var $obj = $('#player');
            if ($obj) {
                var obj = $obj[0];
                if (obj.playState == 3) {
                    obj.fullScreen = true;
                    obj.fullScreen = 'true';
                }
            }
        }
    });

})(jQuery);
