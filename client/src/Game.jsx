import { usePlayer } from "@empirica/core/player/classic/react";
import React from "react";
import CalibrateTracking from "./steps/CalibrateTracking.jsx";
import WatchVideos from "./steps/WatchVideos.jsx";
import VideoRanking from "./steps/VideoRanking.jsx";
import FinalDisclosure from "./steps/exit/FinalDisclosure.jsx";
import End from "./steps/exit/End.jsx";

export function Game() {
  const player = usePlayer();
  const studyStep = player.get("studyStep");
  let stepUI = "";
  switch (studyStep) {
    case "video":
      stepUI = <WatchVideos />;
      break;
    case "survey":
      stepUI = <VideoRanking />;
      break;
    case "debrief":
      stepUI = <FinalDisclosure />;
      break;
    case "end":
      stepUI = <End />;
      break;
    default:
      stepUI = <CalibrateTracking />;
      break;
  }

  return stepUI;
}
