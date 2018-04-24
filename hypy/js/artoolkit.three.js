/* THREE.js ARToolKit integration */

;(function() {

	var img = null;
	var img2 = null;
	var cropImage = null;
	var he_tmp = [];

	var processCount = 0;

	var tmp_canvas;
	var buffer;

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
			video = video || this.image;
			console.log("this iamge");
			console.log(this.image);
			console.log("vid here");
			console.log(video);
			console.log(video.width);
			console.log(video.height);

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

				process: function(ctx) {

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

					var img3 = crop (video, 0, 160, 640, 240);
					//var img3 = crop( video, 0, 0, 640, 480 );

					if (tmp_canvas == null)
						tmp_canvas = document.createElement('canvas');
					var ctx3 = tmp_canvas.getContext('2d');
					
					ctx3.drawImage( img3, 0, 0, 640, 240 );

					//self.process(img);
					//self.process(img3);
					self.process(video);
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

	var test_tick = function () {
		console.log("cammie");
		//console.log(camera);
		//console.log(scene);
		console.log(videoScene);
		setTimeout(test_tick, 1000);
	}

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
