/*
 * Filename: CustomVideo.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Container, FormControl, FormLabel, IconButton, LinearProgress, Radio, RadioGroup, Stack, Typography } from '@mui/joy';
import { radioClasses } from '@mui/joy/Radio';
import { ReplaySharp, VisibilityOff } from '@mui/icons-material';
import { useCountUp } from 'use-count-up';
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
import Webcam from 'react-webcam';

export default function WatchVideos({ next }) {

  const player = usePlayer();
  const game = useGame();
  const gameParams = game.get('gameParams');

  const currentVideo = player.get('currentVideo');
  const videoStartTime = player.get('videoStartTime');
  const requiredWatchTime = gameParams.requiredWatchTime;
  const [timeLeft, setTimeLeft] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [videoVal, setVideoVal] = useState('a');
  const [leftOriginal, setLeftOriginal] = useState('');
  const [leftSwapped, setLeftSwapped] = useState('');
  const [rightOriginal, setRightOriginal] = useState('');
  const [rightSwapped, setRightSwapped] = useState('');
  const [webcamTxt, setWebcamTxt] = useState('click to show');
  const [webcamClass, setWebcamClass] = useState('my_camera_wrapper disabled');
  

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
        let remainingTime = requiredWatchTime * 60 * 1000 - ((startTime + requiredWatchTime * 60 * 1000) - currentTime.getTime());
        let totalTime = 3 * 60 * 1000;
        setTimeLeft(remainingTime);
        setProgressValue(Math.min(remainingTime / totalTime * 100, 100));
      }, 200);
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

  function handleChangeVideo(e) {
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({'command': 'setVideo', 'video': e.target.value}));
    }
    setVideoVal(e.target.value);
  }

  function handleLeftOriginal() {
    setLeftOriginal('active');
    setLeftSwapped('');
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({command: 'useFaceSwap', side: 'left', value: 'no'}))
    }
  }
  function handleLeftSwap() {
    setLeftOriginal('');
    setLeftSwapped('active');
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({command: 'useFaceSwap', side: 'left', value: 'yes'}))
    }
  }
  function handleRightOriginal() {
    setRightOriginal('active');
    setRightSwapped('');
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({command: 'useFaceSwap', side: 'right', value: 'no'}))
    }
  }
  function handleRightSwap() {
    setRightOriginal('');
    setRightSwapped('active');
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({command: 'useFaceSwap', side: 'right', value: 'yes'}))
    }
  }

  function handleReplay() {
    if (window.nlpServer) {
      window.nlpServer.send(JSON.stringify({'command': 'restartVideo'}));
    }
    player.set('videoStartTime', (new Date()).getTime());
  }

  function handleEnd() {
    // next();
    player.set('videoStartTime', (new Date()).getTime());
    player.set('demoStep', 'start');
    setTimeLeft(requiredWatchTime * 60 * 1000);
  }

  function handleShowHideWebcam() {
    if (webcamTxt == 'click to hide') {
      setWebcamClass('my_camera_wrapper disabled');
      setWebcamTxt('click to show');
    } else {
      setWebcamClass('my_camera_wrapper');
      setWebcamTxt('click to hide');
    }
  }
    
    // UI
  return (
        <Container maxWidth="100vw" sx={{pt: 0, justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
          <div className="webcam_box" onClick={handleShowHideWebcam}>
            <div className={webcamClass}>
              <Webcam className='my_camera' mirrored={true} videoConstraints={{width: 240, height: 135}}/>
            </div>
              <VisibilityOff />
            <Typography level='body-sm' sx={{fontWeight: 100}}>{webcamTxt}</Typography>
          </div>
            <Container maxWidth="100vw" sx={{
              maxWidth: '120rem',
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
                <Stack alignItems={'center'} sx={{width: '35rem', pt: 0, flexShrink: 0, flexGrow: 0}}>
                  <span style={{paddingBottom: '0.5em', fontSize: '1.5em', opacity: 1, fontWeight: 100, marginTop: '10rem', color: 'rgb(159, 166, 173)'}}>Switch video:</span>
                  <FormControl>
                  <RadioGroup name="radio-buttons-group" value={videoVal} onChange={handleChangeVideo}>
                    <Radio value="a" label="A" size='lg'/>
                    <Radio value="b" label="B" size='lg'/>
                    <Radio value="c" label="C" size='lg'/>
                  </RadioGroup>
                </FormControl>
                </Stack>
                <MyVideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>
            <Stack direction='row' sx={{ width: '100%', justifyContent: 'center', pt: 4, pl: '0', pr: '0'}}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <ButtonGroup variant="soft">
              <Button className={leftOriginal} onClick={handleLeftOriginal}>Original</Button>
              <Button className={leftSwapped} onClick={handleLeftSwap}>Swapped</Button>
            </ButtonGroup>
            </div>
            <div style={{width: '35rem', flexShrink: 0, flexGrow: 0}}></div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <ButtonGroup variant="soft">
              <Button className={rightOriginal} onClick={handleRightOriginal}>Original</Button>
              <Button className={rightSwapped} onClick={handleRightSwap}>Swapped</Button>
            </ButtonGroup>
            </div>
          </Stack>
        
          </Container>
        <Container
        maxWidth="100vw" sx={{
          maxWidth: '120rem',
          width: '90vw',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '-0.5em',
          pt: 30
        }}
        >
          <LinearProgress
      determinate
      variant="outlined"
      color="neutral"
      size="sm"
      thickness={24}
      value={progressValue}
      sx={{
        '--LinearProgress-radius': '10px',
        '--LinearProgress-thickness': '2px',
        width: 'calc(100% - 5em)',
        mr: 5
      }}
    >
      </LinearProgress>
      <IconButton onClick={handleReplay}><ReplaySharp /></IconButton>
      </Container>
      <Container
        maxWidth="100vw" sx={{
          maxWidth: '120rem',
          width: '90vw',
          display: 'flex',
          alignItems: 'center',
          mb: 10
        }}
        >
            <Typography level='body-sm' textAlign={'left'} sx={{pb:4}}>{msToTime(timeLeft)}</Typography>
          </Container>
            <Stack alignItems={'center'}>
              <Button onClick={handleEnd} color="neutral" variant="soft">End</Button>
            </Stack>
        </Container>
      
    );
}

function MyVideoConference() {
    const trackRefs = useTracks([Track.Source.Camera]);
    const remoteTrackRef = trackRefs.find((trackRef) => trackRef.participant.name === 'python-publisher');

    return (
      <div className='singleVideoContainer'>{remoteTrackRef ? <VideoTrack trackRef={remoteTrackRef}></VideoTrack> : <div>Loading video...</div>}</div>
    );
  }