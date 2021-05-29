let constraints = {video:true, audio:true};
let videoPlayer = document.querySelector('video');
let vidRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture');
let mediaRecorder;
let recordState = false;
let chunks = [];
let filter = '';

let allFilters = document.querySelectorAll('.filter');
for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener('click',function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        addFilterToScreen(filter);
    })
}

function addFilterToScreen(filterColor)
{
    let filter = document.createElement('div');
    filter.classList.add('on-screen-filter');
    filter.style.height='100vh';
    filter.style.width='100vw';
    filter.style.backgroundColor=`${filterColor}`;
    filter.style.position = 'fixed';
    filter.style.top= '0px';
    document.querySelector('body').appendChild(filter);
}
function removeFilter(){
    let el = document.querySelector('.on-screen-filter');
    if(el)
    {
        el.remove();
    }
}

vidRecordBtn.addEventListener("click",function(){
  if(mediaRecorder!=undefined)
  {
      let innerDiv = vidRecordBtn.querySelector('#record-div');
  if(recordState==false)
  {
      recordState=true;
      innerDiv.classList.add('recording-animation');
      mediaRecorder.start();
  }
  else{
      recordState=false;
      innerDiv.classList.remove('recording-animation');
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
    let blobUrl = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = blobUrl;
    link.download='video.mp4';
    link.click();
    link.remove();
}


}).catch(function(err){
  console.log(err);
})
captureBtn.addEventListener('click',function()
{
  let innerDiv = captureBtn.querySelector('#click-div');
  innerDiv.classList.add('capture-animation');
  console.log(('clicked'));
  capture();

  setTimeout(function(){
      innerDiv.classList.remove('capture-animation');
  },1000);
})
function capture()
{
    let c = document.createElement('canvas');
    c.width = videoPlayer.videoWidth;
    c.height = videoPlayer.videoHeight;
    let tool = c.getContext('2d');
    tool.drawImage(videoPlayer,0,0);
    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = c.toDataURL();
    link.click();
    link.remove();
    c.remove();
}
