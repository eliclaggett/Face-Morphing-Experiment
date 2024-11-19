/*
 * Filename: DevStep.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is a test step of the experiment's multiple API connections
 */

// Imports
import React, { useEffect } from "react";
import { Container, Typography, Stack, Button } from "@mui/joy";
import { usePlayer } from "@empirica/core/player/classic/react";
import { wsSend } from "../utils/utils.js";

export default function DevStep({ next }) {
  useEffect(() => {
    window.videoIdx = 0;
    window.sideIdx = 0;
    window.gameParams = {
      version: "July 2024",
      videoLength: 20, // seconds
      numVideos: 6,
      studyPay: 2.4,
      partialPay: 1,
      studyLength: "10 minutes",
      completionCode: "C19BSZ93",
      livekitURL: "wss://facemorphing-pse030ak.livekit.cloud",

      videos: {
        positive: [
          "d9e1f5a5-e4eb-43df-910b-d9ae2befb039",
          "1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6",
          "65ef52f0-93a4-435c-ae13-ab502aa60bd7",
          "ac78bc80-4f3a-481a-91e6-213bc427c0b3",
          "5348de6b-afa5-4c36-8087-cd3bf94eedfd",
          "ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748",
          "718d778c-d62e-463a-97cd-d6d3550d19a3",
          "fcb7689a-5614-475c-9ea8-493fbe045499",
        ],
        neutral: [
          "a373174c-cade-4c7f-a3d6-7309f225f37d",
          "ff6acf35-cfce-4d87-b04e-2bf91f1926ba",
          "94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e",
          "43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d",
          "e14e94f7-2550-4f38-b9ba-ebe4958e0512",
          "3504e22c-1e69-4e99-928b-f8541539d888",
          "2d8791a3-3ad0-4011-bdc1-2dde05ebcba2",
          "9a54607c-02a3-48c6-ad11-02a5e27812de",
        ],
      },
    };
  }, []);

  const handleStartRecording = () => {
    console.log("Starting recording in about 20 seconds...");
    window.startTime = Date.now();
    window.nextTime = window.startTime + 22 * 1000;
    window.started = false;
    window.recordingInterval = setInterval(function () {
      if (Date.now() >= window.nextTime) {
        window.nextTime += 22 * 1000;

        if (window.started) {
          // Stop the previous recording
          wsSend(JSON.stringify({ command: "stopRecording" }));
          console.log("Stop");

          // Update video index and side idx
          if (window.sideIdx == 1) {
            window.sideIdx = 0;
            window.videoIdx += 1;
          } else {
            window.sideIdx = 1;
          }

          // Stop when we are finished
          if (window.videoIdx > 16) {
            clearInterval(window.recordingInterval);
            return;
          }
        }
        window.started = true;

        // Get video type for current index
        let vidType = "positive";
        if (window.videoIdx >= 8 || true) vidType = "neutral";

        // Get video index within the current type
        let realVidIdx = window.videoIdx % 8;

        // Record the video
        wsSend(
          JSON.stringify({
            command: "setVideoParams",
            video:
              vidType +
              "/" +
              window.gameParams["videos"][vidType][realVidIdx] +
              "_out.mp4",
            video_idx: videoIdx,
            swap_idx: window.sideIdx,
            output_order: 0,
          })
        );

        // Log to console
        console.log("Self-swapping Video " + videoIdx + "_" + window.sideIdx);

        // Start recording after the parameters are set
        setTimeout(() => {
          wsSend(JSON.stringify({ command: "startRecording" }));
          console.log("Start");
        }, 750);
      }
    }, 200);
  };
  const handleStopRecording = () => {
    wsSend(JSON.stringify({ command: "stopRecording" }));
  };

  // UI
  return (
    <Container maxWidth="100vw" className="systemCheckContainer">
      <Stack
        sx={{
          maxWidth: {
            md: "60rem",
          },
          mx: "auto",
          mt: "10vh",
          textAlign: "center",
        }}
        gap={1}
      >
        <Typography level="h1" sx={{ fontSize: "2em" }}>
          Test-Only
        </Typography>

        <Stack direction="row" justifyContent="center">
          <Button onClick={handleStartRecording}> Start Self Swap</Button>
          <Button onClick={handleStopRecording}>Stop</Button>
        </Stack>
      </Stack>
    </Container>
  );
}
