const express = require("express");
const cors = require("cors");
const fs = require('fs');    //file system
const axios = require('axios');   // will use for http requests to download videos
const fluentFFmpeg = require('fluent-ffmpeg');  // wrapper around FFmpeg for video processing
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/videos', express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.send("Video Processing API is running...");
});

//This rounte will handle the video processing
app.post('/process-video', async (req, res) => {
    const { video1, video2 } = req.body;     // Here we extract video URLs for further processing

    if (!video1 || !video2) {
        return res.status(400).json({ error: 'Both video URLs are required' });  //Need to make sure both URLs are given
    }

    try {
        //these are the locations I would like to store the videos
        const video1Path = path.join(__dirname, 'video1.mp4');
        const video2Path = path.join(__dirname, 'video2.mp4');

        //fetches and saves the videos locally
        await downloadVideo(video1, video1Path);
        await downloadVideo(video2, video2Path);

        const outputPath = path.join(__dirname, 'output.mp4'); //Here we define an output video path
        await processVideos(video1Path, video2Path, outputPath); // Process the videos and merge

        res.json({ status: 'success', processed_video_url: `/videos/output.mp4` }); //we return the URL of the processed video


        setTimeout(() => {
            deleteFile(video1Path);
            deleteFile(video2Path);
        }, 5000);

    } catch (error) {
    res.status(500).json({ error: error.message });  // basic error catching if anything above fails
  }

});

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error(`❌ Error deleting file: ${filePath}`, err);
        else console.log(`✅ File deleted: ${filePath}`);
    });
};

async function downloadVideo(url, outputPath) {
    const writer = fs.createWriteStream(outputPath); //creating a stream to save the download
    const response = await axios({  //request to the video URL
      url,
      method: 'GET',
      responseType: 'stream',
    });
  
    response.data.pipe(writer);  //response data into file
    return new Promise((resolve, reject) => {   //returning a promise which resolves when the download is finished
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }


  const ffmpeg = require('fluent-ffmpeg');

  function processVideos(input1, input2, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(input1)
        .input(input2)
        .complexFilter([
          '[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]',
          '[outv]scale=ceil(iw/2)*2:ceil(ih/2)*2[outv_scaled]'  // Updated scale filter
        ])
        .outputOptions([
          '-c:v libx264',
          '-crf 23',
          '-preset fast',
          '-c:a aac',
          '-strict experimental'
        ])
        .map('[outv_scaled]')
        .map('[outa]')
        .output(outputPath)
        .on('end', () => {
          console.log('✅ Video processing complete:', outputPath);
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err.message);
          reject(err);
        })
        .run();
    });
  }
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));