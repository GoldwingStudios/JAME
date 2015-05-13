var Game = {};
Game.fps = 30;
var mouse_x, mouse_y;

var max_speed = 10, speed = 3, speed_step = 0.3, in_move = false, walk_x = 0, walk_y = 0, player_top = 0, player_left = 0, collision_objects, deg = 2 * Math.PI / 360, map = [], collided = false;

window.onload = function() {
    overall_setup();


    this.addEventListener('mousemove', mousemove);
    this.addEventListener('keydown', keydown);
    this.addEventListener('keyup', keyup);
};

var overall_setup = function() {
    load_collision_objects();
    set_player_position();
};

var load_collision_objects = function() {
    var objects_string = $(".collision_objects").text();
    collision_objects = $.parseJSON(objects_string);
};

var update_debug_vars = function() {
    var player = $("#player");
    var player_offset = player.offset();
    $("#ui_left_section_player_position_value").text("X: " + player_offset.left + ";\n Y: " + player_offset.top);
    $("#ui_left_section_mouse_position_value").text("X: " + mouse_x + ";\n Y: " + mouse_y);
    $("#ui_left_section_player_speed_value").text("Speed: " + speed);
};

var mousemove = function(e) {
    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

var set_player_position = function() {
    var position = get_middle_of_map();
    var player = $("#player");
    player_top = position[1];
    player_left = position[0];
    player.css("position", "absolute").css("left", position[0]).css("top", position[1]);
};

var get_middle_of_map = function() {
    var position = [];
    var scene_container = $(".scene_container");
    var map_y_middle = scene_container.height() / 2;
    var map_x_middle = scene_container.width() / 2;
    position.push(map_x_middle);
    position.push(map_y_middle);
    return position;
}

onkeydown = onkeyup = function(e) {
    check_for_moving();
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    console.log(e.key);
    /*insert conditional here*/
    var i, l = map.length, keys = ["w", "a", "s", "d"];
    var player = $("#player");
    var player_offset = player.offset();

    center_x = (player_offset.left + (player.width()) / 2);
    center_y = (player_offset.top + (player.height()) / 2);
    radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);

    angle = (radians * (180 / Math.PI) * -1) + 180;

    for (i = 0; i < l; i++) {
        if (map[i])
        {
            var key_pressed = String.fromCharCode(i).toLowerCase();
            var is_key = $.inArray(key_pressed, keys);
            if (is_key != "-1")
            {
                if (key_pressed === "w" || key_pressed === "s")
                {

                    if (key_pressed === "w")
                    {
                        walk_x = player_left + Math.cos(deg * (angle - 90)) * speed;
                        walk_y = player_top + Math.sin(deg * (angle - 90)) * speed;
                        in_move = true;
                    }
                    else if (key_pressed === "s")
                    {
                        walk_x = player_left - Math.cos(deg * (angle - 90)) * speed;
                        walk_y = player_top - Math.sin(deg * (angle - 90)) * speed;
                        in_move = true;
                    }
                }
                if (key_pressed === "a" || key_pressed === "d")
                {
                    if (key_pressed === "a")
                    {
                        walk_x = player_left - speed;
                        walk_y = player_top;
                        in_move = true;
                    }
                    if (key_pressed === "d")
                    {
                        walk_x = player_left + speed;
                        walk_y = player_top;
                        in_move = true;
                    }
                }
                var coll_detect = collosion_detected();
                if (coll_detect === false)
                {
                    player_top = parseFloat(walk_y);
                    player_left = parseFloat(walk_x);
                    collided = false
                }
                else
                {
                    if (!collided)
                    {
                        player_left = player_left - Math.cos(deg * (angle - 90)) * speed;
                        player_top = player_top - Math.sin(deg * (angle - 90)) * speed;
                        collided = true;
                    }
                }
            }
        }
    }
}


var keydown = function(e) {
    var key = e.key;
    if (key === "b")
    {
        var obj = $(".scene_container");
        if (!obj.hasClass("blur_effect"))
        {
            obj.addClass("blur_effect");
        }
        else
        {
            obj.removeClass("blur_effect");
        }
        return false;
    }

    if (key === "g")
    {
        var obj = $(".scene_container");
        if (!obj.hasClass("grayscale_effect"))
        {
            obj.addClass("grayscale_effect");
        }
        else
        {
            obj.removeClass("grayscale_effect");
        }
        return false;
    }

};

var check_for_moving = function() {
    if (in_move)
    {
        if (speed < max_speed)
        {
            speed += speed_step;
        }
    }
}

var collosion_detected = function() {
    var player = $("#player");
    var player_offset = player.offset();
    var player_x = player_offset.left;
    var player_y = player_offset.top;
    var collision = false;

    $.each(collision_objects, function() {
        var obj_string = get_name_of_splits($(this));
        var crate = $("#" + obj_string);
        var crate_position = crate.offset();
        var x_pos = crate_position.left;
        var y_pos = crate_position.top;
        collision = isCollide(player, crate);
        if (collision) {
            return false;
        }
    });
    return collision;
};

var isCollide = function(a, b) {
    var f_ = a.offset().top + a.height();
    var f__ = b.offset().top;
    var f_f = a.offset().top;
    var f_f_ = b.offset().top + b.height();
    var f_g = a.offset().left + a.width();
    var f_g_ = b.offset().left;
    var f_h = a.offset().left;
    var f_h_ = b.offset().left + b.width();
    return !((f_ < f__) || (f_f > f_f_) || (f_g < f_g_) || (f_h > f_h_));
}

var get_name_of_splits = function(string)
{
    var output_string = "", str_length = string.length;
    for (var i = 0; i < str_length; i++)
    {
        output_string += string[i];
    }
    return output_string;
};

var keyup = function(e) {
    if (in_move)
    {
        in_move = false;
        speed = 2;
    }
};

var rotate_player = function() {
    var player = $("#player");
    var boxCenter = [player.offset().left + player.width() / 2, player.offset().top + player.height() / 2];
    var angle = Math.atan2(mouse_x - boxCenter[0], -(mouse_y - boxCenter[1])) * (180 / Math.PI);
    player.css({"-webkit-transform": 'rotate(' + angle + 'deg)'});
    player.css({'-moz-transform': 'rotate(' + angle + 'deg)'});
    player.css({'transform': 'rotate(' + angle + 'deg)'});

    player.css("top", player_top).css("left", player_left);
};

Game.draw = function() {
    rotate_player();
    update_debug_vars();
};

Game.update = function() {

};

Game.run = (function() {
    var loops = 0, skipTicks = 1000 / Game.fps,
            maxFrameSkip = 10,
            nextGameTick = (new Date).getTime();

    return function() {
        loops = 0;
        while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
            Game.update();
            nextGameTick += skipTicks;
            loops++;
        }

        Game.draw();
    };

})();

Game._intervalId = setInterval(Game.run, 1000 / Game.fps);