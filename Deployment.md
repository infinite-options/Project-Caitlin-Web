1. `Login to Google Cloud`
2. `Login with iodevcalendar@gmail.com`
3. `Select the project from the top dropdown`
4. `Navigate to the instance`
5. `SSH to the instance`
6. `sudo su`
7. `cd /home/Project-Caitlin-Web/`
8. `git pull`

If the server is running `npm run dev` before the `pull`, the changes will be automatically deployed.

## Stop the server
1. `sudo netstat -tulpn | grep :80` // Find the process id running on 80, should be the right most column
2. `sudo kill -9 {pid}`

## Start the server in Development mode(allows auto build but may fail because of memory leak)
1. `cd server`
2. `nohup npm run dev &`

## Start the server in Production mode(preferable)
1. `cd server`
2. `npm run build`
3. `nohup npm run start &`
