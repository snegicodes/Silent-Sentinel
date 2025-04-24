"use client";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { showPredictions } from "@/utils/showPredictions";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [started, setStarted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);

  let detectInterval;

  const showMyVideo = () => {
    if (
      webCamRef.current !== null &&
      webCamRef?.current?.video?.readyState === 4
    ) {
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;

      webCamRef.current.video.width = myVideoWidth;
      webCamRef.current.video.height = myVideoHeight;
    }
  };

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 100);
  };

  const runObjectDetection = async (net) => {
    if (
        canvasRef.current &&
        webCamRef.current !== null &&
        webCamRef?.current?.video?.readyState === 4
      ) {
            canvasRef.current.width = webCamRef.current.video.videoWidth;
            canvasRef.current.height = webCamRef.current.video.videoHeight;

            //Detect Objects
            const detectedObjects = await net.detect(webCamRef.current.video, undefined, 0.3);

            const context = canvasRef.current.getContext("2d");
            showPredictions(detectedObjects, context, email, webCamRef);
      }
  }

  const handleStartSurveillance = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setEmailError("");
    setStarted(true);
  };

  useEffect(() => {
    if (started) {
      runCoco();
      showMyVideo();
    }
    
    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, [started]);

  if (!started) {
    return (
      <div className="mt-8 max-w-md mx-auto p-6 bg-transparent rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Enter your Email ID for receiving alerts</h3>
        <div className="mb-4">
          {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label> */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>
        <button
          onClick={handleStartSurveillance}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          Start Surveillance
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-title">AI Model is Loading ...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <Webcam
            ref={webCamRef}
            className="w-full
            lg:h-[560px]
            rounded-md"
            mirrored
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full lg:h-[560px] z-99999"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
