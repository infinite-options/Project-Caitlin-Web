var fs = require('fs')
fs.readFile('client/public/build_number.txt', 'utf8', function(err, data){
    console.log();
    fs.writeFile('client/public/build_number.txt', (parseInt(data)+1).toString(), function(){});
}); 
