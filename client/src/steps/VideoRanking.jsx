/*
 * Filename: VideoRanking.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */
import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Container, FormControl, FormLabel, Grid, LinearProgress, Radio, RadioGroup, Sheet, Stack, Textarea, Typography } from '@mui/joy';
import { ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material';
import LikertQuestion from '../components/LikertQuestion.jsx';
import { usePlayer, useGame } from "@empirica/core/player/classic/react";
import { wsSend } from '../utils/utils.js';

import P1 from '../assets/stills/positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_0.jpg';
import P2 from '../assets/stills/positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_1.jpg';
import P3 from '../assets/stills/positive/100af445-702a-4fbd-8474-ec3d17e9490e_0.jpg';
import P4 from '../assets/stills/positive/100af445-702a-4fbd-8474-ec3d17e9490e_1.jpg';
import P5 from '../assets/stills/positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0.jpg';
import P6 from '../assets/stills/positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1.jpg';
import P7 from '../assets/stills/positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_0.jpg';
import P8 from '../assets/stills/positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_1.jpg';
import P9 from '../assets/stills/positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0.jpg';
import P10 from '../assets/stills/positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1.jpg';
import P11 from '../assets/stills/positive/6e5975cf-1d81-47a0-a487-7cde60912857_0.jpg';
import P12 from '../assets/stills/positive/6e5975cf-1d81-47a0-a487-7cde60912857_1.jpg';
import P13 from '../assets/stills/positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_0.jpg';
import P14 from '../assets/stills/positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_1.jpg';
import P15 from '../assets/stills/positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0.jpg';
import P16 from '../assets/stills/positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1.jpg';
import P17 from '../assets/stills/positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_0.jpg';
import P18 from '../assets/stills/positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_1.jpg';
import P19 from '../assets/stills/positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_0.jpg';
import P20 from '../assets/stills/positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_1.jpg';
import P21 from '../assets/stills/positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0.jpg';
import P22 from '../assets/stills/positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1.jpg';
import P23 from '../assets/stills/positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_0.jpg';
import P24 from '../assets/stills/positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_1.jpg';

import N1 from '../assets/stills/neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_0.jpg';
import N2 from '../assets/stills/neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_1.jpg';
import N3 from '../assets/stills/neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_0.jpg';
import N4 from '../assets/stills/neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_1.jpg';
import N5 from '../assets/stills/neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_0.jpg';
import N6 from '../assets/stills/neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_1.jpg';
import N7 from '../assets/stills/neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0.jpg';
import N8 from '../assets/stills/neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1.jpg';
import N9 from '../assets/stills/neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_0.jpg';
import N10 from '../assets/stills/neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_1.jpg';
import N11 from '../assets/stills/neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_0.jpg';
import N12 from '../assets/stills/neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_1.jpg';
import N13 from '../assets/stills/neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0.jpg';
import N14 from '../assets/stills/neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1.jpg';
import N15 from '../assets/stills/neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0.jpg';
import N16 from '../assets/stills/neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1.jpg';
import N17 from '../assets/stills/neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_0.jpg';
import N18 from '../assets/stills/neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_1.jpg';
import N19 from '../assets/stills/neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_0.jpg';
import N20 from '../assets/stills/neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_1.jpg';
import N21 from '../assets/stills/neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0.jpg';
import N22 from '../assets/stills/neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1.jpg';
import N23 from '../assets/stills/neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0.jpg';
import N24 from '../assets/stills/neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1.jpg';



const stillMap = [
    ['positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_0', P1],
    ['positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_1', P2],
    ['positive/100af445-702a-4fbd-8474-ec3d17e9490e_0', P3],
    ['positive/100af445-702a-4fbd-8474-ec3d17e9490e_1', P4],
    ['positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0', P5],
    ['positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1', P6],
    ['positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_0', P7],
    ['positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_1', P8],
    ['positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0', P9],
    ['positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1', P10],
    ['positive/6e5975cf-1d81-47a0-a487-7cde60912857_0', P11],
    ['positive/6e5975cf-1d81-47a0-a487-7cde60912857_1', P12],
    ['positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_0', P13],
    ['positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_1', P14],
    ['positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0', P15],
    ['positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1', P16],
    ['positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_0', P17],
    ['positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_1', P18],
    ['positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_0', P19],
    ['positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_1', P20],
    ['positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0', P21],
    ['positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1', P22],
    ['positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_0', P23],
    ['positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_1', P24],
    ['neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_0', N1],
    ['neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_1', N2],
    ['neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_0', N3],
    ['neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_1', N4],
    ['neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_0', N5],
    ['neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_1', N6],
    ['neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0', N7],
    ['neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1', N8],
    ['neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_0', N9],
    ['neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_1', N10],
    ['neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_0', N11],
    ['neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_1', N12],
    ['neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0', N13],
    ['neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1', N14],
    ['neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0', N15],
    ['neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1', N16],
    ['neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_0', N17],
    ['neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_1', N18],
    ['neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_0', N19],
    ['neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_1', N20],
    ['neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0', N21],
    ['neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1', N22],
    ['neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0', N23],
    ['neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1', N24]
];
const stillMapTxt = [
    'positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_0',
    'positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_1',
    'positive/100af445-702a-4fbd-8474-ec3d17e9490e_0',
    'positive/100af445-702a-4fbd-8474-ec3d17e9490e_1',
    'positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0',
    'positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1',
    'positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_0',
    'positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_1',
    'positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0',
    'positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1',
    'positive/6e5975cf-1d81-47a0-a487-7cde60912857_0',
    'positive/6e5975cf-1d81-47a0-a487-7cde60912857_1',
    'positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_0',
    'positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_1',
    'positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0',
    'positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1',
    'positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_0',
    'positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_1',
    'positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_0',
    'positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_1',
    'positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0',
    'positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1',
    'positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_0',
    'positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_1',
    'neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_0',
    'neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_1',
    'neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_0',
    'neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_1',
    'neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_0',
    'neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_1',
    'neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0',
    'neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1',
    'neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_0',
    'neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_1',
    'neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_0',
    'neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_1',
    'neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0',
    'neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1',
    'neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0',
    'neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1',
    'neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_0',
    'neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_1',
    'neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_0',
    'neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_1',
    'neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0',
    'neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1',
    'neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0',
    'neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1'
];

export default function VideoRanking({ next }) {

    const player = usePlayer();

    const videoReactions = player.get('videoReactions');
    const randomizedVideos = player.get('randomizedVideos');
    const randomizedDisplayLR = player.get('randomizedDisplayLR');
    const recognizedPeople = player.get('recognizedPeople') || [];
    const surveyStep = player.get('surveyStep') || 1;
    const btnTxt = surveyStep == 1 ? 'Next' : 'Finish Study';

    const mostLikedPersonID = player.get('mostLikedPersonID') || false;
    const mostDislikedPersonID = player.get('mostDislikedPersonID') || false;

    let mostLikedPerson = null;
    let mostDislikedPerson = null;

    let maxStats = -101;
    let minStats = 101;
    let maxLike = 0;
    let maxDislike = 0;
    let minLike = 0;
    let minDislike = 0;

    let maxVideos = [];
    let minVideos = [];

    let maxIdx = 0;
    let minIdx = 0;

    window.nlpServer.onmessage = (msg) => {

        const data = JSON.parse(msg.data);
    
        if (data.distance) {
          player.set('vectorDistances', [...vectorDistances, data.distance]);
        }
    };
    
    if (!mostLikedPersonID) {
        for (const video of videoReactions) {

            const leftStats  = video.leftLikeAmt - video.leftDislikeAmt;
            const rightStats = video.rightLikeAmt - video.rightDislikeAmt;
            let currentPerson = null;

            if (leftStats >= maxStats) {
                currentPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + randomizedDisplayLR[video.videoIdx];
            
                if (leftStats == maxStats) {
                    maxVideos.push(currentPerson);
                } else {
                    maxVideos = [currentPerson];
                }

                maxStats = leftStats;
            }
            if (rightStats >= maxStats) {
                currentPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + (1 - randomizedDisplayLR[video.videoIdx]);
                
                if (rightStats == maxStats) {
                    maxVideos.push(currentPerson);
                } else {
                    maxVideos = [currentPerson];
                }

                maxStats = rightStats;
            }

            if (leftStats <= minStats) {
                currentPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + randomizedDisplayLR[video.videoIdx];
                
                if (leftStats == minStats) {
                    minVideos.push(currentPerson);
                } else {
                    minVideos = [currentPerson];
                }

                minStats = leftStats;
            }
            if (rightStats <= minStats) {
                currentPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + (1 - randomizedDisplayLR[video.videoIdx]);
                
                if (rightStats == minStats) {
                    minVideos.push(currentPerson);
                } else {
                    minVideos = [currentPerson];
                }

                minStats = rightStats;
            }
        }

        maxIdx = Math.floor(Math.random() * maxVideos.length);
        minIdx = Math.floor(Math.random() * minVideos.length);
    }

    let calcMostLikedPersonID = mostLikedPersonID ? mostLikedPersonID : maxVideos[maxIdx];
    let calcMostDislikedPersonID = mostDislikedPersonID ? mostDislikedPersonID : minVideos[minIdx];

    for (const video of videoReactions) {
        let leftDisplayedPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + randomizedDisplayLR[video.videoIdx];
        let rightDisplayedPerson = randomizedVideos[video.videoIdx].slice(0, -4) + '_' + (1 - randomizedDisplayLR[video.videoIdx]);

        if (leftDisplayedPerson == calcMostLikedPersonID) {
            maxLike = Math.min(video.leftLikeAmt, 100);
            maxDislike = Math.min(video.leftDislikeAmt, 100);
        }
        if (leftDisplayedPerson == calcMostDislikedPersonID) {
            minLike = Math.min(video.leftLikeAmt, 100);
            minDislike = Math.min(video.leftDislikeAmt, 100);
        }
        if (rightDisplayedPerson == calcMostLikedPersonID) {
            maxLike = Math.min(video.rightLikeAmt, 100);
            maxDislike = Math.min(video.rightDislikeAmt, 100);
        }
        if (rightDisplayedPerson == calcMostDislikedPersonID) {
            minLike = Math.min(video.rightLikeAmt, 100);
            minDislike = Math.min(video.rightDislikeAmt, 100);
        }
    }    

    if (!mostLikedPersonID) {
        player.set('mostLikedPersonID', calcMostLikedPersonID);
        player.set('mostDislikedPersonID', calcMostDislikedPersonID);
    }

    for (const pair of stillMap) {
        if (pair[0] == calcMostLikedPersonID) mostLikedPerson = pair[1];
        if (pair[0] == calcMostDislikedPersonID) mostDislikedPerson = pair[1];
    }
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

    const leftoverIndices = player.get('leftoverIndices');
    const randomizedSeenIndices = player.get('randomizedSeenIndices');
    const correctlyRecognized = [];

    useEffect(() => {
        wsSend(JSON.stringify({command: 'getLastVectorDistance'}));
    }, []);

    useEffect(() => {
        for (const idx of recognizedPeople) {
            if (randomizedSeenIndices.indexOf(idx) != -1) {
                // correctPerson = stillMap[randomizedSeenIndices[i]][1]
                // correctlyRecognized.push()
            }
        }
    }, [recognizedPeople]);
    //   player.set('randomizedSeenIndices', [0,1,2,3,4,5,6,7,8,9,10,11]);
    let leftoverIdx = 0;
    let seenIdx = 0;

    // Loop through people
    const stills = new Array(48);
    for (let i = 0; i < 48; i++) {
        // Place person in index depending on if they've been watched
        const person = stillMapTxt[i];
        const video = person.slice(0, -2) + '.mp4';
        if (randomizedVideos.indexOf(video) != -1) {
            // Get index that this person should be
            // Watched
            const personIdx = randomizedSeenIndices[seenIdx++];
            stills[personIdx] = stillMap[i][1];
        } else {
            // Not watched
            // Get index that this person should be
            const personIdx = leftoverIndices[leftoverIdx++];
            if (personIdx < 36) {
                stills[personIdx] = stillMap[i][1];
            }
        }
    }

    const handleNext = () => {

        if (surveyStep == 2) {
            wsSend(JSON.stringify({'command': 'stopRecording'}));
            player.set('surveyAnswers', {
                'likedPersonalReason': likedPersonal,
                'likedGeneralReason': likedGeneral,
                'likedAppearance': likedAppearanceChange,
                'likedInteractionStyle': likedStyleChange,
                'dislikedPersonalReason': dislikedPersonal,
                'dislikedGeneralReason': dislikedGeneral,
                'dislikedAppearance': dislikedAppearanceChange,
                'dislikedInteractionStyle': dislikedStyleChange
            });
            player.set('studyStep', 'end');
            return;
        }
        player.set('surveyStep', surveyStep + 1);
        document.querySelectorAll('div').forEach((el) => el.scrollTop = 0);
    };

    const handleRecognized = (el, num) => {
        const recallList = [...recognizedPeople];
        if (el.classList.contains('checked')) {
            player.set('recognizedPeople', [...recallList, num]);
        } else {
            const idx = recallList.indexOf(num);
            recallList.splice(idx, 1);
            player.set('recognizedPeople', recallList);
        }
    };

    let stepUI = <>
        <Stack width='100vw'>
            <Typography level="title-lg" sx={{ fontSize: '2.5em' }}>Reflection Survey</Typography>
            <Typography level="body-md">Thank you for watching these videos. Please complete this short survey before submitting the study (1/2).</Typography>
            <Typography level="title-lg" sx={{ fontSize: '2em', pt: 6 }}>1)&emsp;Which of these individuals do you remember?</Typography>
            <Typography level="body-md" sx={{ pt: 0 }}><span style={{ fontSize: '2em', opacity: 0 }}>1) &emsp;</span>Please select all of the individuals you remember watching in the previous step of the study.</Typography>
        </Stack>

        <FormControl sx={{ width: '100%' }}>
            <RadioGroup
                overlay
                name="member"
                defaultValue="person1"
                orientation="horizontal"
                sx={{
                    display: 'grid',
                    width: '100%',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 2
                }}
            >
                {[...Array(36).keys()].map((num) => (
                    <Sheet
                        component="label"
                        key={num}
                        variant="outlined"
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: 'sm',
                            borderRadius: 'md',
                            gap: 2
                        }}
                    >

                        <Avatar alt={`Person${num}`} src={stills[num]} className='recallAvatar' />
                        <Checkbox label={`person${num}`} variant="soft" overlay onChange={(ev) => { ev.target.closest('.MuiSheet-root').classList.toggle('checked'); handleRecognized(ev.target.closest('.MuiSheet-root'), num); }} />
                    </Sheet>
                ))}
            </RadioGroup>
        </FormControl>
    </>;

    const [likedPersonal, setLikedPersonalChange] = useState('');
    const [likedGeneral, setLikedGeneralChange] = useState('');
    const [dislikedPersonal, setDislikedPersonalChange] = useState('');
    const [dislikedGeneral, setDislikedGeneralChange] = useState('');

    const [likedAppearanceChange, setLikedAppearanceChange] = useState();
    const [likedStyleChange, setLikedStyleChange] = useState();
    const [dislikedAppearanceChange, setDislikedAppearanceChange] = useState();
    const [dislikedStyleChange, setDislikedStyleChange] = useState();

    const handleLikedAppearanceChange = (e) => setLikedAppearanceChange(e.target.value);
    const handleLikedStyleChange = (e) => setLikedStyleChange(e.target.value);
    const handleDislikedAppearanceChange = (e) => setDislikedAppearanceChange(e.target.value);
    const handleDislikedStyleChange = (e) => setDislikedStyleChange(e.target.value);

    const handleLikedPersonalChange = (e) => setLikedPersonalChange(e.target.value);
    const handleLikedGeneralChange = (e) => setLikedGeneralChange(e.target.value);
    const handleDislikedPersonalChange = (e) => setDislikedPersonalChange(e.target.value);
    const handleDislikedGeneralChange = (e) => setDislikedGeneralChange(e.target.value);

    if (surveyStep == 2) {
        stepUI = <>
            <Stack width='100%'>
                <Typography level="title-lg" sx={{ fontSize: '2.5em' }}>Reflection Survey</Typography>
                <Typography level="body-md">Thank you for watching these videos. Please complete this short survey before submitting the study (2/2).</Typography>
                <Typography level="title-lg" sx={{ fontSize: '2em', pt: 6 }}>2)&emsp;Review your ratings</Typography>
                <Typography level="body-md" sx={{ ml: 8.4 }}>Please describe how you rated your top and bottom choices.</Typography>
            </Stack>
            <Stack direction={'row'} sx={{ width: '100%', mb: '-3em' }}>
                <div className='likeLine'></div>
                <Typography level="title-lg" className='likedHeader'>Most-liked individual</Typography>
            </Stack>
            <Stack sx={{ width: '100%', flex: 1, gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }} direction={'row'}>
                {/* <Typography level="title-lg" sx={{fontSize: '2em'}}>You</Typography> */}
                <Card variant="outlined" className='reviewCard' sx={{ width: '15em' }}>
                    <CardContent>
                        <Avatar src={mostLikedPerson} />
                        <Stack className='horizontalRatings'>
                            <div className='singleBar'><ThumbUpAlt /><LinearProgress determinate={true} value={maxLike} className='likeLinear' /><span>+{maxLike.toFixed(0)}%</span></div>
                            <div className='singleBar'><ThumbDownAlt /><LinearProgress determinate={true} value={maxDislike} className='dislikeLinear' /><span></span></div>
                        </Stack>
                    </CardContent>
                </Card>
                <Stack width='calc(100% - 16em);' gap={4} sx={{ position: 'relative' }}>
                    <FormControl >
                        <FormLabel>How did you feel while watching this individual?</FormLabel>
                        <Textarea minRows={4} value={likedPersonal} onChange={handleLikedPersonalChange} placeholder="Type answer here" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>In general, what gave you a positive impression of the individuals you saw?</FormLabel>
                        <Textarea minRows={4} value={likedGeneral} onChange={handleLikedGeneralChange} placeholder="Type answer here" />
                    </FormControl>
                    <FormControl >
                        <FormLabel>How did <span style={{textDecoration: 'underline', padding: '0 0.1em'}}>appearance</span> affect your judgment of the individuals you liked?</FormLabel>
                        <LikertQuestion name='likedAppearance' prompt='' onChange={handleLikedAppearanceChange} value={likedAppearanceChange} type='strength' />
                    </FormControl>
                    <FormControl >
                        <FormLabel>How did <span style={{textDecoration: 'underline', padding: '0 0.1em'}}>interaction style</span> affect your judgment of the individuals you liked?</FormLabel>
                        <LikertQuestion name='likedStyle' prompt='' onChange={handleLikedStyleChange} value={likedStyleChange} type='strength' />
                    </FormControl>
                </Stack>
                <Stack direction={'row'} sx={{ width: '100%', mb: '-1em', mt: '2em'}}>
                    <div className='likeLine'></div>
                    <Typography level="title-lg" className='likedHeader disliked'>Most-disliked individual</Typography>
                </Stack>

                <Card variant="outlined" className='reviewCard' sx={{ width: '15em' }}>
                    <CardContent>
                        <Avatar alt="" src={mostDislikedPerson} />
                        <Stack className='horizontalRatings'>
                            <div className='singleBar'><ThumbUpAlt /><LinearProgress determinate={true} value={minLike} className='likeLinear' /><span></span></div>
                            <div className='singleBar'><ThumbDownAlt /><LinearProgress determinate={true} value={minDislike} className='dislikeLinear' /><span>-{minDislike.toFixed(0)}%</span></div>
                        </Stack>
                    </CardContent>
                </Card>
                <Stack width='calc(100% - 16em);' gap={4} sx={{ position: 'relative' }}>
                    <FormControl >
                        <FormLabel>How did you feel watching this individual?</FormLabel>
                        <Textarea minRows={4} value={dislikedPersonal} onChange={handleDislikedPersonalChange} placeholder="Type answer here" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>In general, what gave you a negative impression of the individuals you saw?</FormLabel>
                        <Textarea minRows={4} value={dislikedGeneral} onChange={handleDislikedGeneralChange} placeholder="Type answer here" />
                    </FormControl>
                    <FormControl >
                        <FormLabel>How did <span style={{textDecoration: 'underline', padding: '0 0.1em'}}>appearance</span> affect your judgment of the individuals you disliked?</FormLabel>
                        <LikertQuestion name='dislikedAppearance' prompt='' onChange={handleDislikedAppearanceChange} value={dislikedAppearanceChange} type='strength' />
                    </FormControl>
                    <FormControl >
                        <FormLabel>How did <span style={{textDecoration: 'underline', padding: '0 0.1em'}}>interaction style</span> affect your judgment of the individuals you disliked?</FormLabel>
                        <LikertQuestion name='dislikedStyle' prompt='' onChange={handleDislikedStyleChange} value={dislikedStyleChange} type='strength' />
                    </FormControl>
                </Stack>
            </Stack>
        </>;
    }

    // UI
    return (
        <Stack width="100vw" sx={{ pt: 10, flexWrap: 'wrap', maxWidth: '60em', mx: 'auto', boxSizing: 'border-box' }} direction={'row'} justifyContent={'center'} gap={6} className='rankings'>
            {stepUI}
            <Stack width='100vw'>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
                    <Button sx={{ my: 2, mr: 1 }} onClick={handleNext} disabled={nextButtonDisabled}>{btnTxt}</Button>
                </Box>
            </Stack>
        </Stack >
    );
}