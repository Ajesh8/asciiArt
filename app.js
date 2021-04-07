const express = require('express')
const app = express();
const port = 8000;
const fileUpload = require('express-fileupload');
var bodyParser = require("body-parser");
var Jimp = require('jimp');
var path=require('path');
const { copyFileSync } = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
 
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(fileUpload());
app.get('/', (req, res) => {
  res.render('index.ejs')
});

app.get('/result',(req,res)=>{
  res.render('result.ejs')
})
var grid;
  var charGrid;
  var temp;
app.post('/result',(req,res)=>{
  let myFile;
  let uploadPath;
  myFile=req.files.myfile;
  uploadPath = __dirname + '/imgs/' + myFile.name;
  console.log(req.files.myfile);
   myFile.mv(uploadPath, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('File uploaded!');
    console.log(uploadPath);    
  })
  
  temp="abc"
  console.log(req.body.type);  
  var temparr=getResultArray(uploadPath,req.body.charnum,req.body.type);
  temparr.then(function(result){
    res.render('result.ejs',data={grid:JSON.stringify(result[0]),charGrid:JSON.stringify(result[1])});
  })
  
})
var chars=[
    [1-0., [' ', ]],
    [1-0.133333, ['.', '`', ]],
    [1-0.155556, ['-', ]],
    [1-0.177778, ['\'', ',', '_', ]],
    [1-0.266667, [':', '=', '^', ]],
    [1-0.311111, ['"', '+', '/', '\\', ]],
    [1-0.333333, ['~', ]],
    [1-0.355556, [';', '|', ]],
    [1-0.4, ['(', ')', '<', '>', ]],
    [1-0.444444, ['%', '?', 'c', 's', '[', ']', ]],
    [1-0.488889, ['!', 'I', '[', ']', 'i', 't', 'v', 'x', 'z', ]],
    [1-0.511111, ['1', 'r', ]],
    [1-0.533333, ['*', 'a', 'e', 'l', 'o', ]],
    [1-0.555556, ['n', 'u', ]],
    [1-0.577778, ['T', 'f', 'w', ]],
    [1-0.6, ['3', '7', ]],
    [1-0.622222, ['J', 'j', 'y', ]],
    [1-0.644444, ['5', ]],
    [1-0.666667, ['$', '2', '6', '9', 'C', 'L', 'Y', 'm', ]],
    [1-0.688889, ['S', ]],
    [1-0.711111, ['4', 'g', 'k', 'p', 'q', ]],
    [1-0.733333, ['F', 'P', 'b', 'd', 'h', ]],
    [1-0.755556, ['G', 'O', 'V', 'X', ]],
    [1-0.777778, ['E', 'Z', ]],
    [1-0.8, ['8', 'A', 'U', ]],
    [1-0.844444, ['D', 'H', 'K', 'W', ]],
    [1-0.888889, ['&', '@', 'R', ]],
    [1-0.911111, ['B', 'Q', ]],
    [1-0.933333, ['#', ]],
    [1-1., ['0', 'M', 'N', ]],
  ];
brMap=new Map(chars);
var mapkeyAr=new Array(30);
const iterator1 = brMap.keys();
var tempKey;
var x=0;
do {
  tempKey=iterator1.next();
  if(tempKey.done)
    break;
  mapkeyAr[x]=tempKey.value;
  x++;
}
while (!tempKey.done);

function getCharacter(br) {
  for(var i=0;i<30;i++) {
    if(mapkeyAr[i]<=br) {
      var arr=brMap.get(mapkeyAr[i]);
      return arr[Math.floor(Math.random() * arr.length)];
    }      
  }    
}
async function getResultArray(myfile,charnum,type) {
  var aspectRatio;
  var asciiArtW=charnum;
  var asciiArtH;
  var horPix;
  var sqlen;
  const image= await Jimp.read(myfile);
  const imageW=await image.bitmap.width;
  const imageH=await image.bitmap.height;
  aspectRatio=imageW/imageH;
  console.log(asciiArtW)
  asciiArtH=Math.floor(asciiArtW/aspectRatio);
  horPix=imageW/asciiArtW;
  sqlen=Math.ceil(imageW/asciiArtW);
  console.log(aspectRatio,horPix,sqlen);
  grid= new Array(asciiArtH);
  charGrid=new Array(asciiArtH);
  for(var i=0; i<asciiArtH;i++) {
    grid[i]=new Array(asciiArtW);
    charGrid[i]=new Array(asciiArtW);
  }
  for(var i=0;i<asciiArtH;i++) {
    for(var j=0;j<asciiArtW;j++) {
      var r=0;
      var g=0;
      var b=0;
      for(var k=0;k<sqlen;k++) {
        for(var l=0;l<sqlen;l++) {
          var hexcol=image.getPixelColor(Math.floor((j*horPix))+l,Math.floor((i*horPix))+k);
          var rgbaOb=Jimp.intToRGBA(hexcol);       
          r=r+rgbaOb.r;
          g=g+rgbaOb.g;
          b=b+rgbaOb.b;
        }
      }
      
      charGrid[i][j]=getCharacter(((r+g+b)/(3*(sqlen*sqlen)))/255);
      rhex=Math.floor(r/(sqlen*sqlen)).toString(16);
      if(rhex.length <2) {
        rhex='0'+rhex;
      }        
      ghex=Math.floor(g/(sqlen*sqlen)).toString(16);
      if(ghex.length <2) {
        ghex='0'+ghex;
      }        
      bhex=Math.floor(b/(sqlen*sqlen)).toString(16);
      if(bhex.length <2) {
        bhex='0'+bhex;
      }
      if(type=="color")        
        grid[i][j]=rhex.concat(ghex,bhex);
      else
        grid[i][j]='000000'
    }
  } 
    return Promise.resolve([grid,charGrid]); 
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});