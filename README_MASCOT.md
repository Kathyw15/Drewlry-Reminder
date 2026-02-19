# How to Add Mascot Image

The HTML file is configured to display a mascot image. To add your mascot image:

1. Place your mascot image file in the same directory as `index.html`
2. Name it `mascot.png` (or update the filename in the HTML)
3. Supported formats: PNG, JPG, SVG, GIF
4. Recommended size: 200x200px to 400x400px

The image will automatically appear at the top of the page. If the image file is not found, it will be hidden gracefully.

## Current Image Path
The HTML looks for: `mascot.png` in the same directory as the HTML file.

## To Change the Image Path
Edit line ~894 in `index.html` and change:
```html
<img src="mascot.png" ... />
```
to your desired path, for example:
```html
<img src="./images/mascot.png" ... />
```
