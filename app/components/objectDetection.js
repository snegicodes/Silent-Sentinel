"use client";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const webCamRef = useRef(null);

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
      // runObjectDetection(net);
    }, 10);
  };

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
          <Webcam className="w-full lg:h-[540px] rounded-md" mirrored muted />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
