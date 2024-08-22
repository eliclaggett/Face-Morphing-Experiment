/*
 * Filename: TestStep.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is a test step of the experiment's multiple API connections
 */
import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Stack, Button, Card } from '@mui/joy';
import { usePlayer } from "@empirica/core/player/classic/react";
import { wsSend } from '../utils/utils.js';
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
import TimerMixin from 'react-timer-mixin';

import Webcam from "react-webcam";
import { CheckCircle, Error, Help } from '@mui/icons-material';

export default function TestStep({ next }) {

    const player = usePlayer();
    const gameParams = player.get('gameParams');
    const serverUrl = player.get('livekitURL');
    const webcamRef = useRef(null);
    const token = player.get('liveKitToken');
    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    const [isLoading, setIsLoading] = useState(false);
    const [testSuccess, setTestSuccess] = useState(false);
    const [btnTxt, setBtnTxt] = useState('Test Connection');

    const [cameraIcon, setCameraIcon] = useState(<Help/>);
    const [videoIcon, setVideoIcon] = useState(<Help/>);
    const [networkIcon, setNetworkIcon] = useState(<Help/>);
    const [server1Icon, setServer1Icon] = useState(<Help/>);
    const [server2Icon, setServer2Icon] = useState(<Help/>);


    function collectTestResults() { wsSend(JSON.stringify({'command': 'collectTestResults'})); }

    window.nlpServer.onmessage = (msg) => {

        const data = JSON.parse(msg.data);

        console.log(data);
        if (Object.keys(data).indexOf('received_projection') != -1) {
            document.querySelectorAll('.systemCheck .MuiCard-root').forEach(el => { if (!el.classList.contains('statusVideo')) el.classList.remove('error')});
            setNetworkIcon(<CheckCircle/>);            
            
            if (data.success) {
                setTestSuccess(true);
                setIsLoading(false);
                setCameraIcon(<CheckCircle/>);
                setVideoIcon(<CheckCircle/>);
                setNetworkIcon(<CheckCircle/>);
                setServer1Icon(<CheckCircle/>);
                setServer2Icon(<CheckCircle/>);
                setBtnTxt('Continue');
            } else {
                TimerMixin.setTimeout(collectTestResults, 1000);
                if (!data.webcam_status) { setCameraIcon(<Error/>); document.querySelector('.statusCamera').classList.add('error');}
                else setCameraIcon(<CheckCircle/>);

                if (!data.morph_status) { setServer1Icon(<Error/>); document.querySelector('.statusServer1').classList.add('error');}
                else setServer1Icon(<CheckCircle/>);

                if (!data.swap_status) { setServer2Icon(<Error/>); document.querySelector('.statusServer2').classList.add('error');}
                else setServer2Icon(<CheckCircle/>);
            }
        }
    };

    useEffect(() => {
        if (!token || token == '')
                    player.set('requestLiveKitToken', true);
        window.webcamOn = false;

        if (hasGetUserMedia()) {
            
          } else {
            console.warn("getUserMedia() is not supported by your browser");
          }
    }, []);

    const handleButtonPress = (el) => {
        if (testSuccess) {
            player.set('passedSystemCheck', true);
            next();
        } else {
            setIsLoading(true);
            document.querySelectorAll('.systemCheck .MuiCard-root').forEach(el => { if (!el.classList.contains('statusVideo')) el.classList.remove('error')});
            setCameraIcon(<Help/>);
            setNetworkIcon(<Help/>);
            setServer1Icon(<Help/>);
            setServer2Icon(<Help/>);
            wsSend(JSON.stringify({'command': 'testConnection'}));
            TimerMixin.setTimeout(collectTestResults, 9 * 1000);
        }
    }
    function setHasUserMedia() {
        window.webcamOn = true;
    }
    function handleLivekitConnected() {
        console.log('Connection successfully established with LiveKit');
        setVideoIcon(<CheckCircle/>);
    }
    function handleLivekitError(err) {
        console.log('eli: livekit error');
        console.log(err);
        setVideoIcon(<Error/>);
        document.querySelector('statusVideo').classList.add('error');
    }

    
    
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
                    System Test
                </Typography>
                <Typography level="body-md">
                    Please allow us to test that all systems are operational before continuing with this study.
                    <br/>This will take about ten seconds.
                </Typography>
                <Stack direction="row" className="systemCheck" sx={{py: 15}}>
                    <Card className='statusCamera'>
                        {cameraIcon}
                        Camera
                    </Card>
                    <Card className='statusVideo'>
                        {videoIcon}
                        Video Stream
                    </Card>
                    <Card className='statusNetwork'>
                        {networkIcon}
                        Network
                    </Card>
                    <Card className='statusServer1'>
                        {server1Icon}
                        Server 1
                    </Card>
                    <Card className='statusServer2'>
                        {server2Icon}
                        Server 2
                    </Card>
                </Stack>
                
                
                <Webcam
                ref={webcamRef}
                onUserMedia={setHasUserMedia}
                style={{display: 'none'}}
                />
                <Stack direction="row" justifyContent="center">
                    <Button onClick={handleButtonPress} loading={isLoading}>{btnTxt}</Button>
                </Stack>
            </Stack>
            <div style={{display: 'block'}}>
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
                    </LiveKitRoom>
                </div>
        </Container>
    );
}