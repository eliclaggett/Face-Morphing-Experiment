/*
 * Filename: ParticipantJoin.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is reCAPTCHA step of the experiment's onboarding process.
 */

// Imports
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Button,
  FormControl,
  Input,
} from "@mui/joy";

export default function ParticipantJoin({ onPlayerID, connecting }) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const prolificIdFromURL = urlParams.get("PROLIFIC_PID");
  const [playerID, setPlayerID] = useState("");

  useEffect(() => {
    if (prolificIdFromURL) {
      onPlayerID(prolificIdFromURL);
    }
  }, []);

  // Logic to handle interactions with this page
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!playerID || playerID.trim() === "") {
      return;
    }

    onPlayerID(playerID);
  };

  // UI
  return (
    <Container maxWidth="100vw">
      <Stack
        sx={{
          maxWidth: {
            md: "30rem",
          },
          mx: "auto",
          mt: "30vh",
          textAlign: "center",
        }}
        gap={1}
      >
        <Typography level="h1" sx={{ fontSize: "2em" }}>
          Please enter your name
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ width: "20em", margin: "1em auto" }}
        >
          <FormControl>
            <Input
              placeholder="Type name here"
              value={playerID}
              onChange={(e) => setPlayerID(e.target.value)}
              sx={{ padding: "0.75em 1.3em" }}
            />
          </FormControl>
        </form>

        <Button
          color="primary"
          sx={{
            flex: 0,
            width: "10rem",
            mx: "auto",
            mb: "2rem",
          }}
          onClick={handleSubmit}
        >
          Join Study
        </Button>
      </Stack>
    </Container>
  );
}
