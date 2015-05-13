<?php

$classes = glob("backend/classes/*.php");

foreach ($classes as $class) {
    include $class;
}