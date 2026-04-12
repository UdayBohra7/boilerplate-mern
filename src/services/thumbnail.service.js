const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Generate a thumbnail for a video file
 * @param {string} videoPath - The path to the video file
 * @param {string} outputDir - The directory to save the thumbnail
 * @returns {Promise<string>} - The relative path to the generated thumbnail
 */
const generateThumbnail = (videoPath, outputDir) => {
    return new Promise((resolve, reject) => {
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const filename = path.basename(videoPath, path.extname(videoPath)) + '-thumbnail.png';
        const outputPath = path.join(outputDir, filename);

        ffmpeg(videoPath)
            .on('end', () => {
                resolve(`/uploads/${filename}`);
            })
            .on('error', (err) => {
                console.error('Error generating thumbnail:', err);
                reject(err);
            })
            .screenshots({
                count: 1,
                folder: outputDir,
                filename: filename,
                size: '320x?',
            });
    });
};

module.exports = {
    generateThumbnail,
};
