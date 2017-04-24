function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    // Add similar listeners for other events

}
function startCamera() {
   console.log('Received startCamera');
   var srcType = Camera.PictureSourceType.CAMERA;
   var options = setOptions(srcType);

   navigator.camera.getPicture(function cameraSuccess(imageUri) {
        var data = "data:image/jpeg;base64," + imageUri;
        var img = new Image();
        img.src = data;
        console.log("nav: ", img.src);
        img.onload = function(){
          displayPicture(img.width, img.height, data);
        };

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        // allowEdit: true,
        // correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function displayPicture(imgWidth, imgHeight, imgSrc){
  console.log("recieved display picture");
  var canvas = window._canvas = new fabric.Canvas('canvas'),
  $loggingEl = $('#logging');
  canvas.selection = true;
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: 'rgba(102,153,255,0.5)',
    cornerSize: 12,
    selectable: false,
  });
  // canvas.isDrawingMode = true;
  canvas.lockMovementX = true;
  canvas.lockMovementY = true;
  canvas.lockScaling = true;
  canvas.LockRotation = true;
  canvas.selectable = false;
  canvas.setWidth(window.innerWidth * 0.8);
  canvas.setHeight((window.innerHeight * 0.8) - 50);

  canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
  canvas.freeDrawingBrush.color = 'Black';
  canvas.freeDrawingBrush.width = 10;
  console.log(JSON.stringify(canvas));
  var hRatio = canvas.width  / imgWidth;
  var vRatio =  canvas.height / imgHeight;
  var ratio  = Math.min ( hRatio, vRatio );
  var centerShift_x = ( canvas.width - imgWidth*ratio ) / 2;
  var centerShift_y = ( canvas.height - imgHeight*ratio ) / 2;
  var scale_w = imgWidth*ratio;
  var scale_h = imgHeight*ratio;
  console.log("LOAD_IMAGE", hRatio, vRatio, ratio, centerShift_x, centerShift_y);
  console.log(canvas);
  console.log("IMG SOURCE: ", imgSrc);
  canvas.setBackgroundImage(imgSrc, canvas.renderAll.bind(canvas), {
    width: scale_w,
    height: scale_h,
    left: centerShift_x,
    top: centerShift_y,
    originX: 'left',
    originY: 'top',
  });
  console.log("canvas.isDrawingMode: ", canvas.isDrawingMode);
  canvas.isDrawingMode = true;
  console.log("canvas.isDrawingMode: ", canvas.isDrawingMode);
}

 function mouseUpEvent() {
    console.log('Received mouseUpEvent: ');
    var tag = prompt("Please tag the selected region");
    var canvas = window._canvas;
    var pLength = canvas.freeDrawingBrush._points.length;
    console.log("Length", pLength);
    var pLeft = 0;
    var pTop = 0;
    for(var i = 0; i < pLength; i++){
      pLeft = pLeft + canvas.freeDrawingBrush._points[i].x;
      pTop = pTop + canvas.freeDrawingBrush._points[i].y;
    }
    console.log("Before AVG", pLeft, pTop);
    pLeft = pLeft/pLength;
    pTop = pTop/pLength;
    console.log("After AVG", pLeft, pTop);
    var fabicText = new fabric.IText(tag, {
      fontFamily: 'arial black',
      left: pLeft,
      top: pTop,
      fill: 'White',
      textBackgroundColor: 'Black',

    });
    canvas.add(fabicText);
}

function eraseCanvas() {
  console.log("Received EraseCanvas");
  var canvas = window._canvas;
  canvas.isDrawingMode = false;
  canvas.clear();
}
