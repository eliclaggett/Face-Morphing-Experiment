/*
 * Filename: DevStep.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is a test step of the experiment's multiple API connections
 */
import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Stack, Button, Card } from '@mui/joy';
import { usePlayer } from "@empirica/core/player/classic/react";
import { wsSend } from '../utils/utils.js';
import TimerMixin from 'react-timer-mixin';

import Webcam from "react-webcam";
import { CheckCircle, Error, Help, WindowSharp } from '@mui/icons-material';

export default function DevStep({ next }) {

    const player = usePlayer();

    useEffect(() => {
        window.videoIdx = 0;
        window.sideIdx = 0;
        window.gameParams = {
            version: 'July 2024',
            videoLength: 20, // seconds
            numVideos: 6,
            studyPay: 2.4,
            partialPay: 1,
            studyLength: '10 minutes',
            completionCode: 'C19BSZ93',
            livekitURL: 'wss://facemorphing-pse030ak.livekit.cloud',
          
            videos: {
              positive: [
                '6e5975cf-1d81-47a0-a487-7cde60912857',
                '01a62310-06c3-4b69-9d75-50f1e2f1dabf',
                '5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43',
                'd9e1f5a5-e4eb-43df-910b-d9ae2befb039',
                'ada6c3c4-8c97-4b37-b1e1-a28706a194d5',
                '8b0ecdda-eb47-420e-8a79-a41e64a40b09',
                '1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6',
                'd7a96d59-d94f-4e56-b7c4-6e056c561f58',
                '65ef52f0-93a4-435c-ae13-ab502aa60bd7',
                '100af445-702a-4fbd-8474-ec3d17e9490e',
                'ac78bc80-4f3a-481a-91e6-213bc427c0b3',
                'e0de7827-7011-4f5a-be33-24e1827b4d2b'
              ],
              neutral: [
                  '4e458f60-1fa1-4584-aca1-5932319e5ba9',
                  '77f35248-1a74-45ae-b3b2-dfa5433093e3',
                  'a373174c-cade-4c7f-a3d6-7309f225f37d',
                  '3271eacf-69b5-4144-8dbe-b596de94ec30',
                  '1db0a83b-76d3-48f4-b0cd-13d559c67e61',
                  'e0fef00d-2ae2-4c21-8205-8753fc580ec1',
                  'ff6acf35-cfce-4d87-b04e-2bf91f1926ba',
                  '94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e',
                  '43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d',
                  '0f6c2eb4-5e44-46c7-8ea5-ddb74702beee',
                  'e14e94f7-2550-4f38-b9ba-ebe4958e0512',
                  'bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a'
              ]
            }
          };
    }, []);

    
    window.nlpServer.onmessage = (msg) => {

    };

    const handleStartRecording = () => {

        window.recordingInterval = setInterval(() => {
            if (window.videoIdx > 24) {
                clearInterval(window.recordingInterval);
                return;
            }

            console.log('setting video params');
            let vidType = 'positive';
            if (window.videoIdx >= 12)
                vidType = 'neutral';
            let realVidIdx = window.videoIdx % 12;

            wsSend(JSON.stringify({
                'command': 'setVideoParams',
                'video': vidType + '/'+ window.gameParams['videos'][vidType][realVidIdx] + '.mp4',
                'video_idx': videoIdx,
                'swap_idx': window.sideIdx,
                'output_order': 0
            }));

            setTimeout(() => {
                wsSend(JSON.stringify({'command': 'startRecording'}));
            }, 1000);
            setTimeout(() => {
                wsSend(JSON.stringify({'command': 'stopRecording'}));

                if (window.sideIdx == 1) {
                    window.sideIdx = 0;
                    window.videoIdx += 1;
                } else {
                    window.sideIdx = 1;
                }
                if (window.videoIdx > 24) {
                    clearInterval(window.recordingInterval);
                    return;
                }
            }, 1000*20+1000);

        }, 20*1000+5000);

        if (window.videoIdx > 24) {
            clearInterval(window.recordingInterval);
            return;
        }

        let vidType = 'positive';
        if (window.videoIdx >= 12)
            vidType = 'neutral';
        let realVidIdx = window.videoIdx % 12;

        wsSend(JSON.stringify({
            'command': 'setVideoParams',
            'video': vidType + '/'+ window.gameParams['videos'][vidType][realVidIdx] + '.mp4',
            'video_idx': videoIdx,
            'swap_idx': window.sideIdx,
            'output_order': 0
        }));

        setTimeout(() => {
            wsSend(JSON.stringify({'command': 'startRecording'}));
        }, 1000);
        setTimeout(() => {
            wsSend(JSON.stringify({'command': 'stopRecording'}));

            if (window.sideIdx == 1) {
                window.sideIdx = 0;
                window.videoIdx += 1;
            } else {
                window.sideIdx = 1;
            }
            if (window.videoIdx > 24) {
                clearInterval(window.recordingInterval);
                return;
            }
        }, 1000*20+1000);

        
    }
    const handleStopRecording = () => { wsSend(JSON.stringify({'command': 'stopRecording'})); }
        
    // UI
    return (
        <Container maxWidth="100vw" className='systemCheckContainer'>
            <Stack sx={{
                maxWidth: {
                    md: '60rem'
                },
                mx: 'auto',
                mt: '10vh',
                textAlign: 'center'
            }} gap={1} >
                <Typography level="h1" sx={{fontSize: '2em'}}>
                    Test-Only
                </Typography>
 
                <Stack direction="row" justifyContent="center">
                    <Button onClick={handleStartRecording}> Start Self Swap</Button>
                    <Button onClick={handleStopRecording} >Stop</Button>
                </Stack>
            </Stack>
        </Container>
    );
}