#!/bin/bash
tput sc
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")/../" ; pwd -P )
cd "$parent_path"

# Load dotenv
export $(cat .env | xargs)

empirica bundle

echo $SERVER_SSH;
echo $SERVER_PATH;

sftp -b - -i deployment/server.pem $SERVER_SSH <<EOF
	put -r "$parent_path/$EXPERIMENT_NAME.tar.zst" "$SERVER_PATH"
    put "$parent_path/start.sh" "$SERVER_PATH/start.sh"
	put "$parent_path/.env_prod" "$SERVER_PATH/.env"
	exit
EOF

tput rc
tput el
echo "Done deploying the experiment!";