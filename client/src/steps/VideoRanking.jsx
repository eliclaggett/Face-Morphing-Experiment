/*
 * Filename: VideoRanking.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/joy';

export default function VideoRanking({ next }) {

  const serverUrl = 'wss://mi-webrtc-d8h0tk6i.livekit.cloud';
  const [token, setToken] = useState('');
  // const tokenApi = api.livekit.getRoomToken.useMutation();
  const [room, setRoom] = useState('');

    // UI
    return (
        <Stack maxWidth="100vw" sx={{pt: 40}} direction={'row'} justifyContent={'center'} gap={6}>
            
            <Stack>
                Here are the interactions you liked most:
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 1</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 2</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 3</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>

                Here are the interactions you liked least:
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 4</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 5</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 6</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
            </Stack>
            <Stack className='secretContainer'>
                <Typography level='title-lg'>Behind the scenes</Typography>
                Here are the interactions you liked most:
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 1</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 2</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 3</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>

                Here are the interactions you liked least:
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 4</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 5</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                    <Typography level="title-md">Character 6</Typography>
                    <Typography>Description of the card.</Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Stack>
    );
}