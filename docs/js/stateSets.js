const colorPrefs = {
	"shapeColorDefault" : "d9880e",
	"shapeColorPlaced" : "ba1110",
	"borderColorShow" : "ababab",
	"borderColorHide" : "fefee4",
};

const shapeColors = {
	"4d5c75" : [4,6,9,10,13,14,15,18,25,26,29,38,50,52,54], // dark blue
	"7b91b7" : [2,7,8,12,24,39,48,49], // gfa light blue
	"eecd00" : [17,19,23,27,30,31,34,35,42,45,47,51], // gfa yellow
	"d9880e" : [1,3,5,11,16,21,28,32,36,37,41,43,44,46,53], // dark orange
};

const notForPuzzle = [20,22,33,40,42]; // tiny island states
const largeStatesOrLongNames = [2,3,23,27,28,32,34,45,47,51];

const stateNames = [];
stateNames[0] = "Afrikanische Union";
stateNames[1] = "Ägypten";
stateNames[2] = "Algerien";
stateNames[3] = "Angola";
stateNames[4] = "Äquatorialguinea";
stateNames[5] = "Äthiopien";
stateNames[6] = "Benin";
stateNames[7] = "Botswana";
stateNames[8] = "Burkina Faso";
stateNames[9] = "Burundi";
stateNames[10]= "Dschibuti";
stateNames[11]= "Elfenbeinküste";
stateNames[12]= "Eritrea";
stateNames[13]= "Eswatini";
stateNames[14]= "Gabun";
stateNames[15]= "Gambia";
stateNames[16]= "Ghana";
stateNames[17]= "Guinea";
stateNames[18]= "Guinea-Bissau";
stateNames[19]= "Kamerun";
stateNames[20]= "Kap Verde";
stateNames[21]= "Kenia";
stateNames[22]= "Komoren";
stateNames[23]= "Demokratische Republik Kongo";
stateNames[24]= "Republik Kongo";
stateNames[25]= "Lesotho";
stateNames[26]= "Liberia";
stateNames[27]= "Libyen";
stateNames[28]= "Madagaskar";
stateNames[29]= "Malawi";
stateNames[30]= "Mali";
stateNames[31]= "Marokko mit Westsahara";
stateNames[32]= "Mauretanien";
stateNames[33]= "Mauritius";
stateNames[34]= "Mosambik";
stateNames[35]= "Namibia";
stateNames[36]= "Niger";
stateNames[37]= "Nigeria";
stateNames[38]= "Ruanda";
stateNames[39]= "Sambia";
stateNames[40]= "São Tomé und Príncipe";
stateNames[41]= "Senegal";
stateNames[42]= "Seychellen";
stateNames[43]= "Sierra Leone";
stateNames[44]= "Simbabwe";
stateNames[45]= "Somalia mit Somaliland";
stateNames[46]= "Südafrika";
stateNames[47]= "Sudan";
stateNames[48]= "Südsudan";
stateNames[49]= "Tansania";
stateNames[50]= "Togo";
stateNames[51]= "Tschad";
stateNames[52]= "Tunesien";
stateNames[53]= "Uganda";
stateNames[54]= "Zentralafrikanische Republik";

const coordinates = [];
coordinates[0] = { transform : "translate(0,0)", targetX : 0, targetY : 0 };
coordinates[1] = { transform : "translate(-795,-90)", targetX : 793, targetY : 39 };
coordinates[2] = { transform : "translate(-320,-45)", targetX : 319, targetY : -6 };
coordinates[3] = { transform : "translate(-590,-805)", targetX : 588, targetY : 754 };
coordinates[4] = { transform : "translate(-455,-555)", targetX : 454, targetY : 504 };
coordinates[5] = { transform : "translate(-1010,-410)", targetX : 1009, targetY : 359 };
coordinates[6] = { transform : "translate(-305,-410)", targetX : 304, targetY : 359 };
coordinates[7] = { transform : "translate(-710,-1020)", targetX : 709, targetY : 969 };
coordinates[8] = { transform : "translate(-235,-355)", targetX : 234, targetY : 304 };
coordinates[9] = { transform : "translate(-825,-650)", targetX : 823, targetY : 599 };
coordinates[10]= { transform : "translate(-1050,-355)", targetX : 1049, targetY : 304 };
coordinates[11]= { transform : "translate(-160,-445)", targetX : 159, targetY : 395 };
coordinates[12]= { transform : "translate(-990,-290)", targetX : 989, targetY : 239 };
coordinates[13]= { transform : "translate(-825,-1090)", targetX : 824, targetY : 1038 };
coordinates[14]= { transform : "translate(-485,-600)", targetX : 485, targetY : 549 };
coordinates[15]= { transform : "translate(0,-320)", targetX : 0, targetY : 269 };
coordinates[16]= { transform : "translate(-240,-440)", targetX : 239, targetY : 390 };
coordinates[17]= { transform : "translate(-60,-390)", targetX : 59, targetY : 340 };
coordinates[18]= { transform : "translate(-1,-355)", targetX : 0, targetY : 305 };
coordinates[19]= { transform : "translate(-500,-460)", targetX : 499, targetY : 409 };
coordinates[20]= { transform : "translate(155,-270)", targetX : 0, targetY : 0 };
coordinates[21]= { transform : "translate(-970,-580)", targetX : 970, targetY : 529 };
coordinates[22]= { transform : "translate(-1080,-820)", targetX : 0, targetY : 0 };
coordinates[23]= { transform : "translate(-675,-660)", targetX : 673, targetY : 609 };
coordinates[24]= { transform : "translate(-550,-600)", targetX : 549, targetY : 549 };
coordinates[25]= { transform : "translate(-765,-1140)", targetX : 764, targetY : 1089 };
coordinates[26]= { transform : "translate(-85,-460)", targetX : 84, targetY : 409 };
coordinates[27]= { transform : "translate(-585,-90)", targetX : 584, targetY : 39 };
coordinates[28]= { transform : "translate(-1110,-960)", targetX : 1109, targetY : 910 };
coordinates[29]= { transform : "translate(-890,-840)", targetX : 889, targetY : 789 };
coordinates[30]= { transform : "translate(-200,-255)", targetX : 199, targetY : 203 };
coordinates[31]= { transform : "translate(-135,-50)", targetX : 134, targetY : -1 };
coordinates[32]= { transform : "translate(-80,-190)", targetX : 79, targetY : 139 };
coordinates[33]= { transform : "translate(-1285,-1000)", targetX : 1284, targetY : 949 };
coordinates[34]= { transform : "translate(-910,-930)", targetX : 909, targetY : 878 };
coordinates[35]= { transform : "translate(-590,-1010)", targetX : 588, targetY : 959 };
coordinates[36]= { transform : "translate(-420,-260)", targetX : 419, targetY : 209 };
coordinates[37]= { transform : "translate(-420,-410)", targetX : 420, targetY : 359 };
coordinates[38]= { transform : "translate(-820,-620)", targetX : 819, targetY : 570 };
coordinates[39]= { transform : "translate(-775,-840)", targetX : 774, targetY : 790 };
coordinates[40]= { transform : "translate(-395,-560)", targetX : 393, targetY : 509 };
coordinates[41]= { transform : "translate(-10,-315)", targetX : 9, targetY : 264 };
coordinates[42]= { transform : "translate(-1170,-720)", targetX : 0, targetY : 0 };
coordinates[43]= { transform : "translate(-40,-415)", targetX : 40, targetY : 364 };
coordinates[44]= { transform : "translate(-800,-950)", targetX : 800, targetY : 899 };
coordinates[45]= { transform : "translate(-1120,-490)", targetX : 1119, targetY : 440 };
coordinates[46]= { transform : "translate(-710,-1120)", targetX : 709, targetY : 1069 };
coordinates[47]= { transform : "translate(-820,-290)", targetX : 819, targetY : 239 };
coordinates[48]= { transform : "translate(-815,-440)", targetX : 814, targetY : 389 };
coordinates[49]= { transform : "translate(-910,-710)", targetX : 910, targetY : 660 };
coordinates[50]= { transform : "translate(-280,-410)", targetX : 280, targetY : 359 };
coordinates[51]= { transform : "translate(-620,-300)", targetX : 619, targetY : 249 };
coordinates[52]= { transform : "translate(-450,50)", targetX : 449, targetY : -100 };
coordinates[53]= { transform : "translate(-870,-560)", targetX : 870, targetY : 509 };
coordinates[54]= { transform : "translate(-650,-460)", targetX : 649, targetY : 408 };

const stateSetX0 = [2,4,6,8,11,14,15,16,17,18,19,24,26,27,30,31,32,36,37,40,41,43,50,52];
const stateSetX1 = [1,3,5,7,9,10,12,13,21,23,24,25,27,28,29,33,34,35,38,39,44,45,46,47,48,49,51,53,54];

const stateSetY0 = [1,2,4,5,6,8,10,11,12,15,16,17,18,19,26,27,30,31,32,36,37,40,41,43,45,47,48,50,51,52,54];
const stateSetY1 = [3,4,7,9,13,14,21,23,24,25,28,29,33,34,35,38,39,40,44,46,49,53];
const stateSetY1plus = [45,48,54];
