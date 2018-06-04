
var imageDir = "images/";

var scaleAnchorX = 1;
var scaleAnchorY = 1;

const DisplayStates = {
	Invalid: -1, // do nothing
	Neutral: 0, // wait, show black text
	Correct1: 1, // correct combi
	Correct2: 2, // correct!
	ErrorCombi: 3, // wrong Y S combi
	ErrorNoTone: 4, // no such tone for combi
	ErrorTonePos: 5, // tone is existent but in wrong position
	ErrorSwapped: 6, // Y and S position are swapped
	ErrorTooFar: 7, // Y and S are too far apart
	ErrorTooNear: 8 // Y and S are too close
};

var displayState = DisplayStates.Neutral;
var displayText = "";

function sizeCanvas(canvas, winWidth, winHeight) {
	if ((winWidth / 640 * 480) > winHeight) {
		
		var finalHeight = winHeight;
		var finalWidth = winHeight / 480 * 640;
		scaleAnchorY = winHeight / 480;
		scaleAnchorX = finalWidth / 640;
		console.log("clamp height "+finalWidth + " " + finalHeight);
		canvas.style.height = finalHeight;
		canvas.style.width = finalWidth;
	} else {
		var finalWidth = winWidth;
		var finalHeight = winWidth / 640 * 480;
		scaleAnchorX = winWidth / 640;
		scaleAnchorY = finalHeight / 480;

		canvas.style.width = finalWidth;
		canvas.style.height = finalHeight;
	}
}

function drawSoundIcon(ctx, cw, ch, active) {
	var img1=document.getElementById("sound1");
	var img2=document.getElementById("sound2");
	var img = active ? img2 : img1;
	ctx.drawImage(img, 
		cw * (soundIconPosX - soundIconLength*0.5), 
		ch * (soundIconPosY - soundIconLength*0.5), 
		cw*soundIconLength, 
		cw*((soundIconLength / 70) * 53));
}

function drawCenterLine(ctx, cw, ch) {
	ctx.strokeStyle = 'DimGrey';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(cw * 0.3, ch * 0.7);
	ctx.lineTo(cw * 0.7, ch * 0.7);
	ctx.stroke();
}

function drawCenterText(ctx, cw, ch, color, text) {
	if (text === "") return;
	//ctx.fillStyle = "#ff0000";
	ctx.fillStyle = color;
	var fontSize = 75 * scaleAnchorX
	ctx.font = fontSize+"px Hypy";
	var setA = "ABCDE";
	var setB = "FGHIJ";
	var setC = "KLMNO";
	var setD = "PQRST";
	var setE = "UVWXY";
	var setF = "Z_^`~|";

	var textWidth = ctx.measureText(text).width;
	console.log();
	ctx.fillText(text, cw * 0.5 - textWidth * 0.5, ch * 0.7);
	//console.log(text);		
	//ctx.fillText("\u00E0", cw * 0.55, ch * 0.7);
}

function drawMarkerOutline(ctx, vertex, pos, id) {
	//if (id==-1) id = 99;
	//if (id2==-1) id2 = 99;
	//console.log(scaleX + " " + scaleY + " " + scaleAnchorX);
	if (id === -1) return;
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 1 * scaleAnchorX;
	ctx.beginPath();
	ctx.moveTo(vertex[0][0]*scaleAnchorX, vertex[0][1]*scaleAnchorY);
	ctx.lineTo(vertex[1][0]*scaleAnchorX, vertex[1][1]*scaleAnchorY);
	ctx.stroke();

	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.lineTo(vertex[1][0]*scaleAnchorX, vertex[1][1]*scaleAnchorY);
	ctx.lineTo(vertex[2][0]*scaleAnchorX, vertex[2][1]*scaleAnchorY);
	ctx.stroke();
	ctx.strokeStyle = 'green';

	ctx.beginPath();
	ctx.moveTo(vertex[2][0]*scaleAnchorX, vertex[2][1]*scaleAnchorY);
	ctx.lineTo(vertex[3][0]*scaleAnchorX, vertex[3][1]*scaleAnchorY);
	ctx.stroke();

	ctx.strokeStyle = 'yellow';
	ctx.beginPath();
	ctx.moveTo(vertex[3][0]*scaleAnchorX, vertex[3][1]*scaleAnchorY);
	ctx.lineTo(vertex[0][0]*scaleAnchorX, vertex[0][1]*scaleAnchorY);
	ctx.stroke();

	// print marker id
	if (true) {
		ctx.beginPath();
		ctx.arc(pos[0]*scaleAnchorX, pos[1]*scaleAnchorY, 8, 0, Math.PI * 2);
		ctx.fillStyle = "#00ff00";
		ctx.fill();

		var fontSize = 25 * scaleAnchorX;
		ctx.font = fontSize + "px Arial";
		ctx.fillText(id,pos[0]*scaleAnchorX,pos[1]*scaleAnchorY);
	}				
}

// not used anymore
function svgScaling(bitmap, canvas, scale) {
	let bounds = bitmap.getBounds();
    if (bounds === null) {
    	console.log("svg scaling exited: bounds null");
    	setTimeout(function() {svgScaling(bitmap, canvas);}, 1000);
    	return;
    };
	if (bounds.width > bounds.height) {
		bitmap.scaleX = bounds.width/canvas.width;
		bitmap.scaleY = bounds.width/canvas.width;
	} else {
		bitmap.scaleX = bounds.height/canvas.height;
		bitmap.scaleY = bounds.height/canvas.height;
	}

	if (typeof scale !== "undefined") {
		bitmap.scaleX *= scale;
		bitmap.scaleY *= scale;
	}
}

function bitmapErrorSetup1b(stage) {
	let scale = 0.6;
	
	let container = new createjs.Container();
	let bitmap = new createjs.Bitmap(imageDir+"wrong_big.png");

	createjs.Ticker.addEventListener("tick", function(event) {
		if (displayState === DisplayStates.ErrorCombi) {
			container.visible = true;
			var yunText = markerMapping[yunmuID];
			var shengText = markerMapping[shengmuID];
			sheng.text = shengText;
			yun.text = yunText;
			setPos();
		} else {
			container.visible = false;
		}
		stage.update(event);
	});
	container.addChild(bitmap);
	stage.addChild(container);
	stage.update();
	
	let bWidth = 1000;

	let scale3 = ( stage.canvas.width * scale ) / bWidth;

	container.scaleX = scale3;
	container.scaleY = scale3;

	container.x = stage.canvas.width * 0.5;
	container.y = stage.canvas.height * 0.3;

	let scaleFontSize = 60 * scaleAnchorX / scale3;
	let sheng = new createjs.Text("ch", scaleFontSize + "px Hypy", "#000000"); //人\u97f3
	sheng.textBaseline = "alphabetic";

	let yun = new createjs.Text("eng", scaleFontSize + "px Hypy", "#000000"); //人\u97f3
	yun.textBaseline = "alphabetic";

	container.addChild(sheng, yun);

	var winWidth = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

	var leftOffset = stage.canvas.getBoundingClientRect().left;
	var canvasWidth = stage.canvas.width;

	function setPos() {
		bitmap.x = -bWidth * 0.5 ;
		bitmap.y = 0;

		sheng.y = -stage.canvas.height * 0.00 + sheng.getMeasuredHeight() * 1.2;
		yun.y = -stage.canvas.height * 0.00 + sheng.getMeasuredHeight() * 1.2;

		sheng.x = bWidth * -0.25  - sheng.getMeasuredWidth() * 0.5;
		yun.x = bWidth * 0.03;	
	}
	setPos();
}

function bitmapErrorSetup2b(stage) {
	let scale = 0.47;
	let scale2 = 0.2;
	let container = new createjs.Container();
	let container2 = new createjs.Container();

	//if (yunmuID == -1 || shengText == -1) return;

	var yunText = markerMapping[yunmuID];
	var shengText = markerMapping[shengmuID];

	let bitmap = new createjs.Bitmap(imageDir+"correct_big.png");
	let bitmap2 = new createjs.Bitmap(imageDir+"tone_top1.png");
	let bitmap3 = new createjs.Bitmap(imageDir+"tone_top2.png");
	let bitmap4 = new createjs.Bitmap(imageDir+"tone_top3.png");
	let bitmap5 = new createjs.Bitmap(imageDir+"tone_top4.png");

	let tones = [bitmap2, bitmap3, bitmap4, bitmap5];

	let rawCardWidth = 1000;

	let toneCardHeight = 1000;
	let toneCardWidth = 708;

	let scale3 = ( stage.canvas.width * scale ) / rawCardWidth;
	let scale4 = ( stage.canvas.height * scale2 ) / toneCardHeight;
	

	let fontSize = 60 * scaleAnchorX / scale3;
	let sheng = new createjs.Text("ch", fontSize+"px Hypy", "#000000"); //人\u97f3
	sheng.textBaseline = "alphabetic";

	let yun = new createjs.Text("eng", fontSize+"px Hypy", "#000000"); //人\u97f3
	yun.textBaseline = "alphabetic";

	container.addChild(bitmap);
	container.addChild(sheng, yun);
	container2.addChild(bitmap2, bitmap3, bitmap4, bitmap5);

	container.scaleX = scale3;
	container.scaleY = scale3;

	container2.scaleX = scale4;
	container2.scaleY = scale4;

	stage.addChild(container, container2);
	stage.update();

	createjs.Ticker.addEventListener("tick", function(event) {

 		if (displayState === DisplayStates.ErrorTonePos) {
 			container.visible = true;
 			bitmap.visible = true;
 			tones.forEach(function(e) {
 				e.visible = false;
 			});

 			if (toneID === -1) return;
 			tones[toneID].visible = true;

 			yunText = markerMapping[yunmuID];
			shengText = markerMapping[shengmuID];
			sheng.text = shengText;
 			yun.text = yunText;
			 setPos();
 		} else {
 			container.visible = false;
 			bitmap.visible = false;
 			tones.forEach(function(e) {
 				e.visible = false;
 			});
 		}
		
		stage.update(event);
	});
	
	//svgScaling(bitmap, stage.canvas);
	//svgScaling(bitmap2, stage.canvas);
	tones.forEach(function(e) {
			//svgScaling(e, stage.canvas, scale2);
		});

	container.x = stage.canvas.width * 0.5;
	container.y = stage.canvas.height * 0.3;
	container2.x = stage.canvas.width * 0.5;
	container2.y = stage.canvas.height * 0.1;
	//container.y = stage.canvas.height * 0.5;

	//container.scaleX *= scale;
	//container.scaleY *= scale;

	//container.scaleX *= scale;
	//container.scaleY *= scale;

	//console.log(bitmap.scaleX);

	var tween1 = null;
	var tween2 = null;
	var tween3 = null;
	var tween4 = null;

	function setPos() {

		bitmap.x = -rawCardWidth * 0.5;
		bitmap.y = stage.canvas.height * 0.0;

		
			sheng.y = sheng.getMeasuredHeight() * 1.2;
			yun.y = yun.getMeasuredHeight() * 1.2;

			sheng.x = -rawCardWidth * 0.12 - sheng.getMeasuredWidth() ;
			yun.x = -0.12 * rawCardWidth;

			let cardWidth = stage.canvas.width * scale / scale4;
			//let toneWidth = stage.canvas.width * scale2 / scale4; // tone marker is 708 x 1000 dimension\
			let toneWidth = scale2 / toneCardHeight * toneCardWidth * stage.canvas.height / scale4;

			tones.forEach(function(e) {
			e.x = cardWidth * 0.12;
			});
	
		if (tween1 === null) {
			tween1 = createjs.Tween.get(bitmap2, { loop: true })
			  .to({ x: cardWidth * -0.12 - toneWidth}, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * -0.12 - toneWidth}, 200)
			  .to({ x: cardWidth * 0.12 }, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * 0.12 }, 200);
		}
		if (tween2 === null) {
			tween2 = createjs.Tween.get(bitmap3, { loop: true })
			  .to({ x: cardWidth * -0.12 - toneWidth}, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * -0.12 - toneWidth}, 200)
			  .to({ x: cardWidth * 0.12 }, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * 0.12 }, 200);
		}
		if (tween3 === null) {
			tween3 = createjs.Tween.get(bitmap4, { loop: true })
			  .to({ x: cardWidth * -0.12 - toneWidth}, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * -0.12 - toneWidth}, 200)
			  .to({ x: cardWidth * 0.12 }, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * 0.12 }, 200);
		}
		if (tween4 === null) {
			tween4 = createjs.Tween.get(bitmap5, { loop: true })
			  .to({ x: cardWidth * -0.12 - toneWidth}, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * -0.12 - toneWidth}, 200)
			  .to({ x: cardWidth * 0.12 }, 2000, createjs.Ease.getPowInOut(2))
			  .to({ x: cardWidth * 0.12 }, 200);
		}
	}

	setPos();
	stage.update();
}

function bitmapErrorSetup3b(stage) {

	let scale = 0.46;

	let container = new createjs.Container();

	var bitmap1 = new createjs.Bitmap(imageDir+"tone_wrong1.png");
	var bitmap2 = new createjs.Bitmap(imageDir+"tone_wrong2.png");
	var bitmap3 = new createjs.Bitmap(imageDir+"tone_wrong3.png");
	var bitmap4 = new createjs.Bitmap(imageDir+"tone_wrong4.png");
	
	let choices = [bitmap1, bitmap2, bitmap3, bitmap4];
	let canvasMid = stage.canvas.width * 0.5;

	choices.forEach(function(e) {
		container.addChild(e);
		e.visible = false;
		//svgScaling(e, stage.canvas, scale);
	});

	let pngHeight = 1000;
	let scale2 = stage.canvas.height * 0.46 / pngHeight;

	container.scaleX = scale2;
	container.scaleY = scale2;

	stage.addChild(container);
	stage.update();

	let markerWidth = (stage.canvas.height * scale) / 1000 * 377;

	container.x = stage.canvas.width * 0.5 - markerWidth * 0.5;
	container.y = stage.canvas.height * 0.15

	function setPos() {
// 			if ( ! (choices.length > 0)) return;
		// let bounds = choices[0].getBounds();
		
		// if (bounds === null) {
		// 	setTimeout(function(){setPos();}, 1000);
		// 	return;
		// };
		// console.log(bounds);

		// 57 150 (bounds)
		

		choices.forEach(function(e) {
			//e.x = canvasMid;// - markerWidth * 0.5;
			//e.y = stage.canvas.height * 0.15;
		});

		choices.forEach(function(e) {
			e.visible = false;
		});

		createjs.Ticker.addEventListener("tick", function(event) {

			if (displayState === DisplayStates.ErrorNoTone) {
    			if (toneID === -1 ) {
    			 	return;
    			}
    			var bitmap = choices[toneID];
    			choices.forEach(function(e) {
    				e.visible = false;
    			});
    			bitmap.visible = true;
				
			} else {
				choices.forEach(function(e) {
    				e.visible = false;
    			});
			}
			stage.update(event);
		});

		//console.log("error 3 setpos done "+bitmap1.scaleX + " " + bitmap1.scaleY);
		stage.update();
	}

	setPos();
	stage.update();
}

function bitmapErrorSetup4b(stage) {
	//let scale = 0.23;
	let scale = 0.3;
	let container = new createjs.Container();
	let container2 = new createjs.Container();
	let bitmap = new createjs.Bitmap(imageDir+"blank.png");
	let bitmap2 = new createjs.Bitmap(imageDir+"blank.png");

	createjs.Ticker.addEventListener("tick", function(event) {
		
		if (displayState === DisplayStates.ErrorSwapped) {
			container.visible = true;
			container2.visible = true;
			var yunText = markerMapping[yunmuID];
			var shengText = markerMapping[shengmuID];
			sheng.text = shengText;
 			yun.text = yunText;
			setPos();
		} else {
			container.visible = false;
			container2.visible = false;
		}
		stage.update(event);
	});

	container.addChild(bitmap);
	container2.addChild(bitmap2);
	stage.addChild(container, container2);
	//stage.addChild(bitmap3);
	stage.update();



	//container.scaleX = 1.68;// * scale;
		//container.scaleY = 1.68;// * scale;
		//container2.scaleX = 1.68;// * scale;
		//container2.scaleY = 1.68;// * scale;
		//bitmap3.scaleX = 1.5;
		//bitmap3.scaleY = 1.5;

		//let scale2 = 1.8 * scale;

		let bWidth = 1000;

	let scale3 = ( stage.canvas.width * scale ) / bWidth;

	container.scaleX = scale3;
	container.scaleY = scale3;
	container2.scaleX = scale3;
	container2.scaleY = scale3;

	const canvasMid = stage.canvas.width * 0.5
	//container.x = canvasMid;
	//container.y = stage.canvas.height * 0.3;
	//container2.x = canvasMid;
	//container2.y = stage.canvas.height * 0.3;

	let fontSize = 60 * scaleAnchorX / scale3;
	let sheng = new createjs.Text("ch", fontSize + "px Hypy", "#000000"); //人\u97f3
	sheng.textBaseline = "alphabetic";

	let yun = new createjs.Text("eng", fontSize + "px Hypy", "#000000"); //人\u97f3
	yun.textBaseline = "alphabetic";

	container.addChild(yun);
	container2.addChild(sheng);

	container.x = canvasMid;
	container.y = stage.canvas.height * 0.3;
	container2.x = canvasMid;
	container2.y = stage.canvas.height * 0.3;

	function setPos() {
		let bounds = bitmap.getBounds();
		if (bounds === null) {
			setTimeout(function() {setPos();}, 1000);
			return;
		}

		//bitmap.x = -stage.canvas.width * (1.1 / scale2);
		//bitmap2.x = stage.canvas.width * (0.1 / scale2);

		//bitmap.x = -stage.canvas.width * (1.1);
		//bitmap2.x = stage.canvas.width * (0.1);

		const bitmapStart2 = bWidth * 0.1;
		const bitmapStart1 = -bWidth * 1.1;
		bitmap2.x = bWidth * 0.1;
		bitmap.x = -bWidth * 1.1;

		 //bitmap.x = bounds.width * -1.05;
		// bitmap.y = bounds.height * 0.95;

		// bitmap2.x = bounds.width * 0.05;
		// bitmap2.y = bounds.height * 0.95;

		sheng.y = sheng.getMeasuredHeight() * 1.2;
		yun.y = yun.getMeasuredHeight()  * 1.2;

		//sheng.y = sheng.getMeasuredHeight() * (1.25 / 1.5);
		//yun.y = yun.getMeasuredHeight()  * (1.25 / 1.5);

		const shengStart = bWidth * 0.6 - sheng.getMeasuredWidth() * 0.5;
		const yunStart = -bWidth * 1.1;
		sheng.x = shengStart;
		yun.x = yunStart;

		 createjs.Tween.get(container, { loop: true })
		   .to({ x: canvasMid + stage.canvas.width * 1.2 * 0.3 }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x: canvasMid + stage.canvas.width * 1.2 * 0.3 }, 200)
		   .to({ x: canvasMid }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x: canvasMid }, 200);

		   createjs.Tween.get(container2, { loop: true })
		   .to({ x: canvasMid - stage.canvas.width * 1.2 * 0.3 }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x: canvasMid - stage.canvas.width * 1.2 * 0.3 }, 200)
		   .to({ x: canvasMid }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x: canvasMid }, 200);
	}
	setPos();
}

function bitmapErrorSetup5b(stage) {
	let scale = 0.3; //1.3

	let container = new createjs.Container();
	let container2 = new createjs.Container();
	let bitmap = new createjs.Bitmap(imageDir+"blank.png");
	let bitmap2 = new createjs.Bitmap(imageDir+"blank.png");

	createjs.Ticker.addEventListener("tick", function(event) {

		if (displayState === DisplayStates.ErrorTooNear) {
			container.visible = true;
			container2.visible = true;
			var yunText = markerMapping[yunmuID];
			var shengText = markerMapping[shengmuID];
			//console.log(yunText);
			sheng.text = shengText;
 			yun.text = yunText;
			setPos();
		} else {
			container.visible = false;
			container2.visible = false;
		}
		//bitmap.visibility = (displayState == DisplayStates.Correct1);
		stage.update(event);
	});

	container.addChild(bitmap);
	container2.addChild(bitmap2);
	stage.addChild(container, container2);
	stage.update();

	let bWidth = 1000;

	let scale3 = ( stage.canvas.width * scale ) / bWidth;

	container.scaleX = scale3;
	container.scaleY = scale3;
	container2.scaleX = scale3;
	container2.scaleY = scale3;

	const canvasMid = stage.canvas.width * 0.5
	container.x = canvasMid ;
	container.y = 0;
	container2.x = canvasMid;
	container2.y = 0;

	let fontSize = 60 * scaleAnchorX / scale3;
	let sheng = new createjs.Text("h", fontSize+"px Hypy", "#000000"); //人\u97f3
	sheng.textBaseline = "alphabetic";

	let yun = new createjs.Text("eng", fontSize+"px Hypy", "#000000"); //人\u97f3
	yun.textBaseline = "alphabetic";

	container.addChild(sheng);
	container2.addChild(yun);

	let tween = undefined;
	let bounds = bitmap.getBounds();

	function setOnce() {
		container.x = stage.canvas.width * 0.25;
		container2.x = stage.canvas.width * 0.48;
		container.y = stage.canvas.height * 0.3;
		container2.y = stage.canvas.height * 0.3;

		bitmap.x = 0;
		bitmap.y = 0;
		bitmap2.x = 0;
		bitmap2.y = 0;

		tween = createjs.Tween.get(container2, { loop: true })
		   .to({ x:  stage.canvas.width * 0.40 }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x:  stage.canvas.width * 0.40 }, 200)
		   .to({ x:  stage.canvas.width * 0.48 }, 1000, createjs.Ease.getPowInOut(2))
		   .to({ x:  stage.canvas.width * 0.48 }, 200);
		setPos();
	}

	// update text position, text changes therefore their width height change as well
	function setPos() {
		sheng.y = sheng.getMeasuredHeight() * 1.2;
		yun.y = yun.getMeasuredHeight() * 1.2;

		sheng.x =  - sheng.getMeasuredWidth() * 0.5 + bWidth * 0.5;//stage.canvas.width * 0.5;
		yun.x = 0;
	}
	setOnce();
}

function bitmapCorrectSetup2b(stage) {
	//let scale = 1.5;
	//let wScale = 0.31 * 1.5;

	let scale = 0.47;
	let scale2 = 0.2;
	let container = new createjs.Container();
	let container2 = new createjs.Container();

	let bitmap = new createjs.Bitmap(imageDir+"correct_big.png");
	//bitmap.scaleX = 1;
	let bitmap2 = new createjs.Bitmap(imageDir+"tone_top1_correct.png");
	let bitmap3 = new createjs.Bitmap(imageDir+"tone_top2_correct.png");
	let bitmap4 = new createjs.Bitmap(imageDir+"tone_top3_correct.png");
	let bitmap5 = new createjs.Bitmap(imageDir+"tone_top4_correct.png");

	let tones = [bitmap2, bitmap3, bitmap4, bitmap5];

	let bWidth = 1000;
	let bHeight = 708;

	let scale3 = ( stage.canvas.width * scale ) / bWidth;
	let scale4 = ( stage.canvas.height * scale2 ) / bWidth;

	container.scaleX = scale3;
	container.scaleY = scale3;
	container2.scaleX = scale4;
	container2.scaleY = scale4;

	let fontSize = (60 * scaleAnchorX) / scale3;

	let sheng = new createjs.Text("ch", fontSize+"px Hypy", "#000000"); //人\u97f3
	sheng.textBaseline = "alphabetic";

	let yun = new createjs.Text("eng", fontSize+"px Hypy", "#000000"); //人\u97f3
	yun.textBaseline = "alphabetic";

	createjs.Ticker.addEventListener("tick", function(event) {
		//displayState = DisplayStates.Correct2;
		//console.log(displayState + " " + DisplayStates.Correct2);
		//console.log(container.scaleX + " " + bitmap2.scaleX);
		if (displayState === DisplayStates.Correct1) {
			container.visible = true;
			bitmap.visible = true;
			tones.forEach(function(e) {
				e.visible = false;
			});
			sheng.visible = true;
			yun.visible = true;
			let yunText = markerMapping[yunmuID];
			let shengText = markerMapping[shengmuID];
			sheng.text = shengText;
			yun.text = yunText;
		} else if (displayState === DisplayStates.Correct2) {
			container.visible = true;
			bitmap.visible = true;
			sheng.visible = true;
			yun.visible = true;
			tones.forEach(function(e) {
				e.visible = false;
			});
			if (toneID !== -1) {
				tones[toneID].visible = true;
			}
			let yunText = markerMapping[yunmuID];
			let shengText = markerMapping[shengmuID];
			sheng.text = shengText;
			yun.text = yunText;
		} else {
			container.visible = false;
			bitmap.visible = false;
			tones.forEach(function(e) {
				e.visible = false;
			});
			sheng.visible = false;
			yun.visible = false;
		}

		setPos();
		stage.update(event);
	});

	container.addChild(bitmap);
	tones.forEach(function(e) {
		container2.addChild(e);
	});
	container.addChild(sheng, yun);

	stage.addChild(container, container2);
	stage.update();

	container.x = stage.canvas.width * 0.5;
	container.y = stage.canvas.height * 0.3;
	container2.x = stage.canvas.width * 0.5;
	container2.y = stage.canvas.height * 0.3;

	//container.scaleX *= wScale;
	//container.scaleY *= wScale;

	//let toneWidth = bHeight * 0.28;
	//let toneHeight = scale4 / bWidth;

	let toneHeight = ( stage.canvas.height * scale2) / scale4;
	let cardWidth = stage.canvas.width * scale / scale4;

	console.log(["toneHeight", toneHeight]);

	function setPos() {
		bitmap.x = -bWidth * 0.5;
		bitmap.y = 0;

		sheng.y = sheng.getMeasuredHeight() * 1.2;
		yun.y = yun.getMeasuredHeight() * 1.2;

		sheng.x = -bWidth * 0.13 - sheng.getMeasuredWidth();
		yun.x = -bWidth * 0.12;

		tones.forEach(function(e) {
			//let ew = stage.canvas.height / 150 * 47;
			//ew = ew * wScale * 0.85;

			//e.y = -stage.canvas.height * 0.325;
			//e.y = - bWidth * 0.32;
			//e.y = -toneHeight;
			e.x = 0;
			e.y = -toneHeight;
			let yunText = markerMapping[yunmuID];
			//e.scaleX = scale4;
			//e.scaleY = scale4;
			// yun card left most 
			//e.x = -ew + stage.canvas.width * (0.5 - 0.63);

			// yun card right most 
			//e.x = -ew + stage.canvas.width * (0.5 - 0);
			if (yunmuVowelOnSecond.indexOf(yunText) !== -1) {
				//e.x = bounds2.width * -0.35; // position 2	
				//e.x = -ew + stage.canvas.width * (0.5 - 0.46);
				e.x = cardWidth * -0.07;
			} else {
				//e.x = bounds2.width * -1.05; // position 1 
				//e.x = -stage.canvas.width * 0.15;
				//e.x = -ew + stage.canvas.width * (0.5 - 0.57);
				e.x = cardWidth * -0.18;
			}
		});

		// 300, 126
		// 47, 150
		
	}

	setPos();
	stage.update();
}

function setupStatic(stage) {

	let cw = stage.canvas.width;
	let ch = stage.canvas.height;

	var line = new createjs.Shape();

	// Add this line shape to the canvas
    stage.addChild(line);

    // Set the 'brush stroke' style (basically the thickness of the line)
    //      Then start drawing a black line
    //line.graphics.setStrokeStyle(2).beginStroke("rgba(0,0,0,1)");
    line.graphics.setStrokeStyle(2 * scaleAnchorX).beginStroke("DimGrey");

    // Tell EaselJS where to go to start drawing the line
    line.graphics.moveTo(cw * 0.3, ch * 0.8);

    // Tell EaselJS where to draw the line to
    line.graphics.lineTo(cw * 0.7, ch * 0.8);

    // Stop drawing this line
    line.graphics.endStroke();

    console.log("line drawn "+cw + " " + ch);


//         var img = active ? img2 : img1;
// ctx.drawImage(img, 
// 	cw * (soundIconPosX - soundIconLength*0.5), 
// 	ch * (soundIconPosY - soundIconLength*0.5), 
// 	cw*soundIconLength, 
// 	cw*((soundIconLength / 70) * 53));
	let soundInactiveBmp = new createjs.Bitmap(imageDir+"sound_inactive.png"); //sound_inactive
	let soundActiveBmp = new createjs.Bitmap(imageDir+"sound_active.png"); //sound_inactive

	stage.addChild(soundInactiveBmp, soundActiveBmp);

	let canvasMid = stage.canvas.width * 0.5;
    stage.update();

    function setPos() {
  //       let bounds = soundInactiveBmp.getBounds();
  //       if (bounds === null) {
		// 	setTimeout(function() {setPos();}, 1000);
		// 	return;
		// };
		// console.log("static");
		// console.log(bounds);
		// 70 53

		let iconWidth = stage.canvas.width * soundIconLength;
  //   	soundInactiveBmp.x = canvasMid - bounds.width * 0.5;
		// soundInactiveBmp.y = stage.canvas.height * soundIconPosY - bounds.height * 0.5;
		// soundActiveBmp.x = canvasMid - bounds.width * 0.5;
		// soundActiveBmp.y = stage.canvas.height * soundIconPosY - bounds.height * 0.5 ;    
		soundInactiveBmp.x = canvasMid - iconWidth * 0.5;
		soundInactiveBmp.y = stage.canvas.height * soundIconPosY - iconWidth * 0.5 / 70 * 53;
		soundActiveBmp.x = canvasMid - iconWidth * 0.5;
		soundActiveBmp.y = stage.canvas.height * soundIconPosY - iconWidth * 0.5 / 70 * 53;

		let ratio = iconWidth / 70;

		soundInactiveBmp.scaleX = ratio;
		soundInactiveBmp.scaleY = ratio;
		soundActiveBmp.scaleX = ratio;
		soundActiveBmp.scaleY = ratio;
    }
    setPos();

   	//drawCenterText(ctx, cw, ch, centerTextColor, displayText);
 //   	if (text == "") return;
	// //ctx.fillStyle = "#ff0000";
	// ctx.fillStyle = color;
	// var fontSize = 75 * scaleAnchorX
	// ctx.font = fontSize+"px Hypy";
	// var setA = "ABCDE";
	// var setB = "FGHIJ";
	// var setC = "KLMNO";
	// var setD = "PQRST";
	// var setE = "UVWXY";
	// var setF = "Z_^`~|";

	// var textWidth = ctx.measureText(text).width;
	// console.log();
	// ctx.fillText(text, cw * 0.5 - textWidth * 0.5, ch * 0.7);

	var fontSize = 75 * scaleAnchorX;
	let textObj = new createjs.Text(displayText, fontSize+"px Hypy", "#000000"); //人\u97f3
	textObj.textBaseline = "alphabetic";
	//textObj.text = "heheh";
	
	stage.addChild(textObj);

    createjs.Ticker.addEventListener("tick", function(event) {
		soundInactiveBmp.visible = !soundIconActive;
    	soundActiveBmp.visible = soundIconActive;
    	textObj.text = displayText;
    	let textWidth = textObj.getMeasuredWidth();
		textObj.x = stage.canvas.width * 0.5 - textWidth * 0.5;
		textObj.y = stage.canvas.height * 0.8;

		if (displayState === DisplayStates.Correct1 || displayState === DisplayStates.Correct2) {
			textObj.color = "green";
			soundIconActive = false;
			if (displayState === DisplayStates.Correct2)
				soundIconActive = true;
		} else if (displayState === DisplayStates.Invalid || displayState === DisplayStates.Neutral) {
			textObj.color = "black";
			soundIconActive = false;
		} else { //if (displayState >=3 && displayState <= 8) 
			textObj.color = "red";
			soundIconActive = false;
		}

		stage.update(event);
	});
}

function easelSetup() {
	var stage = new createjs.Stage("myCanvas2");
	//setupCard(stage);
	//bitmapCorrectSetup1(stage);
	bitmapCorrectSetup2b(stage);
	setupStatic(stage);
	bitmapErrorSetup1b(stage);
	bitmapErrorSetup2b(stage);
	bitmapErrorSetup3b(stage);
	bitmapErrorSetup4b(stage);
	bitmapErrorSetup5b(stage);
}