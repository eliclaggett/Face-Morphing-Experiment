/*
 * Filename: Recaptcha.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is reCAPTCHA step of the experiment's onboarding process.
 */
import React, { useEffect, useState } from 'react';
import { Container, Typography, Stack, Button } from '@mui/joy';
import ReCAPTCHA from "react-google-recaptcha";
import { usePlayer } from "@empirica/core/player/classic/react";
import { ThumbDownAlt, ThumbUp, ThumbUpAlt, ThumbUpAltRounded, ThumbUpOffAlt, WindowSharp } from '@mui/icons-material';
import LikeButton from '../../components/LikeButton.jsx';
import DislikeButton from '../../components/DislikeButton.jsx';

export default function Recaptcha({ next }) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionIdFromURL = urlParams.get('SESSION_ID');
    const studyIdFromURL = urlParams.get('STUDY_ID');

    const player = usePlayer();
    const gameParams = player.get('gameParams');
    const reCaptchaSiteKey = window.location.hostname == 'localhost' ?
        '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' :
        '6LcJ3hknAAAAANlF8Wp0Uh9RLrsyDSTjZyehZdrM';

    // Logic to handle interactions with this page
    function onChange(value) {
        player.set('submitRecaptcha', { data: value });
    }

    // Logic to move to next step or stop the experiment
    if (player.get('passedRecaptcha') === true) {
        next();
    }

    useEffect(() => {
        if (sessionIdFromURL) {
            player.set('sessionID', sessionIdFromURL);
        }
        if (sessionIdFromURL) {
            player.set('studyID', studyIdFromURL);
        }

        window.animationInterval = null;
        window.animationStep = 1;
    }, []);

    
    
    // UI
    return (
        <Container maxWidth="100vw">
            <Stack sx={{
                maxWidth: {
                    md: '30rem'
                },
                mx: 'auto',
                mt: '10vh',
                textAlign: 'center'
            }} gap={1} >
                <img src="images/main_image.svg" id="headerImg_recaptcha" />
                
                <Typography level="h1" sx={{fontSize: '2em'}}>
                    Welcome to the<br/><span style={{fontSize: '1.2em'}}>Individual Affinity Study</span>
                </Typography>
                <Typography level="body-sm">
                    Version: {gameParams?.version ? gameParams.version : ''}
                </Typography>
                <Typography level="body-md">
                    Complete the CAPTCHA below to get started.
                </Typography>

                <ReCAPTCHA
                    sitekey={reCaptchaSiteKey}
                    onChange={onChange}
                    id="recaptcha_dialog"
                    theme='dark'
                    style={{margin: '1em auto'}}
                />

                <div>
                Research sponsored by: <img src="/images/sonycsl-logo-white.svg" style={{width: '10em', margin: '0.5em auto'}}/>
                </div>
            </Stack>
        </Container>
    );
}