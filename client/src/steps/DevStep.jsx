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
import { CheckCircle, Error, Help } from '@mui/icons-material';

export default function DevStep({ next }) {

    const player = usePlayer();
    const gameParams = player.get('gameParams');
    
    window.nlpServer.onmessage = (msg) => {

    };

    const handleStartRecording = () => { wsSend(JSON.stringify({'command': 'startRecording'})); }
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
                    <Button onClick={handleStartRecording} >Start Recording</Button>
                    <Button onClick={handleStopRecording} >Stop Recording</Button>
                </Stack>
            </Stack>
        </Container>
    );
}