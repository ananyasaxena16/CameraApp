let constraints = { video: true, audio: true };

let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");

let mediaRecorder;
let chunks = [];
let recordState = false;

// C2.2


vidRecordBtn.addEventListener("click", function () {
  if (!recordState) {
    recordState = true;
    mediaRecorder.start();
    vidRecordBtn.innerText = "Recording...";
  } else {
    recordState = false;
    mediaRecorder.stop();
    vidRecordBtn.innerText = "Record";
  }
});

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  videoPlayer.srcObject = mediaStream;

  mediaRecorder = new MediaRecorder(mediaStream);

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = function () {
    let blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];

    var blobUrl = URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${Date.now()}.mp4`;
    link.click();
    link.remove();
  };
});