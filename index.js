let http = require('http');
let https = require('https');
let fs = require('fs');

let port = 8080;

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: "profi.ua1991@gmail.com",
        pass: "ercswcoljoaabxek"
    }
});

const btcUrlOptions = {
  hostname: "api1.binance.com",
  port: 443,
  path: '/api/v3/ticker/price?symbol=BTCUAH',
  method: 'GET',
};

function returnBtcPrice(resp) {
    const req = https.request(btcUrlOptions, res => {
      res.on('data', d => {
        resp.writeHead(200, { 'Content-Type': 'application/json' });
        resp.write(JSON.parse(d)["price"]);
        resp.end();
      });
    });

    req.on('error', error => {
        console.log(error);
        resp.writeHead(400);
        resp.write('ERROR');
    });

    req.end();
}

function returnRootPage(resp) {
    fs.readFile('index.html', "utf8", function (error, data) {
        if (error) {
            console.log(error);
            resp.writeHead(404);
            resp.write('Contents you are looking are Not Found');
        } else {
            resp.writeHead(200, { 'Content-Type': 'text/html' });
            resp.write(data);
        }

        resp.end();
    });
}

function subscribe(email, resp){
    fs.readFile('./email.txt', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            let arrayEmails = data.toString().split('\n');
            if (arrayEmails.includes(String(email))) {
                resp.writeHead(409);
                resp.write("ERROR")
            } else {
                fs.appendFile('./email.txt', `${email}\n`, function (error) {
                    if (error) {
                    console.log(error);
                    resp.writeHead(400);
                    resp.write('ERROR');
                    } else {
                        resp.writeHead(200, { 'Content-Type': 'text/html' });
                        resp.write("OK");
                    };
                    resp.end(); 
                });
            }
        }
    })
}


function createMail(to, btc) {
    let message = {
         from: "Maksym Melnyk",
         to: to,
         subject: "Курс ВТС зараз",
         text: btc
    };
    return message;
}

function sendEmails(resp) {
    fs.readFile('./email.txt', function (error, data) {
        if (error) {
            resp.writeHead(409);
            resp.writeHead("ERROR")
        } else {
            let arrayEmails = data.toString().split('\n');
            const req = https.request(btcUrlOptions, res => {
                res.on('data', d => {
                    let price = JSON.parse(d)["price"];
                    arrayEmails.forEach((elem) => {
                        transporter.sendMail(createMail(elem, price), function(err, info) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(info);
                            }
                        });
                    })
                });
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write("OK");
            });
            req.on('error', error => {
                console.log(error);
            });
            req.end();
        }
    }) 
};

const server = http.createServer(function (req, resp) {
    if (req.url === "/api/rate.json") {
        returnBtcPrice(resp);
    } else if (req.url === "/") {
        returnRootPage(resp);
    } else if (req.url === "/api/subscribe.json") {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const data = Buffer.concat(chunks);
            let email = JSON.parse(data)["email"];
            subscribe(email, resp);
        })
    } else if (req.url === "/api/sendEmails.json") {
        sendEmails(resp);
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port number: ${port}`);
});