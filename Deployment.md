1. `Login to Google Cloud`
2. `Navigate to the instance`
3. `SSH to the instance`
4. `cd /home/Project-Caitlin-Web/``
5. `git pull`

If the server is running before the `pull`, the changes will be automatically deployed.

## Restart server through Bash
6. `cd /home/Project-Caitlin-Web/server`
7. `sudo bash ./start_server.sh`

## Manual deployment
6. `cd /home/Project-Caitlin-Web/server`
7. `sudo netstat -tulpn | grep :80` // Find the process running on 80
8. `sudo kill -9 {pid}`
9. `sudo npm run dev &`
