/*
 * Filename: ConsentForm.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file is consent form displayed during the experiment's onboarding process.
 */

// Imports
import * as React from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Stack,
} from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import { usePlayer } from "@empirica/core/player/classic/react";
import { useState } from "react";
import { formatMoney } from "../../utils/formatting";
import recordVideo from "../../assets/record_vid_dark.svg";
import recordMouse from "../../assets/record_mouse_dark.svg";
import recordKeyboard from "../../assets/record_keyboard_dark.svg";

export default function ConsentForm({ next }) {
  const player = usePlayer();
  const gameParams = player.get("gameParams");
  if (!gameParams) window.location.reload();

  // Logic to handle interactions with this page
  const [radioButtonVals, setRadioButtonVals] = useState();

  const handleRadioButtonChange = (evt) => {
    setRadioButtonVals((radioButtonVals) => ({
      ...radioButtonVals,
      [evt.target.name]: evt.target.value,
    }));
  };

  function handleButtonClick() {
    player.set("submitConsentForm", radioButtonVals);
  }

  // Logic to move to next step or stop the experiment
  let nonconsentForm = "";
  const passedConsentForm = player.get("passedConsentForm");

  if (passedConsentForm === false) {
    nonconsentForm = (
      <Alert startDecorator={<WarningIcon />} variant="outlined" color="danger">
        We cannot continue without your consent. Please return the study if
        these terms cannot be met.
      </Alert>
    );
  } else if (passedConsentForm === true) {
    next();
  }

  // UI
  return (
    <Container maxWidth="100vw">
      <Stack
        sx={{
          maxWidth: {
            md: "30rem",
          },
          mx: "auto",
          mt: "10vh",
          py: 2,
        }}
        gap={1}
      >
        <Typography level="h1">Consent Form</Typography>
        <strong>
          Please read the following information and provide consent before
          continuing.{" "}
          <span style={{ color: "white" }}>
            This study uses your webcam. When access is requested, please click
            "Allow".
          </span>
        </strong>
        <Card
          variant="soft"
          sx={{ maxHeight: "30em", overflow: "scroll", p: 4, my: 2 }}
        >
          <Typography level="body-md">
            This is a research study conducted by Sony Computer Science
            Laboratories and is funded by the Japan Science and Technology
            Agency (JST).
          </Typography>
          <Typography level="title-md">Study Description</Typography>
          <Typography level="body-md">
            This study explores how various aspects of social interactions
            impact how people form impressions of each other. This question will
            be investigated through an experiment in which participants watch
            and react to a serious of video calls between two strangers. You
            will complete a short tutorial, calibrate our eye focus-tracking
            system, watch {gameParams.numVideos} videos of social interactions,
            rate your attitude toward the parties involved, and finally answer a
            survey about the content you watched. All steps of this study will
            be completed within this web application. Upon completion of the
            study, you will be provided a completion code to submit to Prolific
            and receive payment.
          </Typography>
          <Typography level="title-md">Time Involvement</Typography>
          <Typography level="body-md">
            The study will take approximately {gameParams.studyLength} to
            complete in total, including reading the tutorial, watching{" "}
            {gameParams.numVideos} videos of social interactions, and answering
            the final survey. The time required to complete the study may be
            shortened by skipping the evaluation of the individuals appearing in
            each video. However, we appreciate receiving as much feedback as you
            can provide.
          </Typography>
          <Typography level="title-md">Data Collection</Typography>
          <Stack className="dataSources" direction="row">
            <img src={recordVideo} />
            <img src={recordMouse} />
            <img src={recordKeyboard} />
          </Stack>
          <Typography level="body-md">
            Webcam video, mouse movement, and survey data are recorded during
            this study. Video data is recorded throughout the entire duration of
            the study after signing this consent form and is automatically
            processed by an algorithm tracking eye focus before being deleted
            within 24 hours. Mouse movements are used to supplement eye tracking
            data. Survey data is statistically analyzed across all participants.
            All data will be deleted 5 years after the study. Sensitive
            information (such as video) is pseudonymously linked to the survey
            responses and only accessible across the core researcher listed
            below in contact information. With participants' additional
            permission, we will privately store a screenshot of the webcam
            footage until data collection for the study is complete. If this
            permission is provided, AI-manipulated versions of the screenshot
            will be shown to future study participants.
          </Typography>
          <Typography level="title-md">Risks and Benefits</Typography>
          <Typography level="body-md">
            The risks associated with participating in this study are similar to
            those incurred by participating in any online video call. Your
            webcam video will be recorded throughout the duration of the study
            before being automatically deleted within the next day. You will
            watch a series of unscripted social interactions between strangers.
            These interactions have been screened in advance to be absent of
            objectionable content.
            <br />
            <br />
            The benefits of participation in this study include monetary
            compensation and a potentially deeper understanding of how
            individual characteristics affect attitudes toward people involved
            in social interactions.
          </Typography>
          <Typography level="title-md">Payment</Typography>
          <Typography level="body-md">
            You will be compensated {formatMoney(gameParams.studyPay)} for your
            time and valuable feedback after completing the study. In the event
            of technical issues or a participant’s voluntary withdrawal and
            discontinuation of the study, you will be compensated{" "}
            {formatMoney(gameParams.partialPay)} for their time.
          </Typography>
          <Typography level="title-md">Participant's Rights</Typography>
          <Typography level="body-md">
            If you have read this form and decided to participate in the study,
            we would appreciate your full involvement or as much as you can
            otherwise provide. You have the right to withdraw your consent or
            discontinue participation at any time without penalty or loss of
            benefits to which you are entitled, even if you initially provided
            consent. You also have the right to refuse to answer particular
            questions of this study’s survey section. If you wish to withdraw
            your consent, please contact the main researcher listed below.
            <br />
            <br />
            The results of this research study may be presented at scientific or
            professional meetings or published in scientific journals. Your
            identity will not be disclosed under any circumstances.
          </Typography>
          <Typography level="title-md">Contact Information</Typography>
          <Typography level="body-md">
            If you have any questions, concerns, or complaints about this
            research, including its procedures, risks, or benefits, please
            message us on Prolific or contact the main researcher:
            <br />
            <br />
            Shunichi Kasahara, PhD, Sony Computer Science Laboratories, Inc.
            <br />
            csl-bec-office<span className="hidden">SPAMPROTECTION</span>@
            <span>csl.sony</span>
            <span className="hidden">SPAMPROTECTION</span>.co.jp
            <span className="hidden">SPAMPROTECTION</span>
          </Typography>
        </Card>
        <FormControl>
          <FormLabel>
            I consent to the recording of the data sources listed above and
            understand that it will be automatically analyzed and deleted.
          </FormLabel>
          <RadioGroup name="q1" onChange={handleRadioButtonChange}>
            <Radio value="yes" label="Yes" variant="outlined" />
            <Radio value="no" label="No" variant="outlined" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>
            I have read and understood the consent form. I understand the
            purpose of this study and agree to participate.
          </FormLabel>
          <RadioGroup name="q2" onChange={handleRadioButtonChange}>
            <Radio value="yes" label="Yes" variant="outlined" />
            <Radio value="no" label="No" variant="outlined" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>
            I understand that I may terminate my participation in this study at
            any time.
          </FormLabel>
          <RadioGroup name="q3" onChange={handleRadioButtonChange}>
            <Radio value="yes" label="Yes" variant="outlined" />
            <Radio value="no" label="No" variant="outlined" />
          </RadioGroup>
        </FormControl>
        {nonconsentForm}
        <Button sx={{ my: 2 }} onClick={handleButtonClick}>
          Continue
        </Button>
      </Stack>
    </Container>
  );
}
