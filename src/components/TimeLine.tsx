"use client";
import React, { useState } from "react";
import { SeekPlayer } from "./timeline-related/SeekPlayer";
import { StoreContext } from "@/store";
import { observer } from "mobx-react";
import { TimeFrameView } from "./timeline-related/TimeFrameView";
import { VideoEditorElement } from "@/types";
import { getUid, isHtmlVideoElement } from "@/utils";

export const TimeLine = observer(() => {
  const store = React.useContext(StoreContext);
  const percentOfCurrentTime = (store.currentTimeInMs / store.maxTime) * 100;
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (file: File, index: number) => {
    const newVideoElement = createVideoElement(file, index);
    console.log("newVideoElement", newVideoElement)
    store.addEditorElement(newVideoElement);
    store.addVideo(store.editorElements.length - 1);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    // Filter only video files (you can extend the list of supported file types)
    const videoFiles = files.filter((file) => file.type.startsWith("video/"));

    // Process the dropped video files as needed (e.g., add to your store)
    console.log("Dropped video files:", videoFiles);

    videoFiles.forEach((videoFile, index) => {
      handleFileChange(videoFile, index);
    });
  };

  const createVideoElement = (file: File, index: number): VideoEditorElement => {
    const src = URL.createObjectURL(file);
    const id = getUid();
  
    return {
      id: id,
      name: `Media(video) ${index + 1}`,
      type: "video",
      placement: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      timeFrame: {
        start: 0,
        end: 0,
      },
      properties: {
        elementId: `video-${id}`,
        src: src, 
        effect: {
          type: "none",
        },
      },
    };
  };
  

  return (
    <>
      <SeekPlayer />
      <div
        className={`relative h-[130px]  bg-[#c6c3c326] ${
          isDragging ? "dragging" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className="w-[2px] bg-[#c6c3c326] absolute top-0 bottom-0 z-20"
          style={{
            left: `${percentOfCurrentTime}%`,
          }}
        ></div>
        {store.editorElements.map((element) => (
          <TimeFrameView key={element.id} element={element} />
        ))}
      </div>
    </>
  );
});
