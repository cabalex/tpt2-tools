/** this is very messy code... oops...  */
export function drawImageProp(ctx, img) {
    let imageWidth = img.width || img.videoWidth;
    let imageHeight = img.height || img.videoHeight;
    var canvas = ctx.canvas ;
    var hRatio = canvas.width  / imageWidth    ;
    var vRatio =  canvas.height / imageHeight  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - imageWidth*ratio ) / 2;
    var centerShift_y = ( canvas.height - imageHeight*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(img, 0,0, imageWidth, imageHeight,
                       centerShift_x,centerShift_y,imageWidth*ratio, imageHeight*ratio);  
 }
 

/**
 * 
 * @param width Width of the image.
 * @param height Height of the image.
 * @param aspectRatio The aspect ratio of the target canvas.
 * @returns An X/Y offset for the image to be drawn on the canvas.
 */
export function createCanvas(width: number, height: number, aspectRatio: number) {
    let canvas = document.createElement('canvas');
    let offsets = {x: 0, y: 0};
    let imageAspectRatio = width / height;
    if (aspectRatio > 1) {
        // video is wider than tall
        canvas.width = width;
        canvas.height = width / aspectRatio;
    } else {
        // video is taller than wide
        canvas.height = height;
        canvas.width = height * aspectRatio;
    }
    return canvas;
}

interface ImagePart {
    top: number;
    left: number;
    width: number;
    height: number;
    blockWidth: number;
    blockHeight: number;
    url: string;
}

/**
 * Splits an image into more manageable sizes.
 * @param image The image file.
 * @param width Width in TPT2 blocks.
 * @param height Height in TPT2 blocks (half a width).
 * @param maxWidth Max width of each individual image panel.
 * @param maxHeight Max height of each individual image panel.
 */
export default async function splitImage(image: File, width: number, height: number, maxWidth=4, maxHeight=8) {
    let img = document.createElement('img');
    img.src = URL.createObjectURL(image);

    // wait for load
    await new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(img))
    });

    // process image
    let canvas = createCanvas(img.width, img.height, width / height);
    let context = canvas.getContext('2d');
    drawImageProp(context, img)

    if (width < maxWidth && height < maxHeight) {
        // no processing needed; simply paste
        let data = canvas.toDataURL('image/png');
        return {
            width: canvas.width,
            height: canvas.height,
            parts: [{
                top: 0,
                left: 0,
                width: canvas.width,
                height: canvas.height,
                blockWidth: width,
                blockHeight: height,
                url: data
            }]
        };
    }

    // actually do processing
    let xBlocks = Math.ceil(width / maxWidth);
    let yBlocks = Math.ceil(height / maxHeight);

    let blockWidths = [];
    let blockHeights = [];
    for (let i = 0; i < Math.ceil(width / maxWidth); i++) {
        if (i == xBlocks - 1) {
            blockWidths.push(width - (i * maxWidth));
            if (blockWidths[i] < 1) {
                blockWidths[i - 1] -= 1;
                blockWidths[i] += 1;
            }
        } else {
            blockWidths.push(maxWidth);
        }
    }
    for (let i = 0; i < Math.ceil(height / maxHeight); i++) {
        if (i == yBlocks - 1) {
            blockHeights.push(height - (i * maxHeight));
            if (blockHeights[i] < 1) {
                blockHeights[i - 1] -= 1;
                blockHeights[i] += 1;
            }
        } else {
            blockHeights.push(maxHeight);
        }
    }
    let widths = blockWidths.map(w => w / width * canvas.width);
    let heights = blockHeights.map(h => h / height * canvas.height);

    // copy canvas for cropping
    let copiedCanvas = document.createElement('canvas');
    copiedCanvas.width = canvas.width;
    copiedCanvas.height = canvas.height;
    let copiedContext = copiedCanvas.getContext('2d');

    let parts: ImagePart[] = [];
    for (let x = 0; x < xBlocks; x++) {
        for (let y = 0; y < yBlocks; y++) {
            
            // copy image
            copiedCanvas.width = widths[x];
            copiedCanvas.height = heights[y];
            let left = widths.slice(0, x).reduce((a, b) => a + b, 0);
            let top = heights.slice(0, y).reduce((a, b) => a + b, 0);
            copiedContext.clearRect(0, 0, copiedCanvas.width, copiedCanvas.height);
            copiedContext.drawImage(canvas, left, top, widths[x], heights[y],
                0, 0, copiedCanvas.width, copiedCanvas.height);
            // draw image
            let data = copiedCanvas.toDataURL('image/png');
            parts.push({
                top,
                left,
                width: widths[x],
                height: heights[y],
                blockWidth: blockWidths[x],
                blockHeight: blockHeights[y],
                url: data
            });
        }
    }
    return {
        width: canvas.width,
        height: canvas.height,
        parts
    }
}