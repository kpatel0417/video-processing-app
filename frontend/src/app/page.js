"use client";
import { useState } from "react";

const VideoProcessor = () => {
  const [videoFile1, setVideoFile1] = useState(null);   //will store video inputs
  const [videoFile2, setVideoFile2] = useState(null);
  const [loading, setLoading] = useState(false);        // keeps track of loading state
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);   //will store processed URL eventually

  const handleFileChange = (event, videoNumber) => {    // This function will run when user trying inputting a video in the form.
    if (videoNumber === 1) {
      setVideoFile1(event.target.files[0]);
    } else {
      setVideoFile2(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event) => {       // Form submission to prevent default behavior
    event.preventDefault();

    if (!videoFile1 || !videoFile2) {               // Basic error checking
      alert("Please select both video files."); 
      return;
    }

    setLoading(true);                              // populating state variable

    const formData = new FormData();               // Creating instance of formData to send over to the backend
    formData.append("video1", videoFile1);
    formData.append("video2", videoFile2);

    try {
      const response = await fetch("http://localhost:5001/process-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process video");
      }

      const data = await response.json();
      setProcessedVideoUrl(data.processedVideoUrl);       //Received URL of the output video
    } catch (error) {
      console.error(error);
      alert("Error processing video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-tan-100">
      <div className="p-8 min-w-2xl min-h-[600px] mx-auto bg-white rounded-lg shadow-2xl mt-10 mb-10">
        <h1 className="text-4xl font-extrabold text-center mt-8 mb-12 text-gray-800">
          Video Processing App
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Video Input 1 */}
          <div className="flex flex-col items-center">
            <label htmlFor="video1" className="text-lg font-semibold text-gray-700 mb-2">
              Upload First Video
            </label>
            <input
              type="file"
              id="video1"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 1)}
              className="mt-2 p-3 bg-gray-100 border border-gray-400 rounded-lg cursor-pointer shadow-sm hover:bg-gray-200"
            />
          </div>

          {/* Video Input 2 */}
          <div className="flex flex-col items-center">
            <label htmlFor="video2" className="text-lg font-semibold text-gray-700 mb-2">
              Upload Second Video
            </label>
            <input
              type="file"
              id="video2"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 2)}
              className="mt-2 p-3 bg-gray-100 border border-gray-400 rounded-lg cursor-pointer shadow-sm hover:bg-gray-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-12 py-3 bg-brown-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-brown-800 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Process Videos"}
          </button>
        </form>

        {loading && (
          <div className="mt-4 text-center text-gray-700 font-semibold">
            Processing your videos... Please wait!
          </div>
        )}

        {processedVideoUrl && (
          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Processed Video Preview
            </h2>
            <div className="rounded-lg overflow-hidden shadow-md">
              <video
                src={`http://localhost:5001${processedVideoUrl}`}
                controls
                className="w-full max-h-80 rounded-lg border border-gray-400 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProcessor;
