import { createCanvas, drawImageProp } from "../Decals/splitImage";

/**
 * Processes a file into images.
 * @param file The video file.
 * @param step Step size in seconds. TPT2's smallest step size is 0.25 seconds (4 fps) in sequencers.
 */
export default async function processVideo(file: File, aspectRatio: number, step=0.25) {
    let video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    
    // wait for load
    await new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', () => resolve(video))
    });

    // process video
    let canvas = createCanvas(video.videoWidth, video.videoHeight, 1 / aspectRatio);
    let context = canvas.getContext('2d');
    
    let frames = [];
    for (let i = 0; i < video.duration; i += step) {
        video.currentTime = i;
        await new Promise((resolve, reject) => {
            video.addEventListener('seeked', () => resolve())
        });
        drawImageProp(context, video);
        let data = canvas.toDataURL('image/png');

        frames.push(data);
    }

    return frames;
}