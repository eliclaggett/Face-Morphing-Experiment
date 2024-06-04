import { Chat, useGame, usePlayer } from "@empirica/core/player/classic/react";
import { Button, Box, Container, IconButton, Typography, Stack, FormControl, FormLabel, FormHelperText, Radio, RadioGroup } from '@mui/joy';

import React from "react";
import CaptureFace from "./steps/CaptureFace.jsx";
import WatchVideos from "./steps/WatchVideos.jsx";
// import WatchVideos from "./steps/real_WatchVideos.jsx";
import VideoRanking from "./steps/VideoRanking.jsx";


export function Game() {

  const player = usePlayer();

  const demoStep = player.get('demoStep');

  const stepUI = demoStep == 'video' ? <WatchVideos/> : <CaptureFace/>;

  return (<>
    {/* <VideoRanking /> */}
    {/* <WatchVideos/> */}
    <span className='caps'>FACIAL FAMILIARITY</span>
    {stepUI}
    {/* <CaptureFace/> */}
    {/* <WatchVideos/> */}
    </>
  );
}
