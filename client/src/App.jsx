import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React, { useEffect } from "react";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Game } from "./Game";

// Custom theme
const theme = extendTheme({
  fontFamily: {
    display: 'Poppins', // applies to `h1`–`h4`
    body: 'Poppins', // applies to `title-*` and `body-*`
    // display: 'Helvetica Neue',
    // body: 'Helvetica Neue'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#C0CCD9',
          100: '#A5B8CF',
          200: '#6A96CA',
          300: '#4886D0',
          400: '#4886D0',
          500: '#2F3C4C',
          600: '#2F3C4C',
          700: '#265995',
          800: '#2F4968',
          900: '#2F3C4C',
        },
      },
    },
  },
  typography: {
    'h3': {
      fontSize: '1.15rem',
    },
    'title': {
      fontWeight: '600'
    },
    'body-md': {
      fontSize: '1.5em'
    },
    // 'body-sm': {
    //   fontSize: '1.5em'
    // },
  }
});

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [];
  }

  function exitSteps({ game, player }) {
    return [];
  }

  const connectToNLP = () => {

    if (window.nlpServer && (window.nlpServer.readyState == WebSocket.OPEN || window.nlpServer.readyState == WebSocket.CONNECTING))
      return;

    // The server uses an encrypted connection when not being tested locally
    let nlpServerURL = 'ws://10.13.71.74:9918'

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

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <CssVarsProvider theme={theme} defaultMode="dark" modeStorageKey="joy-mode-scheme-dark" disableTransitionOnChange>
            <CssBaseline />
            <EmpiricaContext introSteps={introSteps} exitSteps={exitSteps}>
              <Game />
            </EmpiricaContext>
          </CssVarsProvider>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
