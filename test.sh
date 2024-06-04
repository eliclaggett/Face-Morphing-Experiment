#!/bin/bash
set -a            
source .env
set +a

# Remove Empirica cache
rm .empirica/local/tajriba.json

# Run Empirica
emp -s ":${PORT_EMPIRICA}" --server.proxyaddr "http://127.0.0.1:${PORT_EMPIRICA_PROXY}" -a ":${PORT_TAJRIBA}"