<?php
// Add your stock PNG images in this "img" folder to increase the number of image choices available in the application
$directory = 'img/';
$images = glob($directory . "*.png");

foreach ($images as $image) {
    echo '<img src="' . $image . '" alt="Image" onclick="selectImage(this.src)">';
}
?>
