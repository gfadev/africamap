var dlg, isTouchDevice = false, wRatio = 1, currentID = 0, qID = 0, toPickFrom = [], lineup = [], qToSolve = 0, correctAnswers = 0, usingQasC = 0;
const statesPlaced = [], questionsAnswered = [];

const shiftMap = {
	svgmap : document.getElementById("svgAfrica"),
	origWidth : 1525,
	origHeight : 1440,
	origRatio : 1525/1440,
	renderedScale : 1,
	mode : 'none',
	x : 0,
	y : 0,
	toggle : 0,
	storeTop : 0,
	storeLeft : 0,
	pickFromCompleteSet : [],
	iconRects : document.getElementById('moveButtonIcon').getElementsByTagName( 'rect' ),
	iconRectX0 : document.getElementById('x0'),
	iconRectX1 : document.getElementById('x1'),
	iconRectY0 : document.getElementById('y0'),
	iconRectY1 : document.getElementById('y1'),
	iconRectXy0 : document.getElementById('xy0'),
	iconRectXy1 : document.getElementById('xy1'),
	iconRectXy2 : document.getElementById('xy2'),
	nav : document.getElementById('nav'),
	
	initialize : function() {
		this.pickFromCompleteSet = []; qToSolve = 0;
		function addState( id, completeSet ) {
			if ( id > 0 && !notForPuzzle.includes( id ) && id in quizQuestions && !completeSet.includes( id ) ) {
				completeSet.push( id );				
				if ( typeof quizQuestions[id]["q"] != "undefined" && typeof quizQuestions[id]["a"] != "undefined" ) qToSolve++;
			}		
		}	
		for ( let id in stateNames ) addState( parseInt( id ), this.pickFromCompleteSet );
		return this.pickFromCompleteSet.length;
	},

	setToPickFrom : function( mode, toggle ) {
		var pickfrom = [];	
		function deleteNotForPuzzle( id ) {
			return !notForPuzzle.includes( id );
		}

		function addStateCheckIfBelow( id ) {
			let stateID = 'stateID' + id;
			let renderedDimensions = document.getElementById( stateID ).getBoundingClientRect();
			let top = renderedDimensions.top;
			if ( top > -10 && !pickfrom.includes( id )) {
				pickfrom.push( id );
			}
		}	
	
		function deleteStateIfBelow( id ) {
			let stateID = 'stateID' + id;
			let renderedDimensions = document.getElementById( stateID ).getBoundingClientRect();
			let bottom = renderedDimensions.bottom;
			return bottom < window.innerHeight + 10;
		}

		function deleteStateIfAbove( id ) {
			let stateID = 'stateID' + id;
			let renderedDimensions = document.getElementById( stateID ).getBoundingClientRect();
			let top = renderedDimensions.top;
			return top > -10;
		}
		
		for ( let index in this.iconRects ) {
			if ( typeof this.iconRects[index] == "object" ) this.iconRects[index].setAttribute( 'style', 'stroke-opacity: 0' );
		}

		switch( mode ) {
			case "none":			
				pickfrom = this.pickFromCompleteSet.concat();
				break;
			case "x":
				if ( toggle == 0 ) {
					pickfrom = stateSetX0.concat();
					this.iconRectX0.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', '' );
				} else if ( toggle == 1 ) {
					pickfrom = stateSetX1.concat();
					this.iconRectX1.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', 'bottomright' );
				} else {
					pickfrom = this.pickFromCompleteSet.concat();
					this.nav.setAttribute( 'class', '' );
				}
				break;
			case "y":
				if ( toggle == 0 ) {
					pickfrom = stateSetY0.concat();
					this.iconRectY0.setAttribute( 'style', 'stroke-opacity: 1' );
					if ( wRatio > 1.5 ) {
						this.nav.setAttribute( 'class', 'topright' );
					} else {
						this.nav.setAttribute( 'class', '' );
					}
				} else if ( toggle == 1 ) {
					pickfrom = stateSetY1.concat();
					stateSetY1plus.forEach( addStateCheckIfBelow );
					this.iconRectY1.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', '' );
				} else {
					pickfrom = this.pickFromCompleteSet.concat();
					this.nav.setAttribute( 'class', '' );
				}
				break;
			case "xy":
				if ( toggle == 0 ) {
					pickfrom = stateSetX0.concat();
					this.iconRectXy0.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', '' );
				} else if ( toggle == 2 ) {
					pickfrom = stateSetX1.concat().filter( deleteStateIfBelow );		
					this.iconRectXy2.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', 'topright' );
				} else if ( toggle == 1 ) {
					pickfrom = stateSetX1.concat().filter( deleteStateIfAbove );					
					this.iconRectXy1.setAttribute( 'style', 'stroke-opacity: 1' );
					this.nav.setAttribute( 'class', 'bottomright' );
				} else {
					pickfrom = this.pickFromCompleteSet.concat();
					this.nav.setAttribute( 'class', '' );
				}
				break;
			default:
				pickfrom = this.pickFromCompleteSet.concat();
		}
		return pickfrom.filter( deleteNotForPuzzle );
	},

	move : function() {	
		dlg.hidePrompt();
	
		if ( this.toggle == 2 ) {
			this.svgmap.style.top = - this.y + "px";
			this.svgmap.style.left = - this.x + "px";
			this.toggle = 1;	
		} else if ( this.toggle == 1 ) {
			this.svgmap.style.top = this.storeTop;
			this.svgmap.style.left = this.storeLeft;
			this.toggle = 0;
		} else switch ( this.mode ) {
			case "none":
				break;
			case "x":
				this.storeLeft = this.svgmap.style.left;

				this.svgmap.style.left = - this.x + "px";
				this.toggle = 1;
				break;
			case "y":
				this.storeTop = this.svgmap.style.top;

				this.svgmap.style.top = - this.y + "px";
				this.toggle = 1;
				break;
			case "xy":
				this.storeTop = this.svgmap.style.top;
				this.storeLeft = this.svgmap.style.left;

				this.svgmap.style.left = - this.x + "px";		
				this.toggle = 2;
				break;
			default:
		} 
		toPickFrom = this.setToPickFrom( this.mode, this.toggle );
		lineup = [];
		dlg.view = 'reset';
		dlg.controlButtonAction = 'next';
	}
}


const sqr = {
	div : document.getElementById("sqr"),
	g : document.querySelector("#sqr g"),
	renderedSize : 400,	
	removeShape : function() {
		while ( this.g.hasChildNodes() ) this.g.removeChild( this.g.firstChild );
	},
	hideSquare : function() {
		this.removeShape();
		this.div.style.display = "none";
		this.div.style.opacity = 0;	
		this.div.style.border = 'none';
		this.div.style.backgroundColor = 'transparent';
	}
}


function checkDependencies( id ) {
	if ( quizQuestions[id]["dependenciesOR"] == "" ) {
		return true;
	} else {
		for ( let key in quizQuestions[id]["dependenciesOR"] ) {
			let checkThis = parseInt(quizQuestions[id]["dependenciesOR"][key]);
			if ( statesPlaced.includes(checkThis) ) {
				if ( typeof quizQuestions[id]["dependencyAND"] == "undefined" ) {
					return true;
				} else {
					let checkThat = parseInt(quizQuestions[id]["dependencyAND"][0]);
					if ( statesPlaced.includes(checkThat) ) {
						return true;
					}
				}
			}
		}
	}
	return false;
}


function mostNeeded( toPickFrom ) {
	const needed = [];	
	function countNeedOccur( id ) {
		if ( needed[id] === undefined ) {
			needed[id] = { "id":id, "occurrence":1 };
		} else {
			needed[id]["occurrence"] = needed[id]["occurrence"] + 1;				
		}
	}	
	function lookForNeeded( key ) {
		key = parseInt(key);
		if ( !statesPlaced.includes(key) ) {
			if ( key in quizQuestions && quizQuestions[key]["dependenciesOR"].length > 0 ) {
				quizQuestions[key]["dependenciesOR"].forEach( countNeedOccur );
				if ( quizQuestions[key]["dependencyAND"] !== undefined ) {
					quizQuestions[key]["dependencyAND"].forEach( countNeedOccur );
				}					
			}
		}
	}
	toPickFrom.forEach( lookForNeeded );
	needed.sort( function(a, b) { return b.occurrence - a.occurrence } );
	return needed;
}


function lineUpQCC() {
	function randomlyPickFromArray( arr ) {
		let id = 0;
		if ( arr.length > 1 ) {
			const j = Math.floor( Math.random() * (arr.length) );
			id = arr[j];
		} else if ( arr.length == 1 ) {
			id = arr[0];
		} else {
			return false;
		}
		var index = arr.indexOf( id );
		if ( index !== -1 ) arr.splice( index, 1 )
		return id;
	}
	let possibleQ = [], possibleC = [];
	for ( let key in quizQuestions ) {
		key = parseInt(key);
		if ( key > 0 && !statesPlaced.includes(key) && toPickFrom.includes(key) && checkDependencies(key) === true ) {
			if ( typeof quizQuestions[key]["q"] == "undefined" || typeof quizQuestions[key]["a"] == "undefined" ) {
				possibleC.push( key );				
			} else if ( !questionsAnswered.includes(key) ) {
				possibleQ.push( key );
			}
		}
	}
	for ( let key in questionsAnswered ) {
		key = parseInt(key);
		let id = questionsAnswered[key];
		if ( !statesPlaced.includes(id) && toPickFrom.includes(id) && !(id in lineup) ) {
			possibleC.push( id );
		}
	}
	let qcc = [];
	qcc[0] = randomlyPickFromArray( possibleQ );		
	if ( possibleC.length > 1 ) {		
		const needed = mostNeeded( toPickFrom );
		let foundNeed = false;
		
		for ( let key in needed ) {
			let needID = parseInt( needed[key]["id"] );

			for ( let i in possibleC ) {
				if ( possibleC[i] == needID ) {
					qcc[1] = possibleC[i];
					possibleC.splice( i, 1 )
					foundNeed = true;
					break;					
				}
			}
			if ( foundNeed == true ) { break; }
		}
		if ( foundNeed == false ) {
			if ( possibleC.length > 3 ) {
				const k = Math.floor(Math.random() * (possibleC.length - 3));
				for ( let i = 0; i < k+1; i++ ) {
					qcc[1] = possibleC.pop();
				}
			} else { qcc[1] = possibleC.pop(); }
		}		
		qcc[2] = randomlyPickFromArray( possibleC );
	} else if ( possibleC.length == 1 ) {
		qcc[1] = possibleC[0];
	} else {
		if ( possibleQ.length > 0 ) {
			qcc[1] = randomlyPickFromArray( possibleQ );
			usingQasC = qcc[1];
		} else if ( qcc[0] !== false ) {
			usingQasC = qcc[0];
		}
	}
	return qcc;
}


class StateButton {
	constructor( stateID = 0, label = '', clickAction = '' ) {
		const
			longFlags = [5,12,18,27,37,40,44,47,48],
			path = 'imgs/flags/',
			gradient = "linear-gradient(rgba(15, 15, 15, 0.12), rgba(15, 15, 15, 0.04))",
			height = 48 - 3 * dlg.toleranceVar,
			paddingRight = 20 - 2 * dlg.toleranceVar
		;
		this.liNode = document.createElement("li");
		let buttonNode = document.createElement("button");		
		if ( label == '' ) {
			buttonNode.innerHTML = stateNames[stateID];
			if ( stateID == 23 && window.innerWidth <= 420 ) buttonNode.innerHTML = 'Demokr. Republik Kongo'; // individual workaround for long name
		} else {
			buttonNode.innerHTML = label;
		}
		let att = document.createAttribute("value");
		att.value = stateID;
		buttonNode.setAttributeNode(att);		
		att = document.createAttribute("onclick");
		if ( clickAction == '' ) {
			if ( label == '' ) att.value = "submitAnswer(this.value);"; else att.value = "dlg.hidePrompt();";
		} else {
			att.value = clickAction;
		}
		buttonNode.setAttributeNode(att);		
		buttonNode.style.height = height + "px";
		buttonNode.style.paddingRight = paddingRight + "px";
		buttonNode.style.display = 'inline-block';
		if ( stateID == 0 ) {
			buttonNode.style.backgroundImage = gradient;
			buttonNode.style.paddingLeft = paddingRight + "px"; 		
		} else {
			buttonNode.style.backgroundImage = "url('" + path + "flag_" + [stateID] + ".svg'), " + gradient;
			if ( longFlags.includes(stateID) ) { // flag proportion 2:1
				buttonNode.style.paddingLeft = Math.floor(2 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 9 || stateID == 22 ) { // Burundi's and Comoros' flag proportion is 1000:600
				buttonNode.style.paddingLeft = Math.floor(10/6 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 14 || stateID == 23 ) { // Gabun's and Democratic Republic of the Congo's flag proportion is 4:3
				buttonNode.style.paddingLeft = Math.floor(4/3 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 20 ) { // Kap Verde's flag proportion is 1020:600
				buttonNode.style.paddingLeft = Math.floor(102/60 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 26 ) { // Liberia's flag proportion is 1140:600
				buttonNode.style.paddingLeft = Math.floor(114/60 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 36 ) { // Niger's flag proportion is 7:6
				buttonNode.style.paddingLeft = Math.floor(7/6 * height) + paddingRight + 'px'; 		
			} else if ( stateID == 50 ) { // Togo's flag proportion is 809:500
				buttonNode.style.paddingLeft = Math.floor(809/500 * height) + paddingRight + 'px'; 		
			} else { // flag proportion 3:2
				buttonNode.style.paddingLeft = Math.floor(3/2 * height) + paddingRight + 'px'; 		
			}
		}
		this.liNode.appendChild(buttonNode);		
	}
}


class StatePath {
	constructor( stateID, fillColor = colorPrefs['shapeColorDefault'] ) {
		const mapPath = document.getElementById('stateID' + stateID);
		this.pathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		var att = document.createAttribute('fill');
		att.value = "#" + fillColor;
		this.pathNode.setAttributeNode(att);	
		if ( mapPath.localName == 'path' ) {
			att = document.createAttribute('d');
			att.value = mapPath.getAttribute('d');
			this.pathNode.setAttributeNode(att);	

			att = document.createAttribute('transform');
			att.value = coordinates[stateID].transform;
			this.pathNode.setAttributeNode(att);	
		}
	}
}
	

function presentQuestion( lineup ) {	
	const t = setTimeout(dlg.showPromptDelayed, 400);
	qID = lineup[0];
	const answerOptions = lineup.concat();
	dlg.hlpr.shuffleArray( answerOptions );
	dlg.promptAnimated = {
		headline : '<span class="light">' + quizQuestions[qID]['h'] + ': </span>',
		topText : quizQuestions[qID]['q'],
		bottomText : false,
		buttons : answerOptions,
		buttonLabel : '',
		buttonClickAction : 'submitAnswer(this.value);',
	}
}


function submitAnswer(answerID) {
	questionsAnswered.push(qID);
	const t = setTimeout(dlg.showPromptDelayed, 300);
	let placeState = '', btxt = false, pzzl = ' im Puzzle platzieren';
	if ( window.innerWidth < 420 ) pzzl = ' ins Puzzle&#160;…';
	if ( qID == 31 ) placeState = 'Marokko' + pzzl; // individual workaround for long name
	else placeState = stateNames[qID] + pzzl;

	if ( answerID == qID ) {
		if ( window.innerHeight > 560 ) btxt = 'Deine Antwort ist richtig!'; else btxt = false;
		dlg.promptAnimated = {
			headline : '<span class="correct">richtig:</span> ' + stateNames[qID],
			topText : quizQuestions[qID]["a"],
			bottomText : btxt,
			buttons : qID,
			buttonLabel : placeState,
			buttonClickAction : 'showSquare();',
		}
		correctAnswers++;
		dlg.answerPrompt.innerHTML = correctAnswers + ' von ' + qToSolve + ' Fragen richtig beantwortet';
	} else {
		if ( window.innerHeight > 560 ) btxt = 'Die Antwort ' + stateNames[answerID] + ' ist leider falsch.'; else btxt = false;
		dlg.promptAnimated = {
			headline : '<span class="light">Lösung: </span>' + stateNames[qID],
			topText : quizQuestions[qID]["a"],
			bottomText : btxt,
			buttons : qID,
			buttonLabel : placeState,
			buttonClickAction : 'showSquare();',
		}
	}
	if ( additionalInfo[qID].length > 32 ) {	
		let btn = new StateButton( 0, '<i class="fa fa-info"></i>', 'showAdditionalInfo(' + qID + ');' );
		dlg.buttonUl.appendChild( btn.liNode );		
	}
}


function nextPiece() {
	dlg.runQuiz = 'run';
	dlg.wrap.style.opacity = 1;
	let tryID = 0;
	if ( lineup.length == 0 ) {
		lineup = lineUpQCC();
//		dlg.toggleBorders = 'hide';
		if ( lineup[0] === false ) {
			lineup.shift();
			currentID = lineup[0];
			showSquare();
		} else if ( lineup.length > 1 ) {
			currentID = lineup[0];
			presentQuestion( lineup );					
			dlg.controlButtonAction = 'cancel';
		} else {
			currentID = lineup[0];
			showSquare();
		}
		if ( lineup.length == 0 ) return false;
 	} else {
		let nextID = lineup[0];
		dlg.headlineTop.innerHTML = stateNames[nextID];
		currentID = lineup[0];
		showSquare();
	}
	tryID = parseInt( lineup.shift() );	
	sqr.removeShape();
	let shape = new StatePath( tryID, dlg.hlpr.shapeColor( tryID ) );
	sqr.g.appendChild( shape.pathNode );	
	return tryID;
}


function skipPiece() {
	dlg.view = 'reset';
	dlg.controlButtonAction = 'next';
	currentID = nextPiece();
}


function cancel() {
	lineup = [];
	dlg.view = 'reset';
	dlg.promptDiv.setAttribute('class', '');
	dlg.overlay.setAttribute('class', '');
	dlg.controlButtonAction = 'next';
	dlg.runQuiz = 'stop';
}


function quit() {
	lineup = [];
	dlg.view = 'reset';
	dlg.promptDiv.setAttribute('class', '');
	dlg.overlay.setAttribute('class', '');
	dlg.controlButtonAction = 'next';
	dlg.runQuiz = 'restart';
}


function showSquare() {
	dlg.promptDiv.setAttribute('class', 'show');
	dlg.overlay.setAttribute('class', 'show');
	dlg.wrap.style.opacity = 1;
	dlg.overlay.style.opacity = 1;
	sqr.div.style.display = "none";
	sqr.div.style.opacity = 0;
	sqr.div.style.transform = "scale(" + shiftMap.renderedScale + "," + shiftMap.renderedScale + ")";
	sqr.div.style.left = "5vw";		
	sqr.div.style.display = "block";	
	dlg.hlpr.dragElement( sqr.div );	
	let rect = sqr.div.getBoundingClientRect();
	sqr.renderedSize = Math.round(rect.height);	
	dlg.wrap.style.width = sqr.renderedSize + 'px';
	dlg.bottomDiv.style.height = sqr.renderedSize - 96 + 'px';
	dlg.bottomDiv.style.display = 'block';

	if ( currentID == false || currentID == 0 || currentID == undefined ) {
		dlg.hidePrompt()
		dlg.topPrompt.innerHTML = '';
		dlg.topPrompt.style.display = 'none';
		dlg.bottomPrompt.innerHTML = '';
		dlg.bottomPrompt.style.display = 'none';
		dlg.bottomDiv.style.display = 'none';
		dlg.removeButtonsFromButtonUl();

		if ( statesPlaced.length >= shiftMap.pickFromCompleteSet.length ) {
			dlg.headlineTop.innerHTML = 'Puzzle komplett!';	
			let quizResult = '';
			if ( correctAnswers > 0 ) quizResult = correctAnswers + ' von ' + qToSolve + ' Fragen richtig beantwortet und ';
			dlg.topPrompt.innerHTML = 'Glückwunsch, Du hast ' + quizResult + 'alle Staaten im Puzzle platziert!<br />Mit Klick auf die Afrika-Karte sind weiterführende Informationen zu einzelnen Staaten abrufbar.';
			dlg.topPrompt.style.display = 'block';
			let btn = new StateButton( 0, '<i class="fa fa-play"></i><span>weiter zur Karte</span>', 'dlg.hidePrompt();' );
			dlg.buttonUl.appendChild( btn.liNode );
			btn = new StateButton( 0, '<i class="fa fa-stop"></i><span>Quiz beenden</span>', 'dlg.hidePrompt(); dlg.runQuiz = "restart";' );
			dlg.buttonUl.appendChild( btn.liNode );
			dlg.controlButtonAction = 'quit';
			notForPuzzle.forEach( dlg.hlpr.changeColor ); // change color of tiny island states, for the sake of completeness
		} else {
			dlg.headlineTop.innerHTML = 'zum Fortfahren Ansicht wechseln';
			let btnli = shiftMap.nav.firstChild.cloneNode(true);
			btnli.firstChild.setAttribute( 'id', '' );
			btnli.firstChild.classList.add( 'move' );
			btnli.style.display = 'inline-block';
			btnli.firstChild.setAttribute( 'onclick', 'shiftMap.move(); dlg.removeButtonsFromButtonUl(); const t = setTimeout( function() { currentID = nextPiece(); }, 600 )' );
			dlg.buttonUl.appendChild( btnli );
			dlg.controlButtonAction = 'cancel';
		}
		dlg.buttonUl.style.display = 'block';		
	} else {
		if ( largeStatesOrLongNames.includes( currentID ) && (window.innerWidth < 720 || window.innerHeight < 560 )) {
			if ( currentID == 23 ) dlg.headlineTop.innerHTML = stateNames[currentID] + '<br />&#160;<br />&#160;'; // Demokratische Republik Kongo
			else dlg.headlineTop.innerHTML = stateNames[currentID] + '<br />&#160;';
		}
		else dlg.headlineTop.innerHTML = stateNames[currentID];
		dlg.topPrompt.innerHTML = '';
		dlg.topPrompt.style.display = 'none';
		dlg.bottomPrompt.innerHTML = '';
		dlg.bottomPrompt.style.display = 'none';
		dlg.removeButtonsFromButtonUl();
		dlg.buttonUl.style.display = 'none';
		dlg.controlButtonAction = 'skip';
	}
	rect = wrap.getBoundingClientRect();
	sqr.div.style.top = Math.round(rect.bottom) - sqr.renderedSize - 48 + 'px';
	sqr.div.style.zIndex = 400;
	sqr.div.style.opacity = 0.85;	
	const t = setTimeout(dlg.showPromptDelayed, 200);
}


function showAdditionalInfo(id) {
	dlg.runQuiz = 'run';
	const t = setTimeout(dlg.showPromptDelayed, 400);

	if ( lineup.length > 0 ) {
		dlg.promptAnimated = {
			headline : stateNames[id],
			topText : additionalInfo[id],
			bottomText : false,
			buttons : 0,
			buttonLabel : '<i class="fa fa-play"></i><span>weiter im Puzzle</span>',
			buttonClickAction : 'showSquare();',
		}
	} else {
		dlg.promptAnimated = {
			headline : stateNames[id],
			topText : additionalInfo[id],
			bottomText : false,
			buttons : 0,
			buttonLabel : '<i class="fa fa-times"></i><span>schließen</span>',
			buttonClickAction : 'dlg.hidePrompt();',
		}
	}
}


function showStartPrompt() {
	const t = setTimeout(dlg.showPromptDelayed, 400);
	dlg.promptAnimated = {
		headline : 'Lerne Afrika besser kennen!',
		topText : 'Beantworte die Rätselfragen und erfahre dabei Erstaunliches und Wissenswertes zu den Staaten Afrikas. Schiebe dann die Staaten an ihren Platz im Afrika-Puzzle. (Das Puzzlestück passt immer nur in den sichtbaren Kartenausschnitt.)',
		bottomText : 'Falls Du eine größere Herausforderung suchst, kannst Du mit der <i class="fa af-africa"></i>Taste die Ländergrenzen ausblenden. Mit der <i class="fa fa-fast-forward"></i>Taste kannst Du einzelne Staaten überspringen, wenn Du nicht gleich ihren richtigen Platz findest. Du bekommst später erneut Gelegenheit, diese Staaten ins Puzzle einzufügen.',
		buttons : 0,
		buttonLabel : '<i id="promptStart" class="fa fa-play"></i><span>Puzzle starten</span>',
		buttonClickAction : 'currentID=nextPiece();',
	}
	document.getElementById( 'promptStart' ).parentElement.addEventListener( "touchstart", dlg.touchDevice, false );
}
