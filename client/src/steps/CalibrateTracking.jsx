/*
 * Filename: RequestFace.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file captures a snapshot of the participants camera to retrieve a clean face image.
 */
import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from "@empirica/core/player/classic/react";
import { Alert, Box, Button, CircularProgress, Container, Modal, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import { wsSend } from '../utils/utils.js';
import './CalibrateTracking.css';
import '@livekit/components-styles';
import { Info }  from '@mui/icons-material';
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
import TimerMixin from 'react-timer-mixin';

import Webcam from "react-webcam";
import {
  FaceDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

import calibrationBangs from '../assets/calibration_bangs.svg';
import calibrationGlasses from '../assets/calibration_glasses.svg';
import calibrationLight from '../assets/calibration_light.svg';



export default function CalibrateTracking({ next }) {
  const [open, setOpen] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  const player = usePlayer();

  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [pointCalibrate, setPointCalibrate] = useState(0);
  const serverUrl = player.get('livekitURL');
  const token = player.get('liveKitToken');
  const calibrationClicks = player.get('calibrationPointClick') || [];

  if (token === '') {
    return <div>Generating token...</div>;
  }

  window.nlpServer.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    if (data.command && data.command == 'next') {
      TimerMixin.setTimeout(() => {
        player.set('finishedCalibrating', true);
        player.set('studyStep', 'video');
        player.set('videoStartTime', (new Date()).getTime());
      }, 2500);
    }

    if (data.startTime) {
      player.set('recordingStartTime', data.startTime);
    }
  };


  const base64ToBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const sliceSize = 1024;
    const byteChars = window.atob(arr[1]);
    const byteArrays = [];

    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      let slice = byteChars.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  };

  // Start custom
  let faceDetector;
  let runningMode = "IMAGE";
  const initializefaceDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );
    faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
        delegate: "GPU"
      },
      runningMode: runningMode
    });
  };

  const webcamRef = useRef(null);

  let video = document.querySelector("video");
  let liveView = document.querySelector("#liveView");

  // Check if webcam access is supported.
  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

  // Keep a reference of all the child elements we create
  // so we can remove them easily on each render.
  var children = [];



  function setHasUserMedia() {
    window.webcamOn = true;
  }

  let lastVideoTime = -1;

  async function predictWebcam() {
    // if image mode is initialized, create a new classifier with video runningMode
    if (runningMode === "IMAGE") {
      runningMode = "VIDEO";
      await faceDetector.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();

    // Detect faces using detectForVideo
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      const detections = faceDetector.detectForVideo(video, startTimeMs)
        .detections;
      displayVideoDetections(detections);
    }

    // Call this function again to keep predicting when the browser is ready
    window.requestAnimationFrame(predictWebcam);
  }

  function displayVideoDetections(detections) {
    // Remove any highlighting from previous frame.

    for (let child of children) {
      liveView.removeChild(child);
    }
    children.splice(0);
    const positionWarning = document.querySelector('#positionWarning');
    const multipleWarning = document.querySelector('#multipleWarning');

    // Iterate through predictions and draw them to the live view
    if (detections.length > 1) {
      multipleWarning.classList.remove('hidden');
    } else {
      multipleWarning.classList.add('hidden');
    }

    for (let detection of detections) {
      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");

      const headHeight = detection.boundingBox.height;
      const horScalar = video.offsetWidth / video.videoWidth;
      const vertScalar = liveView.offsetHeight / video.videoHeight;
      const realWidth = vertScalar * video.videoWidth;

      const left = (video.offsetWidth + (realWidth - video.offsetWidth) / 2 - detection.boundingBox.width * vertScalar) - detection.boundingBox.originX * vertScalar;
      const width = (detection.boundingBox.width - 10) * vertScalar;
      const top = (detection.boundingBox.originY - headHeight / 2) * vertScalar;
      const height = (detection.boundingBox.height + headHeight / 2) * vertScalar;

      highlighter.style =
        "left: " + left + "px;" +
        "top: " + top + "px;" +
        "width: " + width + "px;" +
        "height: " + height + "px;";

      if (
        left < video.offsetWidth / 10
        || left + width > video.offsetWidth * 9 / 10
        || top < video.offsetHeight / 10
        || top + height > video.offsetHeight * 9 / 10
      ) {
        highlighter.classList.add('outOfBounds');
        liveView.classList.add('outOfBounds');
        positionWarning.classList.remove('hidden');
      } else {
        liveView.classList.remove('outOfBounds');
        positionWarning.classList.add('hidden');
      }

      liveView.appendChild(highlighter);
      children.push(highlighter);

    }
  }

  useEffect(() => {
    if (!token || token == '')
      player.set('requestLiveKitToken', true);
    window.webcamOn = false;
    wsSend(JSON.stringify({ 'command': 'startRecording' }));
    initializefaceDetector();

    if (hasGetUserMedia()) {
      let interval = setInterval(() => {
        if (faceDetector && window.webcamOn) {
          video = document.querySelector('video');
          liveView = document.querySelector("#liveView");
          predictWebcam();
          clearInterval(interval);
        }
      }, 500);

    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }
  }, []);
  // End custom

  const handleReady = () => {
    if (pointCalibrate >= 2) {
      player.set('startedCalibrating', true);
      document.querySelector('#step2Container').classList.add('hidden');
      document.querySelector('#pageTitle').classList.add('hidden');
      document.querySelectorAll('.calibratingMsg').forEach(el => el.classList.remove('hidden'));
      wsSend(JSON.stringify({ 'command': 'captureFace' }));
    }
  };

  function showFinalInstructions() {
    document.querySelector('#instructionTxt').innerHTML = 'Finally, <b>please pull back your bangs</b> and click on your own face to finish calibration.';
    document.querySelector('.calibrationDiv').style.display = 'none';
    // document.querySelector('.videoView').style.display = 'none';
    document.querySelector('#finalButton').classList.remove('hidden');
  }
  function calPointClick(ev) {
    const node = ev.target;
    const id = node.id;

    const CalibrationPoints = calibrationPoints;
    let PointCalibrate = pointCalibrate;

    if (!CalibrationPoints[id]) { // initialises if not done
      CalibrationPoints[id] = 0;
    }
    CalibrationPoints[id]++; // increments values

    player.set('calibrationPointClick', [...calibrationClicks, {id: id, ts: (new Date()).getTime()}])

    if (CalibrationPoints[id] == 3) { //only turn to gold after multiple clicks
      node.style.setProperty('background-color', '#ffd700');
      node.setAttribute('disabled', 'disabled');
      PointCalibrate++;
      console.log('finished point' + PointCalibrate);
    } else if (CalibrationPoints[id] < 3) {
      //Gradually increase the opacity of calibration points when click to give some indication to user.
      var opacity = 0.2 * CalibrationPoints[id] + 0.6;
      node.style.setProperty('opacity', opacity);
    }

    setCalibrationPoints(CalibrationPoints);
    setPointCalibrate(PointCalibrate);
    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 8) {
      document.getElementById('Pt5').style.removeProperty('display');
    }

    if (PointCalibrate >= 2) { // last point is calibrated
      // handleReady();
      showFinalInstructions();
    }
  }

  function startCalibration() {
    document.querySelector('#step1Container').classList.add('hidden');
    document.querySelector('#step2Container').classList.remove('hidden');
  }

  function handleLivekitConnected() {
    console.log('Connection successfully established with LiveKit');
  }
  function handleLivekitError(err) {
    console.log('eli: livekit error');
    console.log(err);
  }

  // UI
  return (
    <Container width="100vw">
      <Stack direction='column' justifyContent={'top'} alignItems={'center'} sx={{ height: '100vh', pt: '10vh' }}>
        <Typography level="title-lg" textAlign="center" id="pageTitle">Eye-Tracking Calibration</Typography>
        <Container id="step1Container" align={'center'}>
          <Typography level='body-md' textAlign={'center'}>
            To calibrate the eye tracking system, please follow the instructions below.<br />
            We cannot continue unless all requirements are met.
          </Typography>


          <Stack direction="row" justifyContent={'center'}>
            <div className='calibrationStep'>
              <img src={calibrationBangs} />
              Pull back bangs
            </div>
            <div className='calibrationStep'>
              <img src={calibrationGlasses} />
              Remove dark glasses
            </div>

            <div className='calibrationStep'>
              <img src={calibrationLight} />
              Turn on the lights
            </div>
          </Stack>

          <Alert color="primary" variant='soft' sx={{ mt: 4 }} startDecorator={<Info/>} >
            Please maximize the size of this browser window now.
            After calibration is complete, please do not move or resize this window.
          </Alert>

          <Button sx={{ mt: 4 }} onClick={startCalibration} id='startCalibrationButton'>I Understand</Button>
        </Container>
        <Container id="step2Container" className='hidden'>
          <Typography level="body-md" textAlign="center" id="instructionTxt">
            Please align your face with the camera and click the calibration targets <span className="calibrationEx"></span> on the left and right of the page until they turn gold.
          </Typography>
          <Container width="100%" sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', pt: 6, flexWrap: 'wrap', flexDirection: 'column' }}>
            <div id="liveView" className="videoView" sx={{ position: 'relative' }}>
              <div onClick={handleReady} id="finalButton"></div>
              <Webcam
                ref={webcamRef}
                onUserMedia={setHasUserMedia}
              />
            </div>
            <Alert id="positionWarning" color="danger" variant="outlined" sx={{mt: 1}} className="hidden">Please position your face within the box</Alert>
            <Alert id="multipleWarning" color="danger" variant="outlined" sx={{mt: 1}} className="hidden">Too many faces detected in the frame</Alert>
          </Container>

          <div className="calibrationDiv">
            <input type="button" className="Calibration" id="Pt1" onClick={calPointClick}></input>
            <input type="button" className="Calibration" id="Pt2" onClick={calPointClick}></input>
          </div>

          <Stack sx={{ pt: 8, gap: 4, alignItems: 'center' }} className='instructions'>

            {/* <Button onClick={handleReady} id="finalButton" className='hidden'>Start Main Task</Button>  */}
          </Stack>

          <div style={{ display: 'block' }}>
            <LiveKitRoom
              video={true}
              audio={false}
              token={token}
              serverUrl={serverUrl}
              // Use the default LiveKit theme for nice styles.
              data-lk-theme="default"
              style={{ width: '100%', gap: 40 }}
              onError={handleLivekitError}
              onConnected={handleLivekitConnected}
            >
            </LiveKitRoom>
          </div>
        </Container>
        <Typography level='title-lg' className='calibratingMsg hidden'>Calibration in progress...</Typography>
        <Typography level='title-md' className='calibratingMsg hidden'>Please hold still</Typography>
      </Stack>
    </Container>
  );
}