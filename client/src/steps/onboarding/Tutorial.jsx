/*
 * Filename: Tutorial.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is the main tutorial of the experimental procedure.
 */
import * as React from 'react';
import { Alert, Button, Box, Container, FormControl, FormLabel, List, ListItem, ListItemDecorator, ListItemContent, Typography, Stack, Sheet, Radio, RadioGroup } from '@mui/joy';
import WarningIcon from '@mui/icons-material/Warning';
import { usePlayer } from "@empirica/core/player/classic/react";
import { useState, useEffect } from 'react';
import { formatMoney } from '../../utils/formatting';
import { Done, Warning } from '@mui/icons-material';
import LikeButton from '../../components/LikeButton.jsx';
import DislikeButton from '../../components/DislikeButton.jsx';

export default function Tutorial({ next }) {

    const player = usePlayer();
    const gameParams = player.get('gameParams');
    if (!gameParams) window.location.reload();
    const correctAnswers = [1, 2, 2, 3];
    const totalBasePay = gameParams.task1Pay + gameParams.task2Pay;
    const [step, setStep] = useState(4);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [backButtonDisabled, setBackButtonDisabled] = useState(true);
    const [errorDisplay, setErrorDisplay] = useState('none');
    const [q4SuccessDisplay, setQ4SuccessDisplay] = useState('none');
    const [backNextDisplay, setBackNextDisplay] = useState('flex');
    const [lowBonusExplanation, setLowBonusExplanation] = useState('');
    const exampleShareAmt = 1;
    const [likeAmt, setLikeAmt] = useState(0);
    const [dislikeAmt, setDislikeAmt] = useState(0);
    const [btnTxt, setButtonText] = useState('Next');
    const [alertDisplay, setAlertDisplay] = useState('hidden');

    function shuffleArray(array) {
        // Citation: https://stackoverflow.com/questions/2450954
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const q2Answers = [
        [1, "Tracking where your eyes are focused"],
        [2, "Understanding your reactions to different individuals interacting in online video calls"],
        [3, "Comparing your reactions to those of others"]
    ];
    const q3Answers = [
        [1, "No"],
        [2, "Yes"]
    ];

    const q4Answers = [
        [1, 'Provide a numeric rating of each individual'],
        [2, 'Provide a qualitative rating of each individual'],
        [3, 'Like, dislike, or skip rating each individual'], // Correct
        [4, 'Only rating how much you like or dislike each individual']
    ];

    const [q2RadioButtons, setQ2RadioButtons] = useState([]);
    const [q3RadioButtons, setQ3RadioButtons] = useState([]);
    const [q4RadioButtons, setQ4RadioButtons] = useState([]);
    
    useEffect(() => {
        const tmpQ2RadioButtons = [];
        const tmpQ3RadioButtons = [];
        const tmpQ4RadioButtons = [];

        shuffleArray(q2Answers);
        for (const q of q2Answers) {
            tmpQ2RadioButtons.push(<Radio value={q[0]} label={q[1]} variant="outlined" key={"q2-"+q[0]}/>);
        }

        shuffleArray(q3Answers);
        for (const q of q3Answers) {
            tmpQ3RadioButtons.push(<Radio value={q[0]} label={q[1]} key={"q3-"+q[0]} variant="outlined" />);
        }  
        
        shuffleArray(q4Answers);
        for (const q of q4Answers) {
            tmpQ4RadioButtons.push(<Radio value={q[0]} label={q[1]} key={"q4-"+q[0]} variant="outlined" />);
        } 
        setQ2RadioButtons(tmpQ2RadioButtons);
        setQ3RadioButtons(tmpQ3RadioButtons);
        setQ4RadioButtons(tmpQ4RadioButtons);
    }, []);
    

    // Logic to handle interactions with this page
    const [radioButtonVals, setRadioButtonVals] = useState();

    const handleRadioButtonChange = (evt) => {
        setRadioButtonVals(radioButtonVals => ({
            ...radioButtonVals,
            [evt.target.name]: evt.target.value
        }));

        if (evt.target.value == correctAnswers[step-1]) {
            
            if (step == 4) {
                setQ4SuccessDisplay('');
            }
            setErrorDisplay('none');
            setNextButtonDisabled(false);
        } else {
            setErrorDisplay('');
            if (step == 4) {
                setQ4SuccessDisplay('none');
            }
            setNextButtonDisabled(true);
        }
    }

    function handleBack() {
        if (step > 1) { setStep(step-1); }
        if (step == 2) { setBackButtonDisabled(true); }


    }
    function handleWhy() {
        setLowBonusExplanation(<>
            <br/>
            <p>Remember, your default bonus is {formatMoney(gameParams.bonus)}.
            If you share {formatMoney(gameParams.maxBonusShare)} and your partner shares {formatMoney(0)}, your final bonus will decrease to {formatMoney(gameParams.bonus-gameParams.maxBonusShare)}.</p>
            <br/>
            <p>Choosing to share is a risk.</p>
        </>);
    }

    useEffect(() => {

        if (likeAmt > 90 || dislikeAmt > 90) {
            setButtonText('Continue');
            setAlertDisplay('');
            setErrorDisplay('hidden');
        } else {
            setButtonText('Next');
            setAlertDisplay('hidden');
            setErrorDisplay('');
        }

    }, [likeAmt, dislikeAmt]);

    function handleNext() {
        if (radioButtonVals && radioButtonVals['q'+(step+1)] == correctAnswers[step]) {
            setNextButtonDisabled(false);
        } else {
            setNextButtonDisabled(true);
        }

        if (step == 5) {
            if (likeAmt > 90 || dislikeAmt > 90) {
                player.set('passedTutorial', true);
                next();
            }
        } else {
            if (step == 4) { setQ4SuccessDisplay('none'); }

            setStep(step+1);
            setBackButtonDisabled(false);
        }
    }

    // Logic to move to next step or stop the experiment
    const passedTutorial = player.get('passedTutorial');
    if (passedTutorial === true) {
        next();
    }

    function setHolding(name, val) {

        // let el = null;
        // if (name == 'leftLike') { el = document.querySelectorAll('.like')[0]}
        // else if (name == 'rightLike') { el = document.querySelectorAll('.like')[1]}
        // else if (name == 'leftDislike') { el = document.querySelectorAll('.dislike')[0]}
        // else if (name == 'rightDislike') { el = document.querySelectorAll('.dislike')[1]}
        if (val == -1) {
        //   el.classList.remove('animated');
        //   el.style.setProperty('--LinearProgress-progressThickness', '0%');
        //   requestAnimationFrame(() => {
        //     el.classList.add('animated');
        //     el.style.setProperty('--LinearProgress-progressThickness', '100%');
        //   });
          
          // document.querySelectorAll('.like')[1].classList.remove('animated');
        } else {
          const newVal = Math.min(val / 3000 * 100, 100);
          if (name == 'like') { setLikeAmt(newVal)}
          else if (name == 'dislike') { setDislikeAmt(newVal)}
        }
      }

    // Step 1
    let tutorialStepUI = <Stack gap={1}>
                        <Typography level="h2" textAlign="center">
                            Tutorial
                        </Typography>
                        <p>
                            As you read through this short tutorial, please answer comprehension
                            questions that look like this:
                        </p>
                        <FormControl>
                            <FormLabel>Do you need to answer comprehension questions about this tutorial?</FormLabel>
                            <RadioGroup name="q1" onChange={handleRadioButtonChange} defaultValue="1">
                                <Radio value="1" label="Yes" variant="outlined" />
                                <Radio value="2" label="No" variant="outlined" />
                            </RadioGroup>
                        </FormControl>
                        <p>
                            We only use these questions to ensure you understand the study details.
                        </p>
                    </Stack>;
    if (step == 2) {
        tutorialStepUI = <Stack gap={1}>
                            {/* <img src='/images/tutorial_study_desc.svg'/> */}
                            <Typography level="h2" textAlign="center">
                                Study Description
                            </Typography>

                            <Typography level="h3" sx={{pt: 4}}>
                                Goal
                            </Typography>
                            <Typography level="body-md">
                                In this study, we are measuring how you like the conversations in self-introduction videos.

                            </Typography>
                            <Typography level="h3" sx={{pt: 4}}>
                                Steps
                            </Typography>
                            <Typography>
                                This study has three parts.
                                You have a fixed amount of time to complete each part.
                                Please complete all tasks displayed at the top of the page within the allotted time.
                            </Typography>
                            <Typography level="h4" sx={{pt: 2}}>1)&emsp;&emsp;Calibrate focus-tracking system</Typography>
                            <Typography level="body-md">
                                First, we will ask you to calibrate our focus tracking system. We will use this system to record data on which individuals attract more of your attention.
                            </Typography>
                            <Typography level="h4" sx={{pt: 2}}>2)&emsp;&emsp;React to video individuals</Typography>
                            <Typography level="body-md">
                            Next, we will present a series of {gameParams.numVideos} short recordings of online video calls. After you watch each one, you will provide feedback about your affinity toward each individual.
                            </Typography>
                            <Typography level="h4" sx={{pt: 2}}>3)&emsp;&emsp;Compare your reactions to others</Typography>
                            <Typography level="body-md">
                            Finally, we will show you the reactions of other participants and ask you to describe your ratings and compare them to the others. This is the last step of the study.
                            </Typography>
                            
                            <FormControl sx={{pt: 4}}>
                                <FormLabel>What is the main focus of this study?</FormLabel>
                                <RadioGroup name="q2" onChange={handleRadioButtonChange} defaultValue=''>
                                    {q2RadioButtons}
                                </RadioGroup>
                            </FormControl>
                        </Stack>;
    } else if (step == 3) {
        tutorialStepUI = <Stack gap={1}>
                            <img src='/images/tutorial_focus_tracking.svg' />
                            <Typography level="h2" textAlign="center">Focus-tracking calibration</Typography>
                            <Typography level="body-md">

                                We will record how much attention you pay to the individuals in each video call by tracking your eye movements.
                                This data will be recorded according to the following policy:
                                <ul style={{ listStyle: 'disc', margin: '0.5em 0', padding: '0 1.5em'}}>
                                    <li>Video recordings of your webcam during your participation in the study will be kept on a secure encrypted server for a maximum of 24 hours</li>
                                    <li>Eye movement data will be extracted from these videos and stored on a secure encrypted server</li>
                                </ul>

                            </Typography>

                            <Typography level="body-md">
                                Raw video data will be deleted immediately after we extract eye movement data.
                            </Typography>
                            <FormControl>
                                <FormLabel>My attention will be tracked while I watch videos in this study</FormLabel>
                                <RadioGroup name="q3" onChange={handleRadioButtonChange} defaultValue=''>
                                    {q3RadioButtons}
                                </RadioGroup>
                            </FormControl>
                        </Stack>;
    } else if (step == 4) {
        tutorialStepUI = <Stack gap={1}>
                            <img src="/images/tutorial_video_watching.svg" />
                            <Typography level="h2" textAlign="center">Reaction to videos</Typography>
                            <Typography level="body-md">
                                Next, you will watch {gameParams.numVideos} recordings of paired video calls.
                                After watching each reaction, you have the following options to provide feedback about the individuals in the recording:
                            </Typography>
                            <Typography level="title-md">Like Reaction</Typography>
                            <Typography level="body-md">
                                You can rate how much you like each individual.
                            </Typography>
                            <Typography level="title-md">Dislike Reaction</Typography>
                            <Typography level="body-md">
                                You can rate how much you dislike each individual.
                            </Typography>
                            <Typography level="title-md">Skip to Next Video</Typography>
                            <Typography level="body-md">
                                You can skip to the next video.
                            </Typography>
                            
                            <FormControl sx={{pt: 2}}>
                                <FormLabel>What are your options after watching each recording?</FormLabel>
                                <RadioGroup name="q4" onChange={handleRadioButtonChange} defaultValue=''>
                                    {q4RadioButtons}
                                </RadioGroup>
                            </FormControl>
                        </Stack>;
    } else if (step == 5) {
        tutorialStepUI = <Stack gap={1}>
                            <img src="/images/tutorial_video_watching.svg" />
                            <Typography level="h2" textAlign="center">Reaction to videos</Typography>
                            <Typography level="body-md">
                                Here is a sample of the "Like" and "Dislike" buttons. The longer you hold them, the stronger the reaction.
                                <b style={{color: 'white'}}> Test out holding one of the buttons below until it shines.</b>
                            </Typography>
                            <Stack direction={'row'} justifyContent={'center'} gap={4} sx={{py:4}}>
                                <LikeButton setHolding={setHolding} name='like'/>
                                <DislikeButton setHolding={setHolding} name='dislike'/>
                            </Stack>
                            
                            <Alert
                                startDecorator={<Done />}
                                variant="outlined"
                                color="success"
                                className={alertDisplay}
                            >
                                Good job! That's how you provide the strongest rating to an individual. Now, we can continue to the study.
                        </Alert>
                        <Alert
                                startDecorator={<WarningIcon />}
                                variant="outlined"
                                color="danger"
                                className={errorDisplay}
                            >
                                Please try holding longer until the button is fully colored.
                        </Alert>
                        </Stack>;
    }

    // UI
    return (
        <Container maxWidth="100vw" className="tutorial_container">
            {/* <ProgressList items={[
                {name: 'Tutorial', time: '~3 min'},
                // {name: 'Practice Session', time: '~5 min'},
                {name: 'Questionnaire', time: '~1 min'},
                ]} active={0} /> */}


            <Stack sx={{
                maxWidth: {
                    sm: '80vw',
                    md: '40rem',
                    lg: '40rem',
                },
                mx: 'auto',
                mt: '10vh',
                mb: '2rem',
                py: 2
            }} gap={1} >
                {/* <img src="images/"/> */}
                {tutorialStepUI}
                <Alert
                        startDecorator={<WarningIcon />}
                        variant="outlined"
                        color="danger"
                        sx={{ display: errorDisplay }}
                    >
                        Oops, that's not right. Please try again.
                </Alert>
                <Alert
                        startDecorator={<Done />}
                        variant="outlined"
                        color="success"
                        sx={{ display: q4SuccessDisplay }}
                    >
                        Exactly! You have three options after each video. However, please provide as much feedback about your affinity toward different individuals as possible.
                </Alert>
                <Box sx={{ display: backNextDisplay, justifyContent: 'center', width: '100%', flexDirection: 'row'}}>
                    <Button sx={{ my: 2, mr:1 }} onClick={handleBack} disabled={backButtonDisabled}>Back</Button>
                    <Button sx={{ my: 2, mr:1 }} onClick={handleNext} disabled={nextButtonDisabled}>{btnTxt}</Button>
                </Box>
            </Stack>
        </Container>
    );
}