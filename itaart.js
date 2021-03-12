var canvas = document.getElementById('imgcanvas');
var startBtn=document.getElementById('Start');
var asciiArtDiv=document.getElementById('asciiResult');
var ctx = canvas.getContext('2d');
var imgData;
var normal
var imgW;
var imgH;
var aspectRatio;
var asciiArtW;
var asciiArtH;
var horPix;
var verPix;
var grid;
var brGrid;
var brMap;
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
console.log(brMap);
console.log(mapkeyAr);
console.log(chars.length);
setupImageData();
function setupImageData() {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = 'http://127.0.0.1:8080/assets/thumb-1920-861889.jpg';
  img.onload = function() {
    imgW=	img.width;
    imgH= img.height;
    ctx.canvas.width = imgW;
    ctx.canvas.height = imgH;
    ctx.canvas.hidden=true;
    ctx.drawImage(img, 0, 0);
    img.style.display = 'none';
    imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  };
}

function getCharacter(br) {
  for(var i=0;i<30;i++) {
    if(mapkeyAr[i]<=br) {
      var arr=brMap.get(mapkeyAr[i]);
      return arr[Math.floor(Math.random() * arr.length)];
    }
      
  }
    
}

startBtn.onclick=function () {
  var aspectRatio=imgW/imgH;
  var asciiArtW=400;
  var asciiArtH=Math.floor(asciiArtW/aspectRatio);
  horPix=imgW/asciiArtW;
  var sqlen=Math.ceil(imgW/asciiArtW);
  console.log(aspectRatio,horPix,sqlen);
  grid= new Array(asciiArtH);
  brGrid=new Array(asciiArtH);
  for(var i=0; i<asciiArtH;i++) {
    grid[i]=new Array(asciiArtW);
    brGrid[i]=new Array(asciiArtW);
  }

  for(var i=0;i<asciiArtH;i++) {
    for(var j=0;j<asciiArtW;j++) {
      var r=0;
      var g=0;
      var b=0;
      for(var k=0;k<sqlen;k++) {
        for(var l=0;l<sqlen;l++) {
          r=r+imgData.data[(Math.floor(i*horPix)+k)*imgW*4+(Math.floor(j*horPix)+l)*4];
          g=g+imgData.data[(Math.floor(i*horPix)+k)*imgW*4+(Math.floor(j*horPix)+l)*4+1];
          b=b+imgData.data[(Math.floor(i*horPix)+k)*imgW*4+(Math.floor(j*horPix)+l)*4+2];
        }
      }
      
      brGrid[i][j]=((r+g+b)/(3*(sqlen*sqlen)))/255;
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
      grid[i][j]=rhex.concat(ghex,bhex);
    }
  }
  console.log(grid);
  console.log(brGrid);
  for(var i=0;i<asciiArtH;i++) {
    var rowDiv=document.createElement('div');
      rowDiv.style.margin='0px';
      rowDiv.style.display='block';
      rowDiv.style.height='3px';
    for(var j=0;j<asciiArtW;j++) {      
      var newSpan = document.createElement('span');
      var spchar=getCharacter(brGrid[i][j]);
      newSpan.innerHTML=spchar;
      newSpan.style.color='#'+grid[i][j];
      //newSpan.style.backgroundColor ='#'+grid[i][j];
      newSpan.style.fontSize = "3px";
      newSpan.id=i.toString(10)+'/'+j.toString(10);
      newSpan.style.margin='0em'
      newSpan.style.width='3px';
      newSpan.style.display='inline-block';
      rowDiv.appendChild(newSpan);  
    }
    asciiArtDiv.appendChild(rowDiv);
  }
  grid=new Array(1);
  imgData=new Array(1);
};



