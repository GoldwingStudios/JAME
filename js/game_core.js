$(document).ready(function() {
    var image;
    var Game = {};
    Game.fps = 30;
    var Animations = [];
    var game_str = "00000000_01111110_01111110_01111110_01111110_01111110_01111110_00000000";

    window.onload = function() {
        LoadAnimations();
        ContextDraw();
    };

    var img_obj = function() {
        this.source = null;
        this.current = 0;
        this.sub_counter = 0;
        this.total_frames = 32;
        this.width = 75;
        this.height = 75;
        this.x = 0;
        this.y = 0;
    };

    var ContextDraw = function() {
        var canvas_element = $("#lets_draw").get(0);
        var canvas_context = canvas_element.getContext("2d");
        var current_x = 0, current_y = 0, map_tiles = game_str.split("_");

        for (var i = 0; i < map_tiles.length; i++)
        {
            var current_row = map_tiles[i];
            for (var k = 0; k < current_row.length; k++)
            {
                var id = current_row[k];
                switch (id)
                {
                    case "0":
                        image = Load_Image(0);
                        canvas_context.drawImage(image, current_x, current_y);
                        current_x = current_x + image.width;
                        break;
                    case "1":
                        image = Load_Image(1);
                        canvas_context.drawImage(image, current_x, current_y);
                        current_x = current_x + image.width;
                        break;
                    case "2":
                        var x = current_x + "_" + current_y;
                        img_obj = Animations[x];

                        if (img_obj.source !== null)
                            canvas_context.drawImage(img_obj.source, img_obj.current * img_obj.width, 0, img_obj.width, img_obj.height, current_x, current_y, img_obj.width, img_obj.height);
                        img_obj.sub_counter += (img_obj.total_frames / 2.24) / Game.fps;
                        if (img_obj.sub_counter >= 1)
                        {
                            img_obj.current = (img_obj.current + 1) % img_obj.total_frames;
                            img_obj.sub_counter--;
                        }

                        Animations[current_x + "_" + current_y] = img_obj;
                        current_x = current_x + image.width;

                        img_obj = null;
                        break;
                }

            }
            current_y = current_y + 75;
            current_x = 0;
            image = null;
        }
    };

    var Load_Image = function(value) {
        var ret_image = new Image();
        switch (value)
        {
            case 0:
                ret_image.src = './assets/images/crate.png';
                break;
            case 1:
                ret_image.src = './assets/images/grass.png';
                break;
            case 2:
                ret_image.src = './assets/images/lava2.png';
                break;
        }
        return ret_image;
    };

    var LoadAnimations = function() {
        var current_x = 0, current_y = 0, map_tiles = game_str.split("_");
        for (var i = 0; i < map_tiles.length; i++)
        {
            var current_row = map_tiles[i];
            for (var k = 0; k < current_row.length; k++)
            {
                var id = current_row[k];
                switch (id)
                {
                    case "2":
                        image = Load_Image(2);
                        var img_obj_ = new img_obj();
                        img_obj_.source = image;
                        img_obj_.x = current_x;
                        img_obj_.y = current_y;
                        Animations[current_x + "_" + current_y] = img_obj_;
                        current_x = current_x + 75;
                        break;
                    default:
                        current_x = current_x + 75;
                        break;
                }
            }
            current_y = current_y + 75;
            current_x = 0;
        }
    };

    Game.draw = function() {
        ContextDraw();
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
});