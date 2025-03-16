const express = require("express");
const cors = require("cors");
const fs = require('fs');    //file system
const axios = require('axios');   // will use for http requests to download videos
const fluentFFmpeg = require('fluent-ffmpeg');  // wrapper around FFmpeg for video processing
const path = require('path');
const multer = require('multer');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Allows me to access videos from uploads folder in the browser

// app.get("/", (req, res) => {
//     res.send("Video Processing API is running...");
// });

// multer setup for the file handing 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {     //All of the videos uploaded will be stored in the uploads folder
        cb(null, './uploads/');       
    },
    filename: (req, file, cb) => {        // How the name of the file will be stored
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({storage: storage});


//This rounte will handle the video processing

app.post('/process-video', upload.fields([{ name: 'video1' }, { name: 'video2' }]), async (req, res) => {    // Two videos are being uploaded

    const video1 = req.files.video1 ? req.files.video1[0].path : null;   //Acess the file paths
    const video2 = req.files.video2 ? req.files.video2[0].path : null;

    if (!video1 || !video2) {
        return res.status(400).json({ error: 'Both video files are required' });
      }
try {
    const outputPath = path.join(__dirname, 'uploads', 'output.mp4');    //define output path. For now will always be called 'output.mp4'
    await processVideos(video1, video2, outputPath);   //Process the video

    res.json({ status: 'success', processedVideoUrl: `/uploads/output.mp4` }); //Receive output url upon success
    setTimeout(() => {                                    // Deletes input files after 5 seconds (Not really necessary)
        console.log('Deleting files:', video1, video2);
        deleteFile(video1);
        deleteFile(video2);
    }, 5000);
  } catch (error) {
    console.error('Error during video processing:', error);
    res.status(500).json({ error: 'Error processing video' });
  }

});

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting file: ${filePath}`, err);
        else console.log(`File deleted: ${filePath}`);
    });
};

  const ffmpeg = require('fluent-ffmpeg');

  function processVideos(input1, input2, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(input1)    //first video
        .input(input2)    // second video
        .complexFilter([
          '[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]',  // concatenates the videos
          '[outv]scale=ceil(iw/2)*2:ceil(ih/2)*2[outv_scaled]'  // Ensures the width and height are even, having issues without it
        ])
        .outputOptions([
          '-c:v libx264',
          '-crf 23',
          '-preset fast',
          '-c:a aac',
          '-strict experimental'
        ])
        .map('[outv_scaled]')   //mapping processed streams to output
        .map('[outa]')
        .output(outputPath)   // final output
        .on('end', () => {
          console.log('Video processing complete:', outputPath);
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err.message);
          reject(err);
        })
        .run();
    });
  }
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));