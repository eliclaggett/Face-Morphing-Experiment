# Measuring the Impact of Face Morphing on Social Outcomes

Platform for running social experiments that measure participants' affinity and attention toward strangers in a video call scenario. The strangers' faces are morphed to varying degrees, concealing their identity and altering facial characteristics while preserving their original facial expressions.

The provided code is a companion to ongoing research conducted with Sony Computer Science Laboratories. Significant portions of code have been redacted as per company policy.

### Prerequisites

- Python
- Empirica (empirica.ly)
- TouchDesigner v2023.11340

### Installation

Make sure to install the NPM packages in the client and server directories before running the experiment for the first time.

e.g.)

```sh
cd client && npm i
```

```sh
cd server && npm i
```

### Running

Start the experimental system by running the following script in a \*nix terminal:

```sh
./test.sh
```

## Authors

Eli Claggett
[@eliclaggett](https://github.com/eliclaggett)