import { Chat, useGame, usePlayer } from "@empirica/core/player/classic/react";
import { Button, Box, Container, IconButton, Typography, Stack, FormControl, FormLabel, FormHelperText, Radio, RadioGroup } from '@mui/joy';

import React, { useEffect } from "react";
import CalibrateTracking from "./steps/CalibrateTracking.jsx";
import WatchVideos from "./steps/WatchVideos.jsx";
// import WatchVideos from "./steps/real_WatchVideos.jsx";
import VideoRanking from "./steps/VideoRanking.jsx";
import End from "./steps/exit/End.jsx";


export function Game() {

  const player = usePlayer();
  const studyStep = player.get('studyStep');
  let stepUI = '';
  switch (studyStep) {
    case 'video':
      stepUI = <WatchVideos/>;
      break;
    case 'survey':
      stepUI = <VideoRanking/>;
      break;
    case 'end':
      stepUI = <End/>;
      break;
    default:
      stepUI = <CalibrateTracking/>;
      break;
  }

  /*

  Steps:
 
  - Camera Calibration
  - Main video watching
  - Ranking & Reflection
  - Pay
  */

  return (stepUI);
}
