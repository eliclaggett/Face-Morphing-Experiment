/*
 * Filename: CustomVideo.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */
import React, { useState, useEffect } from 'react';
import { Button, Container, Stack, Typography } from '@mui/joy';
import '@livekit/components-styles';
import {
  ControlBar,
  CarouselLayout,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
  useTracks,
  TrackLoop,
  VideoTrack
} from '@livekit/components-react';
import { Track, RemoteTrack } from 'livekit-client';
import FeedbackButtons from '../components/FeedbackButtons.jsx';
import { AccessToken } from 'livekit-server-sdk';
import { usePlayer, useGame } from  "@empirica/core/player/classic/react";
import { msToTime } from '../utils/formatting.js';

export default function WatchVideos({ next }) {

  const player = usePlayer();
  const game = useGame();
  const gameParams = game.get('gameParams');

  const currentVideo = player.get('currentVideo');
  const videoStartTime = player.get('videoStartTime');
  const requiredWatchTime = gameParams.requiredWatchTime;
  const [timeLeft, setTimeLeft] = useState(0);

  const serverUrl = 'wss://facemorphdemo-jquza55v.livekit.cloud';
  // const [token, setToken] = useState('');
  // const tokenApi = api.livekit.getRoomToken.useMutation();
  const [room, setRoom] = useState('');
  const token = player.get('liveKitToken');

  useEffect(() => {
    player.set('requestLiveKitToken', true);
    let interval = null;
    if (videoStartTime) {
      
      interval = setInterval(() => {
        const currentTime = new Date();
        let startTime = player.get('videoStartTime');
        setTimeLeft((startTime + requiredWatchTime * 60 * 1000) - currentTime.getTime())
      }, 1000);
    } else {
      player.set('videoStartTime', (new Date()).getTime());
    }
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (token === '') {
    return <div>Generating token...</div>;
  }

  function handleNext() {
    // next();
    player.set('videoStartTime', (new Date()).getTime());
    setTimeLeft(requiredWatchTime * 60 * 1000);
  }
    
    // UI
  return (
        <Container maxWidth="100vw" sx={{pt: 30, justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
            
            <Typography level='h1' textAlign={'center'}>Please watch the following interaction</Typography>
            <Typography level='h1' textAlign={'center'} sx={{pb:4}}>{msToTime(timeLeft)}</Typography>
            <Container maxWidth="100vw" sx={{
              maxWidth: '100rem',
              width: '90vw',
            }} className="videoContainer">
              <canvas id='left-canvas'></canvas>
              <canvas id='right-canvas'></canvas>
              <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={serverUrl}
                // Use the default LiveKit theme for nice styles.
                data-lk-theme="default"
                style={{ width: '100%' }}
                >
                <MyVideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>
            
          </Container>
          <Container sx={{ maxWidth: '200rem'}}>
            <Typography style={{textAlign: 'center', paddingTop: 40, fontSize: 20}} level="h3">Any feedback for each person's communication style?</Typography>
            <FeedbackButtons />
            <Stack alignItems={'center'}>
              <Button sx={{p: 2, fontSize: 20}} onClick={handleNext} color="neutral" variant="soft">Next Interaction</Button>
            </Stack>
          </Container>
            
        </Container>
    );
}

function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    // const tracks = useTracks(
    //   [
    //     { source: Track.Source.Camera, withPlaceholder: true },
    //   ],
    //   { onlySubscribed: false },
    // );
    const trackRefs = useTracks([Track.Source.Camera]);
    const remoteTrackRef = trackRefs.find((trackRef) => trackRef.participant.name === 'python-publisher');

    return (
      <>{remoteTrackRef ? <VideoTrack trackRef={remoteTrackRef}></VideoTrack> : <div>Loading video...</div>}</>
      // <GridLayout tracks={tracks} style={{ width: '100vw' }} orientation='horizontal'>
      //   {/* The GridLayout accepts zero or one child. The child is used
      //   as a template to render all passed in tracks. */}
      //   {/* <TrackLoop tracks={tracks}> */}
      //     <ParticipantTile />
      //   {/* </TrackLoop> */}
      // </GridLayout>
    );
  }