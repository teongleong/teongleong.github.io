
const validButNoTone = ["an2", "ang3", 
					  "bang2", "ben2", "bian2", "biao2", "bin2", "bin3", "bing2",
					  "ca2", "ca4", "cang3", "cang4", "ce1", "ce2", "ce3",  "cei1", "cei2", "cei3", 
					  "cen3", "cen4", "ceng3", "che2", "chua2", "chua3", "chua4", "chui3", "chui4", "chun4", 
					  "chuo2", "chuo3", "cong3", "cong4", "cou1", "cou2", "cou3", "cu3", "cuan3", "cui2",
					  "dai2", "dan2", "dang2", "de3", "dei2", "dei4", "den1", "den2", "den3", "deng2", 
					  "dia1",  "dia2",  "dia4", "dian2", "diao2", "die3", "die4", "ding2",
					  "diu2", "diu3", "diu4", "dong2", "dou2", "duan2", "dui2", "dui3", "dun2", 
					  "en2", "en3", "eng2",  "eng3",  "eng4",  "er1", 
					  "fo1", "fo3", "fo4", "fou1", "fou2", "fou4", 
					  "gai2", "gan2", "gang2", "gao2", "gei1", "gei2", "gei4", "geng2", "gong2", "gou2", 
					  "gu2", "gua2", "guai2", "guan2", "guang2", "gui2", "gui4", 
					  "gai2", "gan2", "gang2", "gao2", "gei1",  "gei2",  "gei4", "geng2", 
					  "gong2", "gou2", "gu2", "gua2", "guai2", "guan2", "guang2", "gui2", "gun1", "gun2",
					  "hang3", "he3", "hei2", "hei3", "hei4", "hen1", "heng3", "hua3", "huai1", "huai3", "hun3", "jian2", "jiang2",
					  "jin2", "jing2", "jiong2", "jiong4", "jiu2", "juan2", "jun2", "jun3",
					  "ka2", "ka4", "kai2", "kan2", "kang3", "kao2", "kei2", "kei3", "kei4", "ken1", "ken2", "keng2", "keng3", "keng4", "kong2",
					  "kou2", "ku2", "kua2", "kuai1", "kuai2", "kuan2", "kuan4", "kun2", "kuo1", "kuo2", "kuo3",
					  "lai1", "lai3", "lan1", "le2", "le3", "lia1", "lia2", "lia4", "lian1", "liang1", "lie2", "ling1", "lv1", "luan1", "lve1", "lve2", "lve3", 
					  "m3", "mai1", "mang4", "mei1", "men3", "mian1", "mie2", "mie3", "min1", "min4", "ming1", "miu1", "miu2", "miu3", "mou4", "mu1",
					  "n1", "nai1", "nai2", "ne1", "ne3", "nei1", "nei2", "nen1", "nen2", "nen3", "neng1", "neng3", "neng4", "ng1", "niang1", "niang3", "niao1", "niao2", 
					  "nie3", "nin1", "nin3", "nin4", "ning1", "nong1", "nong3", "nou1", "nou2", "nou3", "nu1", "nv1", "nv2", "nuan1", "nuan2", "nuan4", 
					  "nve1", "nve2", "nve3", "nun1", "nun3", "nun4", "nuo1", "nuo3", 
					  "pa3", "pan3", "pei3", "peng3", "pie2", "ping3", "ping4", "pou4", 
					  "qiong1", "qiong3", "qiong4", "qiu4", "que3", "qun3", "qun3", "qun4", 
					  "ran1", "ran4", "rao1", "re1", "re2", "ren1", "reng3", "reng4", "ri1", "ri2", "ri3", "rong1", "rong4", "rou1", "rou3", "ru1",
					  "rua1", "rua3", "rua4", "ruan1", "ruan4", "rui1", "run1", "run3", "ruo1", "ruo3", 
					  "sa2", "sai2", "sai3", "san2", "sang2", "sao2", "se1", "se2", "se3", "sen2", "sen3", "sen4", "seng2", "seng3", "seng4", "shai2", "shan2", 
					  "shang2", "shei1", "shei3", "shei4", "shua2", "shuai2", "shuan2", "shuan3", "shuang2", "shuang4", "shui1", "shun1", "shun2",
					  "shuo2", "shuo3", "si2", "sou2", "su3", "suan2", "suan3", "sun2", "sun4", "suo2", "suo4", 
					  "ta2", "te1", "te2", "te3", "tei2", "tei3", "tei4", "teng3", "teng4", "tie2", 
					  "wai2", "weng2", "wo2", 
					  "xia3", "xiong3", "xiu2", "xun3",
					  "yo2", "yo3", "yo4", "yue2", 
					  "za4", "zai2", "zang2", "ze1", "ze3", "zei1", "zei3", "zei4", "zen1", "zen2", "zeng2", "zeng3", "zhan2", "zhang2", "zhei1", "zhei2", "zhei3",
					  "zhen2", "zheng2", "zhong2", "zhua2", "zhua4", "zhuai2", "zhuan2", "zhuang2", "zhui2", "zhui3", "zhun2", "zhun4", "zhuo3", "zhuo4", "zi2",
					  "zong2", "zou2", "zu4", "zuan2", "zui2", "zun2"
					  ];

const markerMapping = ["tone1", "tone2", "tone3", "tone4",
						"iang", "iong", "uang",
						"ang", "eng", "ong", "uai", "uan", 
						"ian", "iao", "ing", 
						"ia", "ie", "in", "ai", "an", 
						"ao", "ei", "en", "er", "iu", // er card does not exist
						"ou", "ua", "ue", "ui", "un", 
						"uo", "ve",  // ve card does not exist
						"a", "e", "i", "o", "u", "v", 
						"g", // 39 
						"b", "c", "ch", "d", "f", "ng", "h", "j", "k", "l", // changed g to ng (since there is no ng anyway)
						"m", "n", "p", "q", "r", "s", "sh", "t", "w", "x",
						"y", "z", "zh"];

const toneMarkerTarget = [-1, -1, -1, -1, 
						71, 70, 59,
						76, 75, 75, 59, 59, 
						71, 71, 82.5, 
						71, 70, 82.5, 76, 76, 
						76, 75, 75, 75, 70.5,
						75, 59, 58, 64, 76.5, 
						58.5, 57.8, 
						76, 75, 82.5, 75, 76.5, 76.5, 
						78.6];
					
const yunmuVowelOnSecond = ["ia", "ie", "iu", "ua", 
							"ue", "ui", "uo", "ve", "uai", 
							"iao", "iong", "uan", "uang",
							"ian", "iang"];
//var validCombi = [];
const validCombi = 
{
	"n": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ian", "iang", "iao", "ie", "in", "ing", "iu", "ong", "ou", "u", "uan", "un", "uo", "v", "ve"],
	"l": ["ai", "an", "ang", "ao", "a", "e", "ei", "eng", "i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iu", "ong", "ou", "u", "uan","un", "uo", "v", "ve"],
	"d": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ia", "ian", "iao", "ie", "ing", "iu", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"g": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"h": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"sh": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"t": ["ai", "an", "ang", "ao", "a", "e", "eng", "i", "ian", "iao", "ie", "ing", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"zh": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"m": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "iu", "o", "ou", "u"],
	"k": ["ai", "an", "ang", "ao", "a", "e", "en", "eng", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"ch": ["ai", "an", "ang", "ao", "a", "e", "eng", "i", "ong", "ou", "u", "ua", "uai", "uan", "uang", "ui", "un", "uo"],
	"p": ["ai", "an", "ang", "ao", "a", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "o", "ou", "u"],
	"z": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"c": ["ai", "an", "ang", "ao", "a", "e", "ei", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"b": ["ai", "an", "ang", "ao", "a", "ei", "en", "eng", "i", "ian", "iao", "ie", "in", "ing", "o", "u"],
	"s": ["ai", "an", "ang", "ao", "a", "e", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"q": ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iang", "iong", "iu", "u", "uan", "ue", "un"],
	"y": ["an", "ang", "ao", "a", "e", "i", "in", "ing", "o", "ong", "ou", "u", "uan", "ue", "un"],
	"j": ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iong", "iu", "u", "uan", "ue", "un"],
	"x": ["i", "ia", "ian", "iang", "iao", "ie", "in", "ing", "iong", "iu", "u", "uan", "ue", "un"],
	"r": ["an", "ang", "ao", "e", "en", "eng", "i", "ong", "ou", "u", "uan", "ui", "un", "uo"],
	"": ["ao", "ai", "an", "ang", "ao", "e", "ei", "en", "eng", "er", "o", "ou", "ng"], // ng added
	"f": ["an", "ang", "a", "ei", "en", "eng", "o", "ou", "u"],
	"w": ["ai", "an", "ang", "a", "ei", "en", "eng", "o", "u"]
}

var prevSoundName = "";
var soundName = "";

// in canvas ratio
var soundIconPosX = 0.5;
var soundIconPosY = 0.8 + 0.06;
var soundIconLength = 0.05;
var soundIconActive = false;

var toneID = -1;
var yunmuID = -1;
var shengmuID = -1;

var tonePosCheckHistory = [];
var validCheckHistory = [];
var ysSpaceCheckHistory = [];

var bufferSize = 60;
var debugMode = false;

var errorCode = -1;

var yunmuSlot = [];
var shengmuSlot = [];
var toneSlot = [];

var markerTracked = {};
var history = [];

//var imageDir = "images/";	

var rendererCanvas = null;