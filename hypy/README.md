# HYPYCardReader
A web application that teaches hanyu pinyin pronunciation and proper tone placement with Augmented Reality and cards.

## Setup choices
1. Python http server  
In a terminal  
cd `<dir of index.html`>  
python -m http.server  
Something like  
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...  
should come up, note the `<number`> after port  
In a browser (tested on chrome) go to localhost:8000  
Press allow for browser to access webcam. It should run now.

2. wamp  
Copy the root to <wamp_root>/www/<project_name>  
In a browser (tested on chrome) go to localhost/<project_name>  
Press allow for browser to access webcam. It should run now.

3. host it on a https url

## Dependencies
jsartoolkit tested on commit (b02f2b8)  
createjs (for canvas rendering) (easeljs 0.8.2 and tweenjs 0.6.2 specifically)

## Marker
Find the marker in doc/marker_matrix.pdf in this repository  
The example works on the first 3 marker (namely 0, 1, 2) 
Markers are positioned as follows in the pdf...
0, 1, 2, 3, 4, 5,
6, 7, 8, 9, 10, 11,
...

## Terminologies
hanyu pinyin (hypy) is a way to capture the pronunciation of a Chinese character. It is defined by a shengmu, yunmu and tone.  
shengmu refers to the prefix of the hypy  
yunmu refers to the suffix of the hypy  
tone refers to the intonation of the Chinese word (can be tone 1 2 3 or 4)

## States
#Correct States
Hanyu pinyin (hypy) Cards with shengmu and yunmu would be identified with the help of the markers.
Depending on whether 
1. their combination is a valid sound in the Chinese dictionary and (Correct state 1)
2. whether the tone is placed on top of the correct letter on the yunmu. 
The sound of the pinyin will play (Correct state 2)

#Error States
1. Not a valid shengmu yunmu combination - shengmu and yunmu combination does not correspond to a word in the Chinese dictionary.
2. Invalid tone - given a valid shengmu yunmu combination, it is possible that one or more of the four possible tones does not correspond to a word in the Chinese dictionary.
3. Tone card position is not placed on the right vowel (refer to the tone position section for the rule)
4. Swapped - yunmu card is placed before (left of) the shengmu card
5. Shengmu yunmu cards placed too far apart

## Tone position
1. When 'a' exist always choose to put on top of it
2. Else if 'e' or 'o' exist, pick it (e and o does not appear together ever)
3. Else choose 'i' or 'u' if (i and u does not both appear together)
4. if 'iu' is present choose u 
5. if 'ui' is present choose i

## Supported browsers
[Windows]  
Edge version: 14.14393  
Chrome Version 63.0.3239  
Firefox version: 57  
[macOS]  
Safari 8.0.8 on mac 10.10.5  
Firefox 57.0.4  
[iOS] 11.2.1 Safari  
[Android]  
Chrome 63.0.3239.111 Android 7.1.1

## Unsupported browsers
IE 11 not working  
Chrome 63.0.3239.132 not working (on macOS) (error creating webgl context)

priority:  
shengmu + yunmu in correct order  
shengmu + yunmu placed at correct distance from each other  
shengmu + yunmu is a valid combination  
shengmu + yunmu + tone is a valid combination  
shengmu + yunmu + tone - tone is placed above correct letter

note:  
yunmu standalone may be valid but it is not supported now, hence the priority is not listed now
