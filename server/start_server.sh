kill -9 $(sudo netstat -anp | awk '/ LISTEN / {if($4 ~ ":80$") { gsub("/.*","",$7); print $7; exit } }');npm run dev &
