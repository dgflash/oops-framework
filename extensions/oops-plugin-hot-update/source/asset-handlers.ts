import { AssetHandlers } from '../@types';
import { outputFile } from 'fs-extra';

export const compressTextures: AssetHandlers.compressTextures = async (tasks) => {
    for (let i = 0; i < Array.from(tasks).length; i++) {
        const task = Array.from(tasks)[i];
        if (task.format !== 'jpg') {
            continue;
        }
        // task.dest should change suffix before compress
        task.dest = task.dest.replace('.png', '.jpg');
        await pngToJPG(task.src, task.dest, task.quality as number);
        // The compress task have done needs to be removed from the original tasks
        tasks.splice(i, 1);
    }
};

async function pngToJPG(src: string, dest: string, quality: number) {
    const img = await getImage(src) as CanvasImageSource;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', quality / 100);
    await outputFile(dest, imageData);
    console.debug('pngToJPG', dest);
}

function getImage(path: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            resolve(img);
        };
        img.onerror = function(err) {
            reject(err);
        };
        img.src = path.replace('#', '%23');
    });
}
