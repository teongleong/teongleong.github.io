/* THREE.js ARToolKit integration */

;(function() {

	var img = null;
	var img2 = null;
	var cropImage = null;
	var he_tmp = [];

	var processCount = 0;

	var tmp_canvas;
	var buffer;

	var convFlag = true;

	function toggleConv() {
		convFlag = !convFlag;
	}

	var integrate = function() {
		/**
			Helper for setting up a Three.js AR scene using the device camera as input.
			Pass in the maximum dimensions of the video you want to process and onSuccess and onError callbacks.

			On a successful initialization, the onSuccess callback is called with an ThreeARScene object.
			The ThreeARScene object contains two THREE.js scenes (one for the video image and other for the 3D scene)
			and a couple of helper functions for doing video frame processing and AR rendering.

			Here's the structure of the ThreeARScene object:
			{
				scene: THREE.Scene, // The 3D scene. Put your AR objects here.
				camera: THREE.Camera, // The 3D scene camera.

				arController: ARController,

				video: HTMLVideoElement, // The userMedia video element.

				videoScene: THREE.Scene, // The userMedia video image scene. Shows the video feed.
				videoCamera: THREE.Camera, // Camera for the userMedia video scene.

				process: function(), // Process the current video frame and update the markers in the scene.
				renderOn: function( THREE.WebGLRenderer ) // Render the AR scene and video background on the given Three.js renderer.
			}

			You should use the arScene.video.videoWidth and arScene.video.videoHeight to set the width and height of your renderer.

			In your frame loop, use arScene.process() and arScene.renderOn(renderer) to do frame processing and 3D rendering, respectively.

			@param {number} width - The maximum width of the userMedia video to request.
			@param {number} height - The maximum height of the userMedia video to request.
			@param {function} onSuccess - Called on successful initialization with an ThreeARScene object.
			@param {function} onError - Called if the initialization fails with the error encountered.
		*/

		
		ARController.getUserMediaThreeScene = function(configuration) {
			var obj = {};
			for (var i in configuration) {
				obj[i] = configuration[i];
			}
			var onSuccess = configuration.onSuccess;

			obj.onSuccess = function(arController, arCameraParam) {
				console.log("on sucess herer");
				var scenes = arController.createThreeScene();
				onSuccess(scenes, arController, arCameraParam);
			};

			var video = this.getUserMediaARController(obj);
			return video;
		};

		/**
			Creates a Three.js scene for use with this ARController.

			Returns a ThreeARScene object that contains two THREE.js scenes (one for the video image and other for the 3D scene)
			and a couple of helper functions for doing video frame processing and AR rendering.

			Here's the structure of the ThreeARScene object:
			{
				scene: THREE.Scene, // The 3D scene. Put your AR objects here.
				camera: THREE.Camera, // The 3D scene camera.

				arController: ARController,

				video: HTMLVideoElement, // The userMedia video element.

				videoScene: THREE.Scene, // The userMedia video image scene. Shows the video feed.
				videoCamera: THREE.Camera, // Camera for the userMedia video scene.

				process: function(), // Process the current video frame and update the markers in the scene.
				renderOn: function( THREE.WebGLRenderer ) // Render the AR scene and video background on the given Three.js renderer.
			}

			You should use the arScene.video.videoWidth and arScene.video.videoHeight to set the width and height of your renderer.

			In your frame loop, use arScene.process() and arScene.renderOn(renderer) to do frame processing and 3D rendering, respectively.

			@param video Video image to use as scene background. Defaults to this.image
		*/
		ARController.prototype.createThreeScene = function(video) {

			console.log("create three scene");
			console.log(video);
			console.log(this.image);
			video = video || this.image;

			// console.log("this iamge");
			// console.log(this.image);
			// console.log("vid here");
			// console.log(video);
			// console.log(video.width);
			// console.log(video.height);

			function grayScale(pixels) {
		         var d = pixels.data;
		         //console.log("in gray scale "+pixels);

		         for (var i=0; i<d.length; i+=4) {
		            var r = d[i];
		            var g = d[i+1];
		            var b = d[i+2];
		            var v = 0.2126*r + 0.7152*g + 0.0722*b;
		            d[i] = d[i+1] = d[i+2] = v
		          }

		          //console.log("in gray scale2 "+pixels);
		        return pixels;
		     }

		     function grayScale2(imgd) {
		     	var data = imgd.data;

		        for(var i = 0; i < data.length; i += 4) {
		          var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
		          // red
		          data[i] = brightness;
		          // green
		          data[i + 1] = brightness;
		          // blue
		          data[i + 2] = brightness;
		        }
		        return imgd;
		    }

		    function extractData(ctx) {
		    	var imgd = ctx.getImageData(0, 0, 640, 480); 
			    //var pix = imgd.data;  
			    return imgd;
		    }

		    function dataToImg(data, ctx) {
		    	ctx.putImageData(data, 0, 0); 

			    if (img == null)
			    	img = document.createElement("img");
        		img.src = ctx.canvas.toDataURL();
			    return img;
		    }

			function invertColor(ctx) {

				var w = ctx.width || ctx.naturalWidth;
				var h = ctx.height || ctx.naturalHeight;

			    var imgd = ctx.getImageData(0, 0, 640, 480); 
			    var pix = imgd.data;  

			    for (var i = 0, n = pix.length; i < n; i += 4) {
			       pix[i  ] = 255 - pix[i  ]; // red
			       pix[i+1] = 255 - pix[i+1]; // green
			       pix[i+2] = 255 - pix[i+2]; // blue
			       // i+3 is alpha (the fourth element) 
			   }
			   return imgd;
			   //return dataToImg(imgd, ctx);
			}

			function avgVal(imgd) {
				var pix = imgd.data;  
				//console.log(pix.length / 4);
				var total = 0;

				for (var i = 0, n = pix.length; i < n; i ++) {
			    	total += pix[i]
			    }

			    if (pix.length != 0)
			    	return total / (pix.length /4 )
			    return 0;
			}

			function thresh(imgd) {

				//var w = ctx.width || ctx.naturalWidth;
				//var h = ctx.height || ctx.naturalHeight;

			    //var imgd = ctx.getImageData(0, 0, 640, 480); 

			    var pix = imgd.data;  
			    var avg = avgVal(imgd);// * 0.5;
			    //console.log("avg "+avg);

			    for (var i = 0, n = pix.length; i < n; i ++) {
			    	var curr = pix[i]
			    	if (curr > avg)
			       		pix[i] = 255;
			       	else 
			       		pix[i] = 0;
			    }

			   return imgd;
			   //return dataToImg(imgd, ctx);
			}

			//he_tmp

			function normalizePixel(imgd) {
			    var min = 255;
			    var max = 0;

			    var data = imgd.data;

			    // find max and min
				for (var i=0; i<data.length; i++) {
					//data[i] = Math.log( data[i]);
			       if (data[i] > max) {
			       	max = data[i];
			       }

			       if (data[i] < min) {
			       	min = data[i];
			       }
			    }

			    //console.log(min + " " + max);

			    for (var i = 0; i < data.length; i ++) {
			    	data[i] = ((data[i] - min) / (max - min)) * 255;
			    }

			    imgd.data = data;
			    return imgd;
			}

			function equalizeHistogram(imgd) {

				if (he_tmp.length == 0) {
					for (var i=0; i<256; i++) {
						he_tmp.push(0);
					}
				}

				// use he_tmp obj to calculate
				var data = imgd.data;
				for (var i=0; i<data.length; i++) {
					he_tmp[data[i]] ++;
				}

				for (var i=0; i<256; i++) {
				    he_tmp[i] /= data.length;
				}

				var cumulative = 0;
				for (var i=0; i<256; i++) {
					var val = he_tmp[i];
					he_tmp[i] += cumulative;
					cumulative += val;
				}

				// scale to 255
				for (var i=0; i<256; i++) {
					he_tmp[i] = Math.floor(he_tmp[i] * 255);
				}

				for (var i=0; i<data.length; i++) {
					data[i] = he_tmp[data[i]];
				}

				//console.log(he_tmp);
				imgd.data = data;
				return imgd;
			}

			async function doEqualizeHistogram(imgd, obj, ctx) {
				img2 = dataToImg(imgd, ctx);
				obj.process(img2);
			}

			function loadPixels(imgd, mat) {
				console.log("mat " + mat.cols + " " + mat.rows);
			}

			function videoToImage(video) {
				tmp_canvas = document.getElementById("tmp_canvas");
				if (tmp_canvas == null) {
			        tmp_canvas = document.createElement("canvas");
			        tmp_canvas.width = video.videoWidth ;
			        tmp_canvas.height = video.videoHeight;
			        //console.log(canvas.width + " " + canvas.height);
			        var ctx = tmp_canvas.getContext('2d');
			        
			        tmp_canvas.id = "tmp_canvas";
			        tmp_canvas.hidden = "true";

			        //tmp_canvas.style = "width: 640; height: 480;";

			        var table = document.getElementById("mainTable");
			        console.log("table "+table);
			        if (table != null)
			        	table.appendChild(tmp_canvas);
			        else 
			        	document.body.appendChild(canvas);
			    }

			    ctx.drawImage(video, 0, 0, tmp_canvas.width, tmp_canvas.height);
		        var img = document.createElement("img");
 			    img.src = tmp_canvas.toDataURL();
 			    return img;
		    }

			function videoToCtx(video) {

				tmp_canvas = document.getElementById("tmp_canvas");

				if (tmp_canvas == null) {

			        tmp_canvas = document.createElement("canvas");

			        tmp_canvas.width = video.videoWidth ;
			        tmp_canvas.height = video.videoHeight;
			        //console.log("capture image");
			        //console.log(canvas.width + " " + canvas.height);
			        var ctx = tmp_canvas.getContext('2d')
			        
			        tmp_canvas.id = "tmp_canvas";
			        //tmp_canvas.hidden = "true";

			        //tmp_canvas.style = "width:640; height: 480; ";

			        var table = document.getElementById("mainTable");
			        console.log("table "+table);
			        if (table != null)
			        	table.appendChild(tmp_canvas);
			        else 
			        	document.body.appendChild(canvas);
			        return ctx;
			    } else {
			    	
			    }

			    var ctx = tmp_canvas.getContext('2d');
			        //document.body.appendChild(canvas);
			        ctx.drawImage(video, 0, 0, tmp_canvas.width, tmp_canvas.height);
			        return ctx;
		 
		        //var img = document.createElement("img");
		        //img.src = canvas.toDataURL();
		        //console.log("img here");
		        //console.log(img);
		        //return img;
		    }

		    function crop (img2, offsetX, offsetY, width, height) {
			  // create an in-memory canvas
			  if (buffer == null)
			  	buffer = document.createElement('canvas');
			  var b_ctx = buffer.getContext('2d');

			  // set its width/height to the required ones
			  buffer.width = width;
			  buffer.height = height;

			  //console.log(buffer.width + " " + buffer.height);
			  // draw the main canvas on our buffer one
			  // drawImage(source, source_X, source_Y, source_Width, source_Height, 
			  //  dest_X, dest_Y, dest_Width, dest_Height)
			  b_ctx.drawImage(img2, offsetX, offsetY, width, height,
			                  0, 0, buffer.width, buffer.height);
			  //b_ctx.drawImage(canvas, offsetX, offsetY, width, height);
			  // now call the callback with the dataURL of our buffer canvas
			  if (cropImage == null)
			    	cropImage = document.createElement("img");
        	  cropImage.src = buffer.toDataURL();
			  return cropImage;
			  //callback(buffer.toDataURL());
			};


			// convolution

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

			function applyFilterGray(imgData, kernel)
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
			    setPixel(imgData, w, h, channelCount, x, y, [grayVal, grayVal, grayVal, 255]);
			  }

			  return imgData;
			}

			function getPixel(imgData, w, h, channelCount, x, y) {

			  var retval = [];
			  var offset = y*w*channelCount + x*channelCount;
			  for (var i = 0; i < channelCount; i++) {
			    retval.push(imgData.data[ offset + i]);
			  }
			  return retval;
			}

			function setPixel(imgData, w, h, channelCount, x, y, newPixel) {
			  var offset = y*w*channelCount + x*channelCount ;
			  for (var i = 0; i < channelCount; i++) {
			    imgData.data[ offset + i] = newPixel[i];
			  }
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

			//var img2 = invertColor(captureImage(this.image));
			//var img2 = invertColor(captureImage(video));

			this.setupThree();

			// To display the video, first create a texture from it.
			var videoTex = new THREE.Texture(video);

			videoTex.minFilter = THREE.LinearFilter;
			videoTex.flipY = false;

			// Then create a plane textured with the video.
			var plane = new THREE.Mesh(
			  new THREE.PlaneBufferGeometry(2, 2),
			  new THREE.MeshBasicMaterial({map: videoTex, side: THREE.DoubleSide})
			);

			// The video plane shouldn't care about the z-buffer.
			plane.material.depthTest = false;
			plane.material.depthWrite = false;

			// Create a camera and a scene for the video plane and
			// add the camera and the video plane to the scene.
			var videoCamera = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1);
			videoScene = new THREE.Scene();
			videoScene.add(plane);
			videoScene.add(videoCamera);

			if (this.orientation === 'portrait') {
				plane.rotation.z = Math.PI/2;
			}

			scene = new THREE.Scene();
			camera = new THREE.Camera();
			camera.matrixAutoUpdate = false;
			camera.projectionMatrix.fromArray(this.getCameraMatrix());
			console.log("cam proj");
			console.log(camera.projectionMatrix);

			scene.add(camera);

			var self = this;

			return {
				scene: scene,
				videoScene: videoScene,
				camera: camera,
				videoCamera: videoCamera,

				arController: this,
				video: video,
				toggleConv: toggleConv,

				process: function(rendererCanvas, overlayContext) {

					// console.log("in process");
					// console.log(rendererCanvas);
					// console.log(overlayContext);

					for (var i in self.threePatternMarkers) {
						self.threePatternMarkers[i].visible = false;
					}
					for (var i in self.threeBarcodeMarkers) {
						self.threeBarcodeMarkers[i].visible = false;
					}
					for (var i in self.threeMultiMarkers) {
						self.threeMultiMarkers[i].visible = false;
						for (var j=0; j<self.threeMultiMarkers[i].markers.length; j++) {
							if (self.threeMultiMarkers[i].markers[j]) {
								self.threeMultiMarkers[i].markers[j].visible = false;
							}
						}
					}

					//convolution
			  		//var buffer = document.createElement('canvas');
			  		var tmp_canvas = document.getElementById('tmp_canvas');
			  		var b_ctx = tmp_canvas.getContext('2d');
				    //buffer.width = 640;
				    //buffer.height = 480;
					b_ctx.drawImage(video, 0, 0, 640, 480);
					//var video_imgd = b_ctx.getImageData(0, 0, 640, 480); 

					// var video_img = document.getElementById('video_img');
					// if (video_img == null) {
					//   video_img = document.createElement("img");
					//   var mainTable2 = document.getElementById('mainTable2');
					//   mainTable2.appendChild(video_img);
					//   video_img.id = "video_img";
					//   video_img.width = 640;
					//   video_img.height = 480;
					// }
					
     // 	   			video_img.src = tmp_canvas.toDataURL();

     			
     				

					//var img3 = crop (video, 0, 160, 640, 240);
					//var img3 = crop( video, 0, 0, 640, 480 );

					// if (tmp_canvas == null)
					// 	tmp_canvas = document.createElement('canvas');
					// var ctx3 = tmp_canvas.getContext('2d');
					
					//ctx3.drawImage( img3, 0, 0, 640, 240 );

					// process
					//console.log([video_img.width, video_img.height]);

					// var testImg = document.getElementById("testImg");
					// self.process(testImg);

					if (convFlag) {
						console.log("conv on");
						// // convolution
		 			// 	var imgd = b_ctx.getImageData(0, 0, 640, 480); 
		 			// 	grayscale(imgd, 640, 480, 4);
		 			// 	applyFilterGray(imgd, subtleSharpenKernel);
		 			// 	//applyFilterGray(imgd, blurKernel);
			   //  		b_ctx.putImageData(imgd, 0, 0);
			   //  		//self.process(tmp_canvas);

			   			var glcanvas = document.getElementById("glcanvas");
			   			// if (glcanvas == null) {
			   			// 	glcanvas = document.createElement("canvas");
			   			// 	glcanvas.id = "glcanvas";
			   			// 	glcanvas.width = 640;
			   			// 	glcanvas.width = 480;
			   			// 	glcanvas.style.display = "none";
			   			// 	glcanvas.hidden = true;
			   			// 	glcanvas.style = "width:640; height:480";
			   			// 	var mainTable2 = document.getElementById("mainTable2");
			   			// 	mainTable2.appendChild(glcanvas);
			   			// 	console.log("glcanvas init");
			   			// }

			    		render(tmp_canvas, glcanvas);
						render(glcanvas, glcanvas);
						render(glcanvas, glcanvas);
						render(glcanvas, glcanvas);
						self.process(glcanvas);
					} else {
						console.log("conv off");
						self.process(video);
					}
					//

					//self.process(video_img);
					

					//self.process(img3);
					

					//self.process(rendererCanvas, overlayContext);
					//self.process(rendererCanvas);
				},

				renderOn: function(renderer) {
					videoTex.needsUpdate = true;

					var ac = renderer.autoClear;
					renderer.autoClear = false;
					renderer.clear();
					renderer.render(this.videoScene, this.videoCamera);
					renderer.render(this.scene, this.camera);

					//console.log(this.scene);
					renderer.autoClear = ac;
				}
			};
		};


		/**
			Creates a Three.js marker Object3D for the given marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			Use this after a successful artoolkit.loadMarker call:

			arController.loadMarker('/bin/Data/patt.hiro', function(markerUID) {
				var markerRoot = arController.createThreeMarker(markerUID);
				markerRoot.add(myFancyHiroModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID The UID of the marker to track.
			@param {number} markerWidth The width of the marker, defaults to 1.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMarker = function(markerUID, markerWidth) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.markerTracker = this.trackPatternMarkerId(markerUID, markerWidth);
			obj.matrixAutoUpdate = false;
			this.threePatternMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given multimarker UID.
			The marker Object3D tracks the multimarker when it's detected in the video.

			Use this after a successful arController.loadMarker call:

			arController.loadMultiMarker('/bin/Data/multi-barcode-4x3.dat', function(markerUID) {
				var markerRoot = arController.createThreeMultiMarker(markerUID);
				markerRoot.add(myFancyMultiMarkerModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID The UID of the marker to track.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMultiMarker = function(markerUID) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.matrixAutoUpdate = false;
			obj.markers = [];
			this.threeMultiMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given barcode marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			var markerRoot20 = arController.createThreeBarcodeMarker(20);
			markerRoot20.add(myFancyNumber20Model);
			arScene.scene.add(markerRoot20);

			var markerRoot5 = arController.createThreeBarcodeMarker(5);
			markerRoot5.add(myFancyNumber5Model);
			arScene.scene.add(markerRoot5);

			@param {number} markerUID The UID of the barcode marker to track.
			@param {number} markerWidth The width of the marker, defaults to 1.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeBarcodeMarker = function(markerUID, markerWidth) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.markerTracker = this.trackBarcodeMarkerId(markerUID, markerWidth);
			obj.matrixAutoUpdate = false;
			this.threeBarcodeMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.setupThree = function() {
			if (this.THREE_JS_ENABLED) {
				return;
			}
			this.THREE_JS_ENABLED = true;

			/*
				Listen to getMarker events to keep track of Three.js markers.
			*/
			this.addEventListener('getMarker', function(ev) {
				var marker = ev.data.marker;
				var obj;
				if (ev.data.type === artoolkit.PATTERN_MARKER) {
					obj = this.threePatternMarkers[ev.data.marker.idPatt];

				} else if (ev.data.type === artoolkit.BARCODE_MARKER) {
					obj = this.threeBarcodeMarkers[ev.data.marker.idMatrix];

				}
				if (obj) {
					obj.matrix.fromArray(ev.data.matrix);
					obj.visible = true;
				}
			});

			/*
				Listen to getMultiMarker events to keep track of Three.js multimarkers.
			*/
			this.addEventListener('getMultiMarker', function(ev) {
				var obj = this.threeMultiMarkers[ev.data.multiMarkerId];
				if (obj) {
					obj.matrix.fromArray(ev.data.matrix);
					obj.visible = true;
				}
			});

			/*
				Listen to getMultiMarkerSub events to keep track of Three.js multimarker submarkers.
			*/
			this.addEventListener('getMultiMarkerSub', function(ev) {
				var marker = ev.data.multiMarkerId;
				var subMarkerID = ev.data.markerIndex;
				var subMarker = ev.data.marker;
				var obj = this.threeMultiMarkers[marker];
				if (obj && obj.markers && obj.markers[subMarkerID]) {
					var sub = obj.markers[subMarkerID];
					sub.matrix.fromArray(ev.data.matrix);
					sub.visible = (subMarker.visible >= 0);
				}
			});

			/**
				Index of Three.js pattern markers, maps markerID -> THREE.Object3D.
			*/
			this.threePatternMarkers = {};

			/**
				Index of Three.js barcode markers, maps markerID -> THREE.Object3D.
			*/
			this.threeBarcodeMarkers = {};

			/**
				Index of Three.js multimarkers, maps markerID -> THREE.Object3D.
			*/
			this.threeMultiMarkers = {};
		};
	}; // end of integrate

	// var test_tick = function () {
	// 	console.log("cammie");
	// 	//console.log(camera);
	// 	//console.log(scene);
	// 	console.log(videoScene);
	// 	setTimeout(test_tick, 1000);
	// }

	var tick = function() {
		if (window.ARController && window.THREE) {
			integrate();
			if (window.ARThreeOnLoad) {
				window.ARThreeOnLoad();
			}
			//setTimeout(test_tick, 1000);
		} else {
			setTimeout(tick, 20); //50
		}
	};

	tick();
	//test_tick();

})();
