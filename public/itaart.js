var asciiArtDiv=document.getElementById('asciiResult');

for(var i=0;i<grid.length;i++) {
  var rowDiv=document.createElement('div');
    rowDiv.style.margin='0px';
    rowDiv.style.display='block';
    rowDiv.style.height='3px';
  for(var j=0;j<grid[i].length;j++) {      
    var newSpan = document.createElement('span');
    var spchar=charGrid[i][j];
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
  



