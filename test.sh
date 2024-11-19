#!/bin/bash

################################################################################
# Filename: test.sh
# Author: Elijah Claggett
# Date: January 24, 2024
# Description: Tests an Empirica experiment alongside a Python websocket server
#
# Usage:
#   ./test.sh
#
# Dependencies:
#   - Empirica
#   - Python 3
#   - Pyenv
#   - Pyenv Virtualenv
#
# Notes:
#   Please create a .env file in the same directory as this script with the following variables defined accordingly:
#       - DEPLOYMENT (dev or prod)
#       - PORT_EMPIRICA (e.g. 9600)
#       - PORT_PYTHON (e.g. 9601)
#       - STORE_PATH (full path for the location that tajriba.json should be stored, e.g., /home/ubuntu/{user}/data)
#       - VENV (pyenv virtualenv name)
#
################################################################################

set -a            
source .env
set +a

# Remove Empirica cache
rm .empirica/local/tajriba.json

# Run Empirica
empirica -s ":${PORT_EMPIRICA}" --server.proxyaddr "http://127.0.0.1:${PORT_EMPIRICA_PROXY}" -a ":${PORT_TAJRIBA}"