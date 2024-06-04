/*
 * Filename: RequestFace.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file captures a snapshot of the participants camera to retrieve a clean face image.
 */
import React, { useState, useEffect } from 'react';
import { usePlayer } from "@empirica/core/player/classic/react";
import { Box, Button, Container, Modal, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import Webcam from 'react-webcam';

export default function CaptureFace({ next }) {

    const [open, setOpen] = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const webcamRef = React.useRef(null);
    const player = usePlayer();

    const base64ToBlob = (dataurl) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1]
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
  
        return new Blob(byteArrays, {type: mime});
    }

    const handleReady =  React.useCallback(
        () => {
            player.set('demoStep', 'video');
            if (window.nlpServer) {
                window.nlpServer.send(JSON.stringify({'command': 'resetAll'}));
              }
        //     const imageSrc = webcamRef.current.getScreenshot();
        //     let multipartData = new FormData();
        //     // const file = dataURLtoFile(imageSrc, 'test.webp');

        //     const blob = base64ToBlob(imageSrc);
        //     blob.name = 'test.webp';

        //     // generate file from base64 string
            
        //     multipartData.append('file', blob, blob.name);

        //     fetch('http://localhost:9019/', {
        //         method: 'POST',
        //         headers: {
                  
        //           'Accept': 'application/json'
        //         },
        //          body: multipartData
        //     })
        //     //   setOpen(true);
        },
        [webcamRef]
    );

    function handleLeftCalibration() {
        setOpen(false);
        setOpenRight(true);
    }
    function handleRightCalibration() {
        setOpen(false);
        setOpenRight(false);
    }

    // UI
    return (
        <Container maxWidth="100vw">
                <Stack direction='row' gap={10} justifyContent={'center'} alignItems={'center'}>
                <Stack gap={6} sx={{pt: 8}} alignItems={'center'}>
                <div className='calibration_wrapper'>
                    <img src="/images/camera_guide.svg"/>
                    <Webcam className='calibration_camera' mirrored={true} ref={webcamRef}/>
                </div>
                <Typography level="body-md" textAlign="center">Please align your face with the camera and press "Start"</Typography>
                <Button onClick={handleReady}>Start</Button>
                </Stack>
                </Stack>   
        </Container>
    );
}