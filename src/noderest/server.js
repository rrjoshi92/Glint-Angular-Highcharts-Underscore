var express = require('express')
var cors = require('cors')
var app = express()

app.get('/data', cors(), function(req, res) {
    fs = require('fs')
    var data = fs.readFile('./src/noderest/data.json', 'utf8', function(err, data) {
            if (err) {
                //console.log(err)
                res.send(err);
            }
            //console.log(data)
            data = JSON.parse(data);
            res.send(data);
        })
        //res.send(data);
})

app.listen(3001)
console.log('Listening on port 3001...')