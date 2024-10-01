/*
 * Filename: CustomVideo.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, ButtonGroup, Container, FormControl, FormLabel, IconButton, LinearProgress, Radio, RadioGroup, Stack, Typography } from '@mui/joy';
import { radioClasses } from '@mui/joy/Radio';
import { ReplaySharp, SettingsInputAntennaTwoTone, ThumbDownAlt, ThumbUpAlt, VisibilityOff } from '@mui/icons-material';
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
import { Track, RemoteTrack, setLogLevel } from 'livekit-client';
import FeedbackButtons from '../components/FeedbackButtons.jsx';
import { AccessToken } from 'livekit-server-sdk';
import { usePlayer, useGame } from  "@empirica/core/player/classic/react";
import { msToTime } from '../utils/formatting.js';
import Webcam from 'react-webcam';
import LikeButton from '../components/LikeButton.jsx';
import DislikeButton from '../components/DislikeButton.jsx';
import VerticalProgress from '../components/VerticalProgress.jsx';
import { wsSend } from '../utils/utils.js';
import TimerMixin from 'react-timer-mixin';

export default function WatchVideos({ next }) {

  const player = usePlayer();
  const game = useGame();
  const gameParams = game.get('gameParams');

  const randomizedVideos = player.get('randomizedVideos');
  const randomizedMorphingLevel = player.get('randomizedMorphingLevel');
  const randomizedMorphingLR = player.get('randomizedMorphingLR');
  const randomizedDisplayLR = player.get('randomizedDisplayLR');
  const videoReactions = player.get('videoReactions');
  const videoWatchTimes = player.get('videoWatchTimes') || [];

  const requiredWatchTime = gameParams?.videoLength? gameParams.videoLength : 20;
  const [timeLeft, setTimeLeft] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const videoIdx = player.get('videoIdx') || 0;
  const [loadingTimer, setLoadingTimer] = useState(10);


  const [leftLikeAmt, setLeftLikeAmt] = useState(0);
  const [leftDislikeAmt, setLeftDislikeAmt] = useState(0);

  const [rightLikeAmt, setRightLikeAmt] = useState(0);
  const [rightDislikeAmt, setRightDislikeAmt] = useState(0);

  // Webcam show/hide
  const [webcamTxt, setWebcamTxt] = useState('click to show self');
  const [webcamClass, setWebcamClass] = useState('my_camera_wrapper disabled');

  const serverUrl = gameParams.livekitURL;
  const token = player.get('liveKitToken');
  const vectorDistances = player.get('vectorDistances') || [];

  const [runInterval, setRunInterval] = useState(false);
  const intervalRef = useRef(null);

  const [audio, setAudio] = useState(false);

  let timerInterval = null;

  window.nlpServer.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    if (data.command && data.command == 'clientRestartVideo') {
        window.videoStartTime = (new Date()).getTime();
        setRunInterval(true);
    }

    if (data.distance) {
      player.set('vectorDistances', [...vectorDistances, data.distance]);
    }
};

  function playbackFunc() {
        const currentTime = new Date();
        let totalTime = requiredWatchTime * 1000;
        let elapsedTime = currentTime.getTime() - window.videoStartTime;

        if (elapsedTime >= totalTime) {
          // Show rating UI
          document.querySelectorAll('.ratingUI').forEach((el) => { el.classList.remove('hidden')});
          document.querySelector('.nextVideo').classList.remove('hidden');
          document.querySelector('.videoProgress').classList.remove('animated');
          setRunInterval(false);
        }

        const timeLeft = Math.min(elapsedTime, totalTime);
        const progressVal = Math.min(elapsedTime / totalTime * 100, 100);

        setTimeLeft(timeLeft);
        setProgressValue(progressVal);
  }


  useEffect(() => {
    if (runInterval) {
      document.querySelector('.videoProgress').classList.add('animated');
      intervalRef.current = setInterval(playbackFunc, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [runInterval]);

  const clear = () => {
    setRunInterval(false);
  };

  useEffect(() => {
    if (loadingTimer <= 0) { TimerMixin.clearInterval(timerInterval); } else {
      setTimeout(() => setLoadingTimer(loadingTimer-1), 1000);
    }
    if (loadingTimer == 0) {
      handleReplay();
      setAudio(true);
      document.querySelector('.loadingModal').style.opacity = 0;
      setTimeout(() => {
        document.querySelectorAll('.singleVideoContainer').forEach((el) => el.classList.add('ready'));
        document.querySelector('.loadingModal').classList.add('hidden');
      }, 200);
    }


  }, [loadingTimer]);

  useEffect(() => {

    window.hideRatingUI = true;
    window.loadingTimer = 10;
    window.videoStartTime = (new Date()).getTime();

    setLogLevel('error');

    if (!token)
      player.set('requestLiveKitToken', true);
    if (document.querySelector('#webgazerVideoFeed')) {
      document.querySelector('#webgazerVideoFeed').remove();
      document.querySelector('#webgazerFaceFeedbackBox').remove();
    }

    return () => {
      clearInterval(intervalRef.current); // playbackFunc
      TimerMixin.clearInterval(timerInterval);
    };

  }, []);

  if (token === '') {
    return <div>Generating token...</div>;
  }

  function handleReplay() {
    clear();
    if (window.nlpServer) {
      wsSend(JSON.stringify({'command': 'restartVideo'}));
    }

    setProgressValue(0);
    window.videoStartTime = (new Date()).getTime();
    player.set('videoStartTime', (new Date()).getTime());
    // setRunInterval(true);
  }

  function handleShowHideWebcam() {
    if (webcamTxt == 'click to hide') {
      setWebcamClass('my_camera_wrapper disabled');
      setWebcamTxt('click to show self');
    } else {
      setWebcamClass('my_camera_wrapper');
      setWebcamTxt('click to hide');
    }
  }

  function handleNextVideo() {
    setLoadingTimer(10);
    setTimeLeft(0);
    setProgressValue(0);
    setAudio(false);

    setLeftLikeAmt(0);
    setLeftDislikeAmt(0);
    setRightLikeAmt(0);
    setRightDislikeAmt(0);
    document.querySelectorAll('.like').forEach(el => el.style.setProperty('--LinearProgress-progressThickness', '0%'));
    document.querySelectorAll('.dislike').forEach(el => el.style.setProperty('--LinearProgress-progressThickness', '0%'));

    // Show next video loading screen
    document.querySelector('.loadingModal').classList.remove('hidden');
    document.querySelectorAll('.singleVideoContainer').forEach((el) => el.classList.remove('ready'));
    setTimeout(() => {
      document.querySelector('.loadingModal').style.opacity = 1;
    }, 100);
    
    // Hide rating UI
    document.querySelectorAll('.ratingUI').forEach((el) => { el.classList.add('hidden')});
    document.querySelector('.nextVideo').classList.add('hidden');

    // Request next video
    wsSend(JSON.stringify({'command': 'getLastVectorDistance'}));
    wsSend(JSON.stringify({'command': 'pauseVideo'}));

    if (videoIdx >= gameParams.numVideos) {
      player.set('finishedWatching', true);
      player.set('studyStep', 'survey');
      return;
    }

    const convo_id = randomizedVideos[videoIdx].slice(randomizedVideos[videoIdx].indexOf('/')+1, -4);
    console.log(convo_id)
    let swappedGender = gameParams['video_genders'][convo_id][randomizedMorphingLR[videoIdx]]
    
    let useActor = 0;
    useActor = swappedGender == 'male' ? 2 : 1;
    let morphingLevel = randomizedMorphingLevel[videoIdx];
    if (morphingLevel == 1) { morphingLevel = 3; }

    wsSend(JSON.stringify({
      'command': 'setVideoParams',
      'video': randomizedVideos[videoIdx],
      'video_idx': videoIdx,
      'swap_idx': randomizedMorphingLR[videoIdx],
      'morphing_level': morphingLevel,
      'output_order': randomizedDisplayLR[videoIdx],
      'use_actor': useActor
    }));
    player.set('videoWatchTimes', [...videoWatchTimes, {'idx': videoIdx, 'ts': (new Date()).getTime()}]);
  }

  useEffect(() => {
    handleNextVideo();
  }, [videoIdx]);

  function handleButtonClick() {
    player.set('videoReactions', [...videoReactions, {
      videoIdx: videoIdx,
      leftLikeAmt: leftLikeAmt,
      leftDislikeAmt: leftDislikeAmt,
      rightLikeAmt: rightLikeAmt,
      rightDislikeAmt: rightDislikeAmt
    }]);

    player.set('videoIdx', videoIdx+1);
  }

  function handleLivekitConnected() {
      console.log('livekit connected');
  }
  function handleLivekitError(err) {
      console.log('livekit error');
      console.log(err);
  }
  function setHolding(name, val) {
    let el = null;
    if (name == 'leftLike') { el = document.querySelectorAll('.like')[0]}
    else if (name == 'rightLike') { el = document.querySelectorAll('.like')[1]}
    else if (name == 'leftDislike') { el = document.querySelectorAll('.dislike')[0]}
    else if (name == 'rightDislike') { el = document.querySelectorAll('.dislike')[1]}
    if (val == -1) {
      el.classList.remove('animated');
      requestAnimationFrame(() => {
        el.classList.add('animated');
        el.style.setProperty('--LinearProgress-progressThickness', '100%');
      });
    } else {
      const newVal = Math.min(val / 3000 * 100, 100);
      if (name == 'leftLike') { setLeftLikeAmt(newVal + leftLikeAmt)}
      else if (name == 'rightLike') { setRightLikeAmt(newVal + rightLikeAmt)}
      else if (name == 'leftDislike') { setLeftDislikeAmt(newVal + leftDislikeAmt)}
      else if (name == 'rightDislike') { setRightDislikeAmt(newVal + rightDislikeAmt)}
    }
  }

  let loadingTxt = 'The next video is loading...';
  if (videoIdx == 0) {
    loadingTxt = 'Next, please watch and react to the following videos...';
  }

  let btnTxt = 'Next Video';
  if (videoIdx == 5) {
    btnTxt = 'Continue';
  }
  // UI
  return (
  <Container maxWidth="100vw" sx={{pt: 0, justifyContent: 'center', display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Container className='loadingModal'>
        <Typography level='body-md' sx={{fontSize: '1.5em'}}>{loadingTxt}</Typography>
        <Typography level='title-lg' sx={{fontSize: '3em'}}>{loadingTimer}</Typography>
      </Container>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh', marginBottom: '4rem'}}>
            <Typography level='title-lg'>Pay attention to the following interaction ({videoIdx+1} / {gameParams.numVideos})</Typography>
            <Typography level='body-md'>Then, please rate how much you like or dislike each individual</Typography>
          </div>
          
          
            <Container maxWidth="100vw" sx={{
              maxWidth: '120rem',
              width: '90vw',
              gap: 6
            }} className="videoContainer">
              {/* <canvas id='left-canvas'></canvas>
              <canvas id='right-canvas'></canvas> */}
              <LiveKitRoom
                video={true}
                audio={false}
                token={token}
                serverUrl={serverUrl}
                // Use the default LiveKit theme for nice styles.
                data-lk-theme="default"
                style={{ width: '100%' , gap: 40}}
                onError={handleLivekitError}
                onConnected={handleLivekitConnected}
                >
                <div className='verticalProgress ratingUI hidden'>
                  <div className='singleBar'>
                    <VerticalProgress determinate value={leftLikeAmt} className='like' />
                    <ThumbUpAlt/>
                  </div>
                  <div className='singleBar'>
                  <VerticalProgress determinate value={leftDislikeAmt} className='dislike' />
                  <ThumbDownAlt/>
                  </div>
                </div>
                <MyVideoConference />
                <Stack alignItems={'center'} sx={{width: '35rem', maxWidth: '20vw', pt: 0, flexShrink: 0, flexGrow: 0, justifyContent: 'center'}}>
                <div className="webcam_box" onClick={handleShowHideWebcam}>
                  <div className={webcamClass}>
                    <Webcam className='my_camera' mirrored={true}/>
                    {/* <Webcam className='my_camera' mirrored={true} videoConstraints={{width: 240, height: 135}}/> */}
                  </div>
                    <VisibilityOff />
                  <Typography level='body-sm' sx={{fontWeight: 100}}>{webcamTxt}</Typography>
                </div>
                </Stack>
                <MyVideoConference />
                <div className='verticalProgress ratingUI hidden'>
                  <div className='singleBar'>
                    <VerticalProgress determinate value={rightLikeAmt} className='like animated' />
                    <ThumbUpAlt/>
                  </div>
                  <div className='singleBar'>
                  <VerticalProgress determinate value={rightDislikeAmt} className='dislike' />
                  <ThumbDownAlt/>
                  </div>
                </div>
                <RoomAudioRenderer />
            </LiveKitRoom>
            <Stack direction='row' sx={{ width: '100%', justifyContent: 'center', pt: 4, pl: '0', pr: '0'}} className='ratingUI hidden'>
            <div style={{width: '3.5rem', flexShrink: 0}}></div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '1em'}}>
              <LikeButton setHolding={setHolding} name='leftLike'/>
              <DislikeButton setHolding={setHolding} name='leftDislike'/>
            </div>
            <div style={{width: '35rem', maxWidth: '20vw', pt: 0, flexShrink: 0, flexGrow: 0, justifyContent: 'center'}}></div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '1em'}}>
              <LikeButton setHolding={setHolding} name='rightLike'/>
              <DislikeButton setHolding={setHolding} name='rightDislike'/>
            </div>
            <div style={{width: '3.5rem', flexShrink: 0}}></div>
          </Stack>
        
          </Container>
        <Container
        maxWidth="100vw" sx={{
          maxWidth: '120rem',
          width: '90vw',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '-0.5em',
          pt: 6
        }}
        >
          <div style={{width: '3.5rem', flexShrink: 0}}></div>
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
      className='videoProgress animated'
    >
      </LinearProgress>
      <IconButton onClick={handleReplay}><ReplaySharp /></IconButton>
      <div style={{width: '3.5rem', flexShrink: 0}}></div>
      </Container>
      <Container
        maxWidth="100vw" sx={{
          maxWidth: '120rem',
          width: '90vw',
          display: 'flex',
          alignItems: 'center',
          mb: 0
        }}
        >
          <div style={{width: '3.5rem', flexShrink: 0}}></div>
            <Typography level='body-sm' textAlign={'left'} sx={{pb:4}}>{msToTime(timeLeft)}</Typography>
          </Container>
            <Stack alignItems={'center'}>
              <Button onClick={handleButtonClick} color="neutral" variant="soft" className="nextVideo hidden">{btnTxt}</Button>
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