var sharpenKernel = 
[
  -1, -1, -1,
  -1,  9, -1,
  -1, -1, -1
];
sharpenKernel.filterWidth = 3;
sharpenKernel.filterHeight = 3;
sharpenKernel.factor = 1.0;
sharpenKernel.bias = 0.0;


var edgeKernel = 
[
  -1, -1, -1,
  -1,  9, -1,
  -1, -1, -1
];
edgeKernel.filterWidth = 3;
edgeKernel.filterHeight = 3;
edgeKernel.factor = 1.0;
edgeKernel.bias = 0.0;

var sharpenKernel2 = 
[
  0, -1, 0,
  -1, 5, -1,
  0, -1, 0
];
sharpenKernel2.filterWidth = 3;
sharpenKernel2.filterHeight = 3;
sharpenKernel2.factor = 1.0;
sharpenKernel2.bias = 0.0;

var blurKernel = 
[
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9
];
blurKernel.filterWidth = 3;
blurKernel.filterHeight = 3;
blurKernel.factor = 1.0;
blurKernel.bias = 0.0;


var subtleSharpenKernel =
[
  -1/8, -1/8, -1/8, -1/8, -1/8,
  -1/8,  2/8,  2/8,  2/8, -1/8,
  -1/8,  2/8,  8/8,  2/8, -1/8,
  -1/8,  2/8,  2/8,  2/8, -1/8,
  -1/8, -1/8, -1/8, -1/8, -1/8
];
subtleSharpenKernel.filterWidth = 5;
subtleSharpenKernel.filterHeight = 5;
subtleSharpenKernel.factor = 1.0 ; /// 8.0
subtleSharpenKernel.bias = 0.0;

var gaussian5Kernel =
[
  1/256,   4/256,    6/256,  4/256, 1/256,
  4/256,  16/256,   24/256, 16/256, 4/256,
  6/256,  24/256,   36/256, 24/256, 6/256,
  4/256,  16/256,   24/256, 16/256, 4/256,
  1/256,   4/256,    6/256,  4/256, 1/256
];
gaussian5Kernel.filterWidth = 5;
gaussian5Kernel.filterHeight = 5;
gaussian5Kernel.factor = 1.0;
gaussian5Kernel.bias = 0.0;


var constraints = {};
var mediaDevicesConstraints = {};
var hdConstraints = 
{
  audio: false,
  video: {
    mandatory: constraints
  }
}

var video = document.querySelector('video');

function success(stream) {
  //var success = (function(stream) {});
  //video.addEventListener("loadedmetadata", initProgress, !1);
  video.srcObject = stream;
  //readyToPlay = !0;
  //play()
  video.play();
}

function onError(msg) {
  
}

function videoToCtx(video) {
  var tmp_canvas = document.getElementById("tmp_canvas");
  if (tmp_canvas == null) {
        tmp_canvas = document.createElement("canvas");
        tmp_canvas.width = video.videoWidth ;
        tmp_canvas.height = video.videoHeight;
        //console.log("capture image");
        //console.log(canvas.width + " " + canvas.height);
        var ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = "tmp_canvas";
        //tmp_canvas.hidden = "true";
        //tmp_canvas.style = "width:640; height: 480; ";
        document.body.appendChild(tmp_canvas);
        return ctx;
    }
    var ctx = tmp_canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, tmp_canvas.width, tmp_canvas.height);
    return ctx;
}

function imageToCtx(img) {
  var tmp_canvas = document.getElementById("tmp_canvas");
  if (tmp_canvas == null) {
        tmp_canvas = document.createElement("canvas");
        tmp_canvas.width = img.width ;
        tmp_canvas.height = img.height;
        var ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = "tmp_canvas";
        document.body.appendChild(tmp_canvas);
        return ctx;
    }
    //console.log(tmp_canvas.width);
    var ctx = tmp_canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, tmp_canvas.width, tmp_canvas.height);
    return ctx;
}

function ctxToImageData(ctx, w, h) {
	var imgd = ctx.getImageData(0, 0, w, h); 
	return imgd;
}

function dataToImg(imgData, ctx) {
  ctx.putImageData(imgData, 0, 0); 

  if (img == null)
    img = document.createElement("img");
    img.src = ctx.canvas.toDataURL();
  return img;
}


var getPixelRetval = [];
function getPixel(imgData, w, h, channelCount, x, y) {
  // if (imgData.width != w || imgData.height != h) {
  //   console.error("getPixel: width and height don't match " + [imgData.width, w, imgData.height, h]);
  //   return -1;
  // }
  // if (imgData.data.length != w * h * channelCount) {
  //   console.error("getPixel: parameters do not match with data length " + [ w, h, channelCount, imgData.data.length, w * h * channelCount]);
  //   return -1;
  // }

  // getPixelRetval.length = 0;
  // for (var i = 0; i < channelCount; i++) {
  //   getPixelRetval.push(imgData.data[y*w*channelCount + x*channelCount + i]);
  // }
  // return getPixelRetval;

  var retval = [];
  var offset = y*w*channelCount + x*channelCount;
  for (var i = 0; i < channelCount; i++) {
    retval.push(imgData.data[ offset + i]);
  }
  return retval;

  //var offset = y*w*channelCount + x*channelCount;
  //return imgData.data.slice(offset, offset + channelCount);
}

function getPixel2(ctx, w, h, channelCount, x, y) {

  //if (imgData.width != w || imgData.height != h) {
  //  console.error("getPixel: width and height don't match " + [imgData.width, w, imgData.height, h]);
  //  return -1;
  //}
  //if (imgData.data.length != w * h * channelCount) {
  //  console.error("getPixel: parameters do not match with data length " + [ w, h, channelCount, imgData.data.length, w * h * channelCount]);
  //  return -1;
 // }

 var pixel = ctx.getImageData(x, y, 1, 1); 
 return pixel;
  // var retval = [];
  // for (var i = 0; i < channelCount; i++) {
  //   retval.push(imgData.data[y*w*channelCount + x*channelCount + i]);
  // }
 // return retval;
}

// newPixel should be an array of length == channelCount
function setPixel(imgData, w, h, channelCount, x, y, newPixel) {
  // if (imgData.width != w || imgData.height != h) {
  //   console.error("getPixel: width and height don't match " + [imgData.width, w, imgData.height, h]);
  // }
  // if (imgData.data.length != w * h * channelCount) {
  //   console.error("getPixel: parameters do not match with data length " + [ w, h, channelCount, imgData.data.length, w * h * channelCount]);
  // }

  // if (newPixel.length != channelCount) {
  //   console.error("pixel does not match channelCount" + [newPixel, channelCount]);
  //}

  var offset = y*w*channelCount + x*channelCount ;

  for (var i = 0; i < channelCount; i++) {
    imgData.data[ offset + i] = newPixel[i];
  }
}

function videoToImage(video) {
  if (video.videoWidth == 0 || video.videoHeight == 0) return;
  tmp_canvas = document.getElementById("tmp_canvas");
  if (tmp_canvas == null) {
      tmp_canvas = document.createElement("canvas");
      tmp_canvas.width = video.videoWidth ;
      tmp_canvas.height = video.videoHeight;
      console.log("canvas width height set "+[tmp_canvas.width, tmp_canvas.height]);
      //console.log(canvas.width + " " + canvas.height);
      var ctx = tmp_canvas.getContext('2d');
      
      tmp_canvas.id = "tmp_canvas";
      tmp_canvas.hidden = "true";

      //tmp_canvas.style = "width: 640; height: 480;";
      document.body.appendChild(canvas);
  }

    ctx.drawImage(video, 0, 0, tmp_canvas.width, tmp_canvas.height);
    var img = document.createElement("img");
    img.src = tmp_canvas.toDataURL();
    return img;
}

//navigator.getUserMedia(hdConstraints, success, onError)

// var videoSources = [];
// var test1 = navigator.mediaDevices.enumerateDevices().then(function(devices) {
//       devices.forEach(function(device) {
//           console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
//           if (device.kind == "videoinput")
//               videoSources.push(device.deviceId);
//       });
//       //video.mandatory.sourceId = videoSources[1].id;
//       //optional: [{ sourceId: videoSource }],
//       //mediaDevicesConstraints.mandatory = [{ sourceId: videoSources[1].id }]; // videoSources[1].id;
//       //console.log(videoSources[1]);
//       //mediaDevicesConstraints.sourceId = videoSources[1];
//       mediaDevicesConstraints.optional = [{ sourceId: videoSources[1] }]; // videoSources[1].id;
//       navigator.mediaDevices.getUserMedia({
//           audio: false,
//           video: mediaDevicesConstraints
//       }).then(success, onError)
//   })
//   .catch(function(err) {
//     console.log(err.name + ": " + err.message);
//   });

function applyFilter(imgData, kernel)
{
  //load the image into the buffer
  var w = 640
  var h = 480;
  var channelCount = 4;

  var kernelWidthHalf = kernel.filterWidth / 2;
  var kernelHeightHalf = kernel.filterWidth / 2;
  //apply the filter
  for(var x = 0; x < w; x++)
  for(var y = 0; y < h; y++)
  {
    var red = 0.0
    var green = 0.0
    var blue = 0.0;

    var offsetX = x - kernelWidthHalf + w;
    var offsetY = y - kernelHeightHalf + h

    //multiply every value of the filter with corresponding image pixel
    for(var filterY = 0; filterY < kernel.filterHeight; filterY++)
    for(var filterX = 0; filterX < kernel.filterWidth; filterX++)
    {

      var imageX = Math.ceil((offsetX + filterX ));
      while (imageX > w) imageX -= w;
      var imageY = Math.ceil((offsetY + filterY ));
      while (imageY > h) imageY -= h;

      var currPixel = getPixel(imgData, w, h, 4, imageX, imageY);

      var filterIndex = filterY * kernel.filterWidth + filterX;
      red += currPixel[0] * kernel[filterIndex];
      green += currPixel[1] * kernel[filterIndex];
      blue += currPixel[2] * kernel[filterIndex];
    }

    // red   = Math.min(Math.max(Math.ceil(kernel.factor * red + kernel.bias),   0), 255);
    // green = Math.min(Math.max(Math.ceil(kernel.factor * green + kernel.bias), 0), 255);
    // blue  = Math.min(Math.max(Math.ceil(kernel.factor * blue + kernel.bias),  0), 255);

    red   = Math.min(Math.max(Math.ceil(red ),   0), 255);
    green = Math.min(Math.max(Math.ceil(green ), 0), 255);
    blue  = Math.min(Math.max(Math.ceil(blue ),  0), 255);

    setPixel(imgData, w, h, channelCount, x, y, [red,green,blue,255]);
  }

  return imgData;
}

function applyFilterGray(imgData, kernel)
{
  //load the image into the buffer
  var w = 640
  var h = 480;
  var channelCount = 4;

  var kernelWidthHalf = kernel.filterWidth / 2;
  var kernelHeightHalf = kernel.filterWidth / 2;
  //var tmpPixel = [];

  //apply the filter
  for(var x = 0; x < w; x++)
  for(var y = 0; y < h; y++)
  {

    //tmpPixel.length = 0;
    var grayVal = 0;
    var offsetX = x - kernelWidthHalf + w;
    var offsetY = y - kernelHeightHalf + h

    //multiply every value of the filter with corresponding image pixel
    for(var filterY = 0; filterY < kernel.filterHeight; filterY++)
    for(var filterX = 0; filterX < kernel.filterWidth; filterX++)
    {
      var imageX = Math.ceil((offsetX + filterX )); //%w
      while (imageX > w) imageX -= w;
      var imageY = Math.ceil((offsetY + filterY )); //%h
      while (imageY > h) imageY -= h;
      var currPixel = getPixel(imgData, w, h, 4, imageX, imageY);

      var filterIndex = filterY * kernel.filterWidth + filterX;
      grayVal += currPixel[0] * kernel[filterIndex];
    }

    grayVal = Math.min(Math.max(Math.ceil(grayVal), 0), 255);
    // tmpPixel.push(grayVal);
    // tmpPixel.push(grayVal);
    // tmpPixel.push(grayVal);
    // tmpPixel.push(255);
    setPixel(imgData, w, h, channelCount, x, y, [grayVal, grayVal, grayVal, 255]);
  }

  return imgData;
}

function grayscale(imgData, w, h, channelCount) {

  for(var i = 0; i < imgData.data.length; i+=channelCount)
  {
    var r = imgData.data[i],
        g = imgData.data[i+1],
        b = imgData.data[i+2],
        gray = (r+g+b)/3;

    imgData.data[i] = gray;
    imgData.data[i+1] = gray;
    imgData.data[i+2] = gray;
  }
  return imgData;
}

var lastTime = 0;
var imageFilter = new WebGLImageFilter();

function tick() {
  var video = document.querySelector('video');
  var img = document.getElementById("test_input");
  //var ctx = imageToCtx(img);

  var ctx = videoToCtx(video);
  var imgData = ctxToImageData(ctx, 640, 480);

  // solve initiation error
  var tmp_canvas = document.getElementById("tmp_canvas");
  var ctx2 = tmp_canvas.getContext('2d');

  if (tmp_canvas.width == 0 )
    tmp_canvas.width = video.videoWidth;

  if (tmp_canvas.height == 0 )
    tmp_canvas.height = video.videoHeight;

  if (video.paused || video.ended) {
    return;
  }

  //imgData = applyFilter(imgData, sharpenKernel);
  //applyFilter(imgData, gaussian5Kernel);
  grayscale(imgData, 640, 480, 4);
  applyFilterGray(imgData, subtleSharpenKernel);
  //applyFilter(imgData, blurKernel);
  //applyFilterGray(imgData, gaussian5Kernel);
  
  ctx.putImageData(imgData, 0, 0);

  //ctx.putImageData( ctxToImageData(imageToCtx(retImg)), 0, 0);
  //ctx.drawImage(retImg, 0, 0);

  var date = new Date();
  var timeNow = date.getTime();
  var timeDiff = timeNow - lastTime;
  lastTime = timeNow;

  console.log("ticktock " +  timeDiff); //+[video.videoWidth, video.videoHeight] + " "
  //<canvas id="tmp_canvas" width="640" height="480" />
  //<canvas id="tmp_canvas2" width="640" height="480" />
}

function tick2() {
  var img = document.getElementById("test_input");
  var ctx = imageToCtx(img);

  var retImg;
  try {
    
    imageFilter.reset();
    imageFilter.addFilter("convolution", subtleSharpenKernel ); 
    //imageFilter.addFilter("sharpen");
    retImg = imageFilter.apply(img);
    //imgData = ctxToImageData(retContext, 640, 480);
  }
  catch( err ) {
    console.log("webgl not supported "+err);
    // Handle browsers that don't support WebGL
  }

  ctx.drawImage(retImg, 0, 0);

  var date = new Date();
  var timeNow = date.getTime();
  var timeDiff = timeNow - lastTime;
  lastTime = timeNow;

  console.log("ticktock " +  timeDiff); //+[video.videoWidth, video.videoHeight] + " "
}

function cleanUp() {
	clearInterval(intervalID);
}

var intervalID = setInterval(tick, 1000);
window.onclose = cleanUp;