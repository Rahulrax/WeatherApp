
const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("./home.html", "utf-8");

const replaceVal = (temVal,orgVal) =>{
    let nowtemp= orgVal.main.temp-273;
    let maxtemp=orgVal.main.temp_max-273;
    let mintemp=orgVal.main.temp_min-273;
    let a1 = nowtemp.toFixed(2);
    let a2 = mintemp.toFixed(2);
    let a3 = maxtemp.toFixed(2);
    // console.log(nowtemp);
    // console.log(mintemp);
    // console.log(maxtemp);
    let temperature = temVal.replace("{%tempval%}",a1);
    temperature = temperature.replace("{%tempmin%}",a2);
    temperature = temperature.replace("{%tempmax%}",a3);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    
    return temperature
}
const server = http.createServer((req,res) => {

    if(req.url =="/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=c8e050e1f9fea90b6d0e9f0684522da0')
        .on('data', (chunk)=> {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            const realTimeData = arrdata.map(val => replaceVal(homeFile,val)).join("");

            //api data liye  realtimedata
          console.log(realTimeData);
            res.write(realTimeData);
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
           res.end();
          console.log('end');
        });

    }
    
});

server.listen(3000,"127.0.0.1");

