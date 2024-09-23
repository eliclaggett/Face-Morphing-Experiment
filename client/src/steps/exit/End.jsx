/*
 * Filename: End.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays the normal ending screen for the experiment.
 */
import * as React from 'react';
import { Button, Box, Container, List, ListItem, Typography, Sheet, Stack, FormControl, FormLabel, FormHelperText, Radio, RadioGroup, Table, Textarea, Modal, ModalClose } from '@mui/joy';
import { useState } from 'react';
import { usePlayer, useGame, useStageTimer } from "@empirica/core/player/classic/react";
import { formatMoney, msToTime } from '../../utils/formatting.js';

export default function End({next}) {

    const player = usePlayer();
    const gameParams = player.get('gameParams');
    const completionCode = player.get('completionCode');
    const endReason = player.get('endReason') || '';
    const game = useGame();
    const stageTimer = useStageTimer(); 
    const [feedback, setFeedback] = useState('');
    const [open, setOpen] = useState(false);
    const [feedbackBtnClass, setFeedbackBtnClass] = useState('');
    const [feedbackTxt, setFeedbackTxt] = useState('Send Feedback');

    function handleButtonClick(evt) {
        player.set('feedback', feedback);
        setFeedbackBtnClass('success');
        setFeedbackTxt('Feedback received! Thank you so much!');
    }

    return (
        <Container maxWidth="100vw">
            <Stack sx={{
                maxWidth: {
                    md: '30rem',
                    sm: '80%'
                },
                mx: 'auto',
                mt: '10rem',
            }} gap={2} >
                <Typography level="h2" textAlign="center">
                Thank you for participating!
                </Typography>

                <Stack alignItems={'center'}>
                <Typography level="body-md" sx={{pb: 2}}>You may now close this window.</Typography>
                <Typography level="body-md" sx={{pb: 2}}>You may now close this window. Your total pay for this study is:</Typography>
                <Typography level="h2" sx={{pb: 2}}>{formatMoney(gameParams.studyPay)}</Typography>

                <Typography level="body-md" sx={{pb: 2}}>Please use this completion code for your submission:</Typography>

                <Typography level="h2" sx={{pb: 2}}>{gameParams.completionCode}</Typography>
                </Stack> 
                <Typography level="body-md" sx={{pb: 2}}>
                If you have extra time, please tell us about your experience participating in the study and list any feedback here, too.
                </Typography>
                <FormControl>
                    <Textarea placeholder="Type your feedback here..." minRows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)}></Textarea>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'row'}}>
                    <Button sx={{ my: 2 }} onClick={handleButtonClick} className={feedbackBtnClass}>{feedbackTxt}</Button>
                </Box>
            </Stack>
        </Container>
        );
    }