let request = indexedDB.open('Camera',1); //opened a DB
let db;

request.onsuccess=function(e)
{
    db = request.result;
}
request.onerror=function(e)
{
    console.log('error');
}
request.onupgradeneeded =function(e)
{
    db = request.result;
    db.createObjectStore('gallery',{keyPath:'mId'}); //created object store of name gallery

}
function addMediaToGallery(data,type)
{
    let tx = db.transaction('gallery','readwrite'); //created a transaction of readwrite in gallery 
    let gallery = tx.objectStore('gallery');
    gallery.add({mId:Date.now(),type,media:data});//added an object
}
function viewMedia()
{
    let body = document.querySelector('body'); 
    let tx = db.transaction('gallery','readonly');//made a transaction for viewing
    let gallery = tx.objectStore('gallery'); //accesed the db store gallery
    let req = gallery.openCursor(); //cursor for viewing one by one
    req.onsuccess=function() //called success function
    {
        let cursor = req.result;
        if(cursor) //if cursor object is valid
        {
            if(cursor.value.type=='video') //for video
            {
                let vidContainer = document.createElement('div');//1. created a div for video container
                vidContainer.setAttribute('data-mId',cursor.value.mId);//2. for uniquely defining every element we assigned an attribute to video-conatiner data-mID , where we'll store Mid of object
                vidContainer.classList.add('gallery-vid-container');//3. added a class
                let video = document.createElement('video'); //4. created video element
                vidContainer.appendChild(video);//5. added a child in vidcontainer i.e., video
                let deleteBtn = document.createElement('button');//6.created a delete button
                deleteBtn.classList.add('gallery-delete-button');//7. added delete button
                deleteBtn.innerText='Delete'; //8. set the inner text
                deleteBtn.addEventListener('click',deleteBtnHandler);
                let downloadBtn = document.createElement('button');
                downloadBtn.classList.add('gallery-download-button');
                downloadBtn.innerText='Download';
                downloadBtn.addEventListener('click',downloadBtnHandler);
                vidContainer.appendChild(deleteBtn);
                vidContainer.appendChild(downloadBtn);
                video.controls=true; //given controlw
                video.autoplay= true;
                
                video.src = URL.createObjectURL(cursor.value.media); //source of video is in objects media

                body.appendChild(vidContainer);
            }
            else{
                let imgContainer = document.createElement('div'); ///for images
                imgContainer.setAttribute('data-mId',cursor.value.mId);
                imgContainer.classList.add('gallery-img-container');
                let img = document.createElement('img');
                img.src = cursor.value.media;
                imgContainer.appendChild(img);
                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('gallery-delete-button');
                deleteBtn.innerText='Delete';
                deleteBtn.addEventListener('click',deleteBtnHandler);
                let downloadBtn = document.createElement('button');
                downloadBtn.classList.add('gallery-download-button');
                downloadBtn.innerText='Download';
                downloadBtn.addEventListener('click',downloadBtnHandler);
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(downloadBtn);
                body.appendChild(imgContainer);

            }
            cursor.continue();
        }
    }
    
}
function deleteMediaFromGallery(mId)
{
    let tx = db.transaction('gallery','readwrite');
    let gallery = tx.objectStore('gallery');
    gallery.delete(Number(mId));
}
function deleteBtnHandler(e)
{
    let mId = e.currentTarget.parentNode.getAttribute('data-mId');
    deleteMediaFromGallery(mId);
    e.currentTarget.parentNode.remove();
}

function downloadBtnHandler(e)
{
    let a = document.createElement('a');
    a.href = e.currentTarget.parentNode.children[0].src;
    if(e.currentTarget.parentNode.children[0].nodeName=='IMG')
    {
        a.download = 'image.png';
    }
    else
    {
        a.download = 'video.mp4';
    }
    a.click();
    a.remove();
}
