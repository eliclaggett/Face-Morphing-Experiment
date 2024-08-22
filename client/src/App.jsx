import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React, { useEffect } from "react";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Game } from "./Game";
import Recaptcha from "./steps/onboarding/Recaptcha.jsx";
import ConsentForm from "./steps/onboarding/ConsentForm.jsx";
import Tutorial from "./steps/onboarding/Tutorial.jsx";
import End from "./steps/exit/End.jsx";
import CalibrateTracking from "./steps/CalibrateTracking.jsx";
import WatchVideos from "./steps/WatchVideos.jsx";
import VideoRanking from "./steps/VideoRanking.jsx";
import TestStep from "./steps/TestStep.jsx";
import DevStep from "./steps/DevStep.jsx";
import ParticipantJoin from './steps/onboarding/ParticipantJoin.jsx';

// Custom theme
const theme = extendTheme({
  fontFamily: {
    display: 'Poppins', // applies to `h1`–`h4`
    body: 'Poppins', // applies to `title-*` and `body-*`
    // display: 'Helvetica Neue',
    // body: 'Helvetica Neue'
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          // 50: '#C0CCD9',
          // 100: '#A5B8CF',
          // 200: '#6A96CA',
          // 300: '#4886D0',
          // 400: '#4886D0',
          // 500: '#2F3C4C',
          // 600: '#2F3C4C',
          // 700: '#265995',
          // 800: '#2F4968',
          // 900: '#2F3C4C',
          50: 'rgb(0,0,0)',
          100: 'rgb(0,0,0)',
          200: 'rgb(208, 228, 255)', // radio button color
          300: 'rgb(0,0,0)',
          400: '#4886D0',
          500: '#2F4968', // active progress bar color, button color
          600: '#2F3C4C',
          700: '#265995',
          800: '#2F4968',
          900: '#2F3C4C',
          'softBg': 'rgb(11, 38, 57)',
          'softColor': 'rgb(187, 218, 255)'
        },
      },
    },
  },
  typography: {
    'h3': {
      // fontSize: '1.15rem',
    },
    'title': {
      // fontWeight: '600'
    },
    'body-md': {
      // fontSize: '1.5em'
      color: 'rgb(156, 162, 170)'
    },
    'body-sm': {
    //   fontSize: '1.5em'
    color: 'rgb(156, 162, 170)'
    },
  },
  components: {
    JoyFormLabel: {
        styleOverrides: {
          root: {
              fontSize: '1.1rem',
              fontWeight: 600
          }
      }
    }
}
});

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  const connectToNLP = () => {

    if (window.nlpServer && (window.nlpServer.readyState == WebSocket.OPEN || window.nlpServer.readyState == WebSocket.CONNECTING))
      return;

    // The server uses an encrypted connection when not being tested locally
    let nlpServerURL = 'wss://experiment.cybernetichumanity.com:9918'

    // Set server protocol
    window.nlpServer = new WebSocket(nlpServerURL);
    
    // Connect to server
    window.nlpServer.onopen = () => {
      console.log('Connection successfully established with Python server');
      
      // Occassionally ping the server to prevent the connection from closing
      window.nlpInterval = setInterval(() => {
        if (window.nlpServer instanceof WebSocket) {
          window.nlpServer.send('{"command": "ping"}');
        } else {
          clearInterval(window.nlpInterval);
        }
      }, 20 * 1000);
    };
  
    // Automatically reconnect if the connection is lost
    window.nlpServer.onclose = () => {
      // TODO: Uncomment for production
      // TimerMixin.setTimeout(() => {
      //   connectToNLP();
      // }, 1000);
    };

    window.nlpServer.onerror = (ev) => {
      console.log('Failed to connect to Python server');
      // TODO: Uncomment for production
      // TimerMixin.setTimeout(() => {
      //   connectToNLP();
      // }, 1000);
    }
  }

  // Setup connection with backend Python server for ML/NLP
  useEffect(() => {
    connectToNLP();
  }, []);

  function onboardingSteps({ game, player }) {
    return [

      // TODO: PROD Comment test-only steps
      // CalibrateTracking,
      // WatchVideos,
      // VideoRanking,

      // Real steps
      Recaptcha,
      ConsentForm,
      TestStep,
      Tutorial
    ];
  }
  function exitSteps({ game, player }) {
    return [
      End
    ];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <CssVarsProvider theme={theme} defaultMode="dark" modeStorageKey="joy-mode-scheme-dark" disableTransitionOnChange>
            <CssBaseline />
            <EmpiricaContext playerCreate={ParticipantJoin} introSteps={onboardingSteps} exitSteps={exitSteps}>
              <Game />
            </EmpiricaContext>
          </CssVarsProvider>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
