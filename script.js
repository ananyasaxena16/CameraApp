let constraints = {video:true, audio:true};
let videoPlayer = document.querySelector('video');
let vidRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture');
let mediaRecorder;
let recordState = false;
let chunks = [];
let filter = '';
let allFilters = document.querySelectorAll('.filter');

//ZOOMINOUT




let currZoom =1;
let zoomInBtn = document.getElementById('in');
let zoomOutBtn = document.getElementById('out');

zoomInBtn.addEventListener('click',function(){
    console.log(videoPlayer.style.transform);
    let vidScale = Number(
        videoPlayer.style.transform.split("(")[1].split(")")[0]
    )
    if(vidScale<3)
    {
        currZoom = vidScale+0.1;
        videoPlayer.style.transform=`scale(${currZoom})`;
    }
});

zoomOutBtn.addEventListener('click',function(){
    console.log(videoPlayer.style.transform);
    let vidScale = Number(
        videoPlayer.style.transform.split("(")[1].split(")")[0]
    )
    if(vidScale>1)
    {
        currZoom = vidScale-0.1;
        videoPlayer.style.transform=`scale(${currZoom})`;
    }
});








//filters
for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener('click',function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter(); //remove previous filter
        addFilterToScreen(filter); //added new filter
    })
}

function addFilterToScreen(filterColor)
{
    let filter = document.createElement('div');
    filter.classList.add('on-screen-filter'); //added a new class for new element which is going to cover whole screen for simultaneous filters
    filter.style.height='100vh';
    filter.style.width='100vw';
    filter.style.backgroundColor=`${filterColor}`;
    filter.style.position = 'fixed';
    filter.style.top= '0px';
    document.querySelector('body').appendChild(filter); //appended
}
function removeFilter(){
    let el = document.querySelector('.on-screen-filter'); 
    if(el)  //check if class of filter is added 
    {
        el.remove(); //removed
    }
}




//mediarecording
vidRecordBtn.addEventListener("click",function(){
  if(mediaRecorder!=undefined)
  {
      removeFilter();

      let innerDiv = vidRecordBtn.querySelector('#record-div'); ///shrinkinout feature of buttons 
  if(recordState==false)
  {
      recordState=true;
      innerDiv.classList.add('recording-animation'); //added extra class for animation of buttons
      currZoom=1
      videoPlayer.style.transform = `scale(${currZoom})`
     
      mediaRecorder.start();
  }
  else{
      recordState=false;
      innerDiv.classList.remove('recording-animation'); //removed extra class for removing animation of buttons
      mediaRecorder.stop();
      
  }
}
})
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
  videoPlayer.srcObject=mediaStream;
mediaRecorder = new MediaRecorder(mediaStream);
mediaRecorder.ondataavailable = function(e){
    chunks.push(e.data)
}
mediaRecorder.onstop=function()
{
    let blob = new Blob(chunks,{type:'video/mp4'});
    chunks =[];
    addMediaToGallery(blob, 'video');
    /*let blobUrl = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = blobUrl;
    link.download='video.mp4';
    link.click();
    link.remove();
    */
}


}).catch(function(err){
  console.log(err);
})
captureBtn.addEventListener('click',function()
{
  let innerDiv = captureBtn.querySelector('#click-div'); //animation of picture capture button
  innerDiv.classList.add('capture-animation'); //added class for animation
  console.log(('clicked'));
  capture();

  setTimeout(function(){
      innerDiv.classList.remove('capture-animation'); //removed class
  },1000);
})
function capture()
{
    let c = document.createElement('canvas');
    c.width = videoPlayer.videoWidth;
    c.height = videoPlayer.videoHeight;
    let tool = c.getContext('2d');
    //origin shifting
    tool.translate(c.width/2,c.height/2);
    //scaling
    tool.scale(currZoom,currZoom);
    //moving back the origin
    tool.translate(-c.width/2,-c.height/2);
    tool.drawImage(videoPlayer,0,0);
    if(filter!='')
    {
        tool.fillStyle = filter;
        tool.fillRect(0,0,c.width,c.height);
    }

    addMediaToGallery(c.toDataURL(),'img');
    /*let link = document.createElement('a');
    link.download = 'image.png';
    link.href = c.toDataURL();
    link.click();
    link.remove();
    */
    c.remove();
    
}