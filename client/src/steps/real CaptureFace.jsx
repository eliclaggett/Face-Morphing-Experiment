/*
 * Filename: RequestFace.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file captures a snapshot of the participants camera to retrieve a clean face image.
 */
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Modal, ModalClose, Sheet, Stack, Typography } from '@mui/joy';
import Webcam from 'react-webcam';

export default function CaptureFace({ next }) {

    const [open, setOpen] = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const webcamRef = React.useRef(null);

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
            const imageSrc = webcamRef.current.getScreenshot();
            let multipartData = new FormData();
            // const file = dataURLtoFile(imageSrc, 'test.webp');

            const blob = base64ToBlob(imageSrc);
            blob.name = 'test.webp';

            // generate file from base64 string
            
            multipartData.append('file', blob, blob.name);

            fetch('http://localhost:9019/', {
                method: 'POST',
                headers: {
                  
                  'Accept': 'application/json'
                },
                 body: multipartData
            })
            //   setOpen(true);
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

            <Stack sx={{
                maxWidth: {
                    md: '60rem',
                    sm: '80%'
                },
                mx: 'auto',
                mt: '5rem',
            }} gap={2} >
                <Typography level="h1" textAlign="center">
                Focus Tracking
                </Typography>
                <Typography level="body-md" textAlign="center">
                For the next few minutes, we will analyze where you are looking.
                <br/>
                Please allow us to calibrate the system.
                </Typography>
                </Stack>

                <Stack direction='row' gap={10} justifyContent={'center'} alignItems={'center'}>

                <Stack direction='column' justifyContent={'space-between'} width={'10rem'} alignSelf={'center'}>
                    <Box>
                        <img src="images/camera_light.svg" />
                        <Typography level="h3" textAlign="center">Turn on the lights</Typography>
                    </Box>
                    <Box>
                        <img src="images/camera_glasses.svg" />
                        <Typography level="h3" textAlign="center">Remove glasses</Typography>
                    </Box>
                    <Box>
                        <img src="images/camera_bangs.svg" />
                        <Typography level="h3" textAlign="center">Pull hair back</Typography>
                    </Box>
                </Stack>
                <Stack>
                <div className='calibration_wrapper'>
                    <img src="/images/camera_guide.svg"/>
                    <Webcam className='calibration_camera' mirrored={true} ref={webcamRef}/>
                </div>
                <Typography level="body-md" textAlign="center">Click "Ready" when you're in position.</Typography>
                <Button onClick={handleReady}>Ready</Button>
                </Stack>
                </Stack>  
            
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
            >
                <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 200,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    ml: 6,
                    textAlign: 'center'
                }}
                >
                <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                >
                    Please look here
                </Typography>
                <Button onClick={handleLeftCalibration}>Calibrate left</Button>
                </Sheet>
            </Modal>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openRight}
                onClose={() => setOpenRight(false)}
                sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}
            >
                <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 200,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    mr: 6,
                    textAlign: 'center'
                }}
                >
                <Typography
                    component="h2"
                    id="modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                >
                    Please look here
                </Typography>
                <Button onClick={handleRightCalibration}>Calibrate right</Button>
                </Sheet>
            </Modal>      
        </Container>
    );
}