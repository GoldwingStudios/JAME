<?php

class Map_Creator {

    public function Map_Creator() {
        $this->map = $this->get_map();
    }

    public function create_map() {
        $characters = array();
        $collision_objects = array();


        $map_y = 0;

        $map = $this->map;
        $xml_row = $map->row;
        foreach ($xml_row as $row) {
            $map_x = 0;
            $map_y++;
            $row = (string) $row;
            echo '<div class="background_map_row">';
            for ($i = 0; $i < strlen($row); $i++) {
                $map_x++;
                $tile = $row[$i];
                switch ($tile) {
                    case "0":
                        $collision_objects[] = 'block_' . $map_x . '_' . $map_y . '_75_75';
                        echo '<img id="block_' . $map_x . '_' . $map_y . '_75_75" src="assets/images/crate.png"/>';
                        break;
                    case "1":
                        echo '<img src="assets/images/grass.png"/>';
                        break;
                    case "p":
                        echo '<img src="assets/images/grass.png"/>';
                        $characters["player"] = array($map_x, $map_y);
                        break;
                }
            }
            echo '</div>';
        }

        foreach ($characters as $key => $value) {
            switch ($key) {
                case "player":
                    echo '<img id="player" style="top: 0px; left: 0px;" src="assets/images/player.png"/>';
                    break;
            }
        }

        $collision_objects = json_encode($collision_objects);
        echo '<div style="display: none;" class="collision_objects">' . $collision_objects . '</div>';
    }

    private function get_map() {
        $map = simplexml_load_file("assets/xml/map_scene.xml");
        return $map;
    }

}
