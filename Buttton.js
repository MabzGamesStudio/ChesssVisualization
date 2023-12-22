/*
  File: Buttton.js
  Author: Matt Lips
  Date: December 2023
  Description: Handles drawing of a button and intersection with mouse.
*/
class Buttton {

    /**
     * Creates a button with a position, text, size, and color.
     * @param {Object} position - Position top left of the button.
     * @param {number} position.x - x-coordinate of the position.
     * @param {number} position.y - y-coordinate of the position.
     * @param {string} text - Text value for the button with black color.
     * @param {Object} size - Size of the button in pixels.
     * @param {number} size.width - Button width.
     * @param {number} size.height - Button height.
     * @param {Object} color - RGB color of the button background.
     * @param {number} color.r - Red value 0-255.
     * @param {number} color.g - Green value 0-255.
     * @param {number} color.b - Blue value 0-255.
     */
    constructor(position, text, size, buttonColor) {
        this.position = position;
        this.text = text;
        this.size = size;
        this.color = color(buttonColor.r, buttonColor.g, buttonColor.b);
        this.size = size
        this.position = position
    }

    /**
     * Draws the button and text to the screen.
     */
    draw() {

        // Background
        fill(this.color);
        rect(this.position.x, this.position.y, this.size.width, this.size.height);

        // Text
        textSize(20);
        textAlign(CENTER, CENTER);
        fill(0);
        text(this.text, this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    }

    /**
     * Checks whether the mouse position intersects the bounds of the button.
     * @returns {boolean} Is the mouse position intersecting the bounds of the button.
     */
    isMouseOver() {
        return mouseX > this.position.x &&
            mouseX < this.position.x + this.size.width &&
            mouseY > this.position.y &&
            mouseY < this.position.y + this.size.height;
    }
}
