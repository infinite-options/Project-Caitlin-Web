1. `Login to Google Cloud`
2. `Navigate to the instance`
3. `SSH to the instance`
4. `cd /home/Project-Caitlin-Web/server`

## Deployment through Bash
5. `sudo bash ./start_server.sh`

## Manual deployment
5. `sudo netstat -tulpn | grep :80` // Find the process running on 80
6. `sudo kill -9 {pid}`
7. `sudo npm run start &`
