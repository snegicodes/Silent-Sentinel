"use client";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    }, 10);
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
      }
  }

  useEffect(() => {
    runCoco();
    showMyVideo();
  }, []);
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
