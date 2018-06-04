
	// combi error
	// 声韵母组合错误，请跟换卡片。
	// \u58f0\u97f5\u6bcd\u7ec4\u5408\u9519\u8bef\uFF0C\u8bf7\u8ddf\u6362\u5361\u7247\u3002
	// wrong tone position
	// 音调卡位置错误，请跟换卡片。
	// \u97f3\u8c03\u5361\u4f4d\u7f6e\u9519\u8bef\uFF0C\u8bf7\u8ddf\u6362\u5361\u7247\u3002
	// no corresponding tone for combi
	// 音调不符合拼音，请跟换卡片。
	// \u97f3\u8c03\u4e0d\u7b26\u5408\u62fc\u97f3\uFF0C\u8bf7\u8ddf\u6362\u5361\u7247\u3002
	// yunmu shengmu swapped
	// 声韵母位置错误，请跟换位置。
	// \u58f0\u97f5\u6bcd\u4f4d\u7f6e\u9519\u8bef\uFF0C\u8bf7\u8ddf\u6362\u4f4d\u7f6e\u3002
	//correct1 恭喜你，你答对了！
	//correct0 声韵母组合对了，请放音调卡。


// missing font dont use this anymore
	function printError(ctx, cw, ch, state) {

		drawCenterLine(ctx, cw, ch);
		//drawSoundIcon(ctx, cw, ch, false);
		soundIconActive = false;

		var fontSize = 20 * scaleAnchorX
		ctx.font = fontSize+"px kaiti";

		//var rect = ctx.canvas.getBoundingClientRect();
		var textWidth = ctx.measureText("\u58f0\u97f5\u6bcd\u7ec4\u5408\u9519\u8bef\uFF0C\u8bf7\u66f4\u6362\u5361\u7247\u3002").width;
		//console.log(rect.width + " " + rect.height);
		var svg = null;
		
		ctx.fillStyle = 'red';
		var centerTextColor = 'black';


		// if (state == DisplayStates.ErrorCombi) { // combi error
		// 	ctx.fillText("\u58f0\u97f5\u6bcd\u7ec4\u5408\u9519\u8bef\uFF0C\u8bf7\u66f4\u6362\u5361\u7247\u3002", cw * 0.5 - textWidth * 0.5, ch * 0.45); 
		// 	svg = document.getElementById("error0");
		// 	centerTextColor = 'red';
		// }
		// else if (state == DisplayStates.ErrorTonePos) { // wrong tone position
		// 	ctx.fillText("\u97f3\u8c03\u5361\u4f4d\u7f6e\u9519\u8bef\uFF0C\u8bf7\u66f4\u6362\u5361\u7247\u3002", cw * 0.5 - textWidth * 0.5, ch * 0.45);
		// 	svg = document.getElementById("error1");
		// 	//ctx.drawImage(svg, 0, 0, 200, 100);
		// 	centerTextColor = 'red';
		// }
		// else if (state == DisplayStates.ErrorNoTone) {// no corresponding tone for combi
		// 	ctx.fillText("\u97f3\u8c03\u4e0d\u7b26\u5408\u62fc\u97f3\uFF0C\u8bf7\u66f4\u6362\u5361\u7247\u3002", cw * 0.5 - textWidth * 0.5, ch * 0.45);
		// 	svg = document.getElementById("error2");
		// 	//ctx.drawImage(svg, 0, 0, 200, 100);
		// 	centerTextColor = 'red';
		// }
		// else if (state == DisplayStates.ErrorSwapped) { // yunmu shengmu swapped
		// 	ctx.fillText("\u58f0\u97f5\u6bcd\u4f4d\u7f6e\u9519\u8bef\uFF0C\u8bf7\u66f4\u6362\u4f4d\u7f6e\u3002", cw * 0.5 - textWidth * 0.5, ch * 0.45);
		// 	svg = document.getElementById("error3");
		// 	//ctx.drawImage(svg, 0, 0, 200, 100);
		// 	centerTextColor = 'red';
		// }else if (state == DisplayStates.Neutral) {
		// 	centerTextColor = 'black';
		// }
		// else if (state == DisplayStates.Correct1) {
		// 	ctx.fillStyle = 'green';
		// 	var textWidth = ctx.measureText("\u58f0\u97f5\u6bcd\u7ec4\u5408\u5BF9\u4E86\uFF0C\u8bf7\u653E\u97f3\u8c03\u5361\u3002").width;
		// 	ctx.fillText("\u58f0\u97f5\u6bcd\u7ec4\u5408\u5BF9\u4E86\uFF0C\u8bf7\u653E\u97f3\u8c03\u5361\u3002", cw * 0.5 - textWidth * 0.5, ch * 0.45);
		// 	svg = document.getElementById("correct0");
		// 	centerTextColor = 'green';
		// } else if (state == DisplayStates.Correct2) {
		// 	ctx.fillStyle = 'green';
		// 	var textWidth = ctx.measureText("\u606D\u559C\u4F60\uFF0C\u4F60\u7B54\u5BF9\u4E86\uFF01").width;
		// 	ctx.fillText("\u606D\u559C\u4F60\uFF0C\u4F60\u7B54\u5BF9\u4E86\uFF01", cw * 0.5 - textWidth * 0.5, ch * 0.45); 
		// 	svg = document.getElementById("correct1");
		// 	centerTextColor = 'green';
		// }

		drawCenterText(ctx, cw, ch, centerTextColor, displayText);

		// if (state != DisplayStates.Invalid && state != DisplayStates.Neutral) {
		// 	//console.log(state);
		// 	var bBox = svg.getBBox();
		// 	var egWidth = bBox.width;
		// 	var egHeight = bBox.height;

		// 	//var widthRatio = (egWidth / cw) * 2.5;
		// 	var widthRatio = 0.4;
		// 	var heightRatio = (widthRatio / egWidth) * egHeight;

		// 	ctx.drawImage(svg, (cw * 0.5) - (cw * widthRatio * 0.5), (ch * 0.18) - (cw * heightRatio * 0.5), cw * widthRatio, cw * heightRatio);	
		// 	//errorCode = -1;
		// }

		displayState = DisplayStates.Invalid;
	}

	function mappingFunction() {

		validCombi["n"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ian", "iang", "iao", "ie", "in", "ing", "iu", "ong", "ou", "u", "uan", "un", "uo", "v", "ve"]; // ng is taken out
		validCombi["l"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "eng", "i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iu", "ong", "ou", "u", "uan","un", "uo", "v", "ve"];
		validCombi["d"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ia", "ian", "iao", "ie", "ing", "iu", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi["g"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["h"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["sh"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["t"] = ["ai", "an", "ang", "ao", "a", "e", "eng", "i", "ian", "iao", "ie", "ing", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi["zh"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["m"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "iu", "o", "ou", "u"];
		validCombi["k"] = ["ai", "an", "ang", "ao", "a", "e", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["ch"] = ["ai", "an", "ang", "ao", "a", "e", "eng", "i", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"];
		validCombi["p"] = ["ai", "an", "ang", "ao", "a", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "o", "ou", "u"];
		validCombi["z"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi["c"] = ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi["b"] = ["ai", "an", "ang", "ao", "a", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "o", "u"];
		validCombi["s"] = ["ai", "an", "ang", "ao", "a", "e", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi["q"] = ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iang", "iong", "iu", "u", "uan", "ue", "un"];
		validCombi["y"] = ["an", "ang", "ao", "a", "e", "i", "in", "ing", "o", "ong", "ou", "u", "uan", "ue", "un"];
		validCombi["j"] = ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iong", "iu", "u", "uan", "ue", "un"];
		validCombi["x"] = ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iong", "iu", "u", "uan", "ue", "un"];
		validCombi["r"] = ["an", "ang", "ao", "e", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"];
		validCombi[""] = ["ao", "ai", "an", "ang", "ao", "e", "ei", "en", "eng", "er", "o", "ou", "ng"]; // ng added
		validCombi["f"] = ["an", "ang", "a", "ei", "en", "eng", "o", "ou", "u"];
		validCombi["w"] = ["ai", "an", "ang", "a", "ei", "en", "eng", "o", "u"];

		// verify that there is no typo in validCombi
		
		/// typo check 
		/*
		var result = true;
		shengmu.forEach(function(x) { 
			//console.log(validCombi[x]); 
			validCombi[x].forEach(function(y) {

				//result = result && yunmu.includes(y);
				//result = result && (yunmu.indexOf(y) != -1);

				if (typeof Array.prototype.includes === "function") { 
				    result = result && yunmu.includes(y);

				} else {
					result = result && (yunmu.indexOf(y) != -1);
				}
			}); 
		});

		// if true no typo in validCombi
		//console.log(result);
		*/
	}