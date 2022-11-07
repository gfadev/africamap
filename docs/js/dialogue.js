class Helpers {
	constructor(){}

	set addTargetBlankAttrib( paragraph ) {
		const aArray = paragraph.getElementsByTagName("a");
		if ( aArray.length > 0 ) {	
			for ( let k in aArray ) {
				if ( typeof aArray[k] != "object" ) { break; }
				if ( !aArray[k].hasAttribute("target")) {
					let att = document.createAttribute("target");
					att.value = "_blank";
					aArray[k].setAttributeNode(att);
				}
			}	
		}
	}
	
	set disableDraggableAhrefByParentTagName( parent ) { // disable draggable a href as per browser default
		document.addEventListener("dragstart", function( event ) {
			if ( event.target.localName == 'a' && event.target.parentNode.localName == parent ) {
				event.preventDefault();
			}
		}, false);
	}	
	
	shapeColor( id ) {
		for ( let clr in shapeColors ) {
			if ( shapeColors[clr].includes( id ) ) {
				return clr;
			}
		}		
		return colorPrefs['shapeColorDefault'];
	}
	
	changeColor( id ) {
		document.getElementById( "stateID" + id ).style.fill = "#" + colorPrefs["shapeColorPlaced"];
	}

	dragElement( elmnt ) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, xPosition = 0, yPosition = 0;
		if ( isTouchDevice === true ) elmnt.ontouchstart = dragMouseDown;
		else elmnt.onmousedown = dragMouseDown;	

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			dlg.view = 'sqr';
			pos3 = e.clientX;
			pos4 = e.clientY;
			if ( isTouchDevice === true ) document.ontouchend = closeDragElement;
			else document.onmouseup = closeDragElement;
			if ( isTouchDevice === true ) document.ontouchmove = elementDrag;
			else document.onmousemove = elementDrag;
			sqr.div.style.backgroundColor = 'rgba(186,17,16,0)';
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			if ( isTouchDevice === true ) {
				const touch = e.touches[0] || e.changedTouches[0];
				xPosition = touch.pageX;
				yPosition = touch.pageY;
			} else {
				xPosition = e.clientX;
				yPosition = e.clientY;
			}
			pos1 = pos3 - xPosition;
			pos2 = pos4 - yPosition;
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			pos3 = xPosition;
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			pos4 = yPosition;
		}

		function closeDragElement() {
			let rect = elmnt.getBoundingClientRect();
			let	x = Math.floor(rect.left),
				y = Math.floor(rect.top),
				xMin = Math.floor(dlg.target.left),
				xMax = Math.floor(dlg.target.right),
				yMin = Math.floor(dlg.target.top),
				yMax = Math.floor(dlg.target.bottom)		
			;
			if ( x > xMin - dlg.toleranceVar && x < xMax + dlg.toleranceVar && y > yMin - dlg.toleranceVar && y < yMax + dlg.toleranceVar ) {
				dlg.view = 'reset';
				dlg.puzzle = 'placed';
			} else {
				sqr.div.style.backgroundColor = 'rgba(186,17,16,0.05)';
			}
			document.onmouseup = null;
			document.ontouchend = null;
			document.onmousemove = null;
			document.ontouchmove = null;
		}
	}
	
	shuffleArray( arr ) {
		for ( let i = arr.length - 1; i > 0; i-- ) {
			const j = Math.floor( Math.random() * (i + 1) );
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}
}


export class Dialogue {
	targetFrameNodes = [];
	toleranceConst = 12; // edit here
	toleranceVar = 0; // do not edit here, will be variably adjusted via initializeView()

	constructor() {		
		this.hlpr = new Helpers();		
		
		this.gfaNav = document.getElementById('gfa-nav');
		this.answerPrompt = document.getElementById('answers');
		this.clickStart = document.getElementById('clickStart');
		this.moveButton = document.getElementById('move');
		this.controlButton = document.getElementById('control');
		this.bordersButton = document.getElementById('borders');
		this.bordersGroup = document.querySelectorAll( '#Borders > path, #Borders > polyline, #Disputed_borders > path, #Disputed_borders > polyline' );
		this.wrap = document.getElementById('wrap');
		this.bottomDiv = document.getElementById('bottomDiv');
		this.overlay = document.getElementById('overlay');
		this.promptDiv = document.getElementById('prompt');
		this.headlineTop = document.getElementById('headline');
		this.topPrompt = document.getElementById('topPrompt');
		this.bottomPrompt = document.getElementById('bottomPrompt');
		this.buttonUl = document.getElementById('buttonUl');

		this.initializePuzzle = 'States';
		window.addEventListener( "resize", this.initializeView.bind( this ), false );
		clickStart.addEventListener( "click", function(e) { e.preventDefault(); currentID = nextPiece(); }, false );		
		clickStart.addEventListener( "touchstart", this.touchDevice, false );
		this.bordersButton.addEventListener("click", this.bordersButton.fn1 = function() { this.toggleBorders = 'show'; }.bind( this ), false );
	}

	touchDevice() {
		isTouchDevice = true;
		clickStart.outerHTML = clickStart.outerHTML;
		clickStart.addEventListener( "touchstart", function(e) { e.preventDefault(); currentID = nextPiece(); }, false );	
		currentID = nextPiece();
	}
		
	removeButtonsFromButtonUl() {
		while ( this.buttonUl.hasChildNodes() ) this.buttonUl.removeChild(this.buttonUl.firstChild);		
	}

	showPromptDelayed() {
		dlg.promptDiv.setAttribute('class', 'show');
		dlg.overlay.setAttribute('class', 'show');
	}

	get target() {
		let frame = this.targetFrameNodes[currentID];
		return frame.getBoundingClientRect();
	}

	set toggleBorders( setStatusTo ) {
		if ( setStatusTo == 'show' ) {
			for ( let i=0; i < this.bordersGroup.length; i++ ) {
				if ( this.bordersGroup[i].getAttribute( 'id' ) == 'polyline7886' ) continue;
				this.bordersGroup[i].style.stroke = "#" + colorPrefs["borderColorShow"];
			}
			this.bordersButton.removeEventListener("click", this.bordersButton.fn1, false );
			this.bordersButton.addEventListener("click", this.bordersButton.fn2 = function() { this.toggleBorders = 'hide'; }.bind( this ), false );
			this.bordersButton.innerHTML = '<i class="fa af-africa"></i>';
			this.bordersButton.setAttribute('title', 'Ländergrenzen ausblenden');
		} else {
			for ( let i=0; i < this.bordersGroup.length; i++ ) {
				if ( this.bordersGroup[i].getAttribute( 'id' ) == 'polyline7886' ) continue;
				this.bordersGroup[i].style.stroke = "#" + colorPrefs["borderColorHide"];
			}
			this.bordersButton.removeEventListener("click", this.bordersButton.fn2, false );
			this.bordersButton.addEventListener("click", this.bordersButton.fn1, false );
			this.bordersButton.innerHTML = '<i class="fa af-africa-borders"></i>';
			this.bordersButton.setAttribute('title', 'Ländergrenzen einblenden');
		}
	}

	set promptAnimated( content ) {
		this.promptDiv.setAttribute('class', '');
		this.wrap.style.width = 'initial';
		this.bottomDiv.style.height = 'initial';
		this.headlineTop.innerHTML = content.headline;

		if ( content.topText === false ) {
			this.topPrompt.innerHTML = '';
			this.topPrompt.style.display = 'none';
		} else {
			this.topPrompt.innerHTML = content.topText;
			this.hlpr.addTargetBlankAttrib = this.topPrompt;
			this.topPrompt.style.display = 'block';
		}

		if ( content.bottomText === false ) {
			this.bottomPrompt.innerHTML = '';
			this.bottomPrompt.style.display = 'none';
			this.bottomDiv.style.display = 'none';
		} else {
			this.bottomPrompt.innerHTML = content.bottomText;
			this.hlpr.addTargetBlankAttrib = this.bottomPrompt;
			this.bottomPrompt.style.display = 'block';
			this.bottomDiv.style.display = 'block';
		}
	
		this.removeButtonsFromButtonUl();
		if ( content.buttons === false ) {
			this.buttonUl.style.display = 'none';				
		} else if ( typeof content.buttons == "object" ) {
			for ( let key in content.buttons ) {		
				let btn = new StateButton( content.buttons[key], '', content.buttonClickAction );
				this.buttonUl.appendChild( btn.liNode );
			}
			this.buttonUl.style.display = 'block';	
		} else if ( typeof content.buttons == "number" ) {
			let btn = new StateButton( content.buttons, content.buttonLabel, content.buttonClickAction );
			this.buttonUl.appendChild( btn.liNode );
			this.buttonUl.style.display = 'block';	
		} else {
			this.buttonUl.style.display = 'none';				
		}
	}

	hidePrompt() {
		this.promptDiv.setAttribute('class', '');
		this.overlay.setAttribute('class', '');
		this.overlay.style.opacity = 1;
		this.wrap.style.width = 'initial';
		this.bottomDiv.style.height = 'initial';
	}

	set runQuiz( status ) {
		if ( status == 'run' ) {
			this.gfaNav.style.top = '-120px';
			shiftMap.nav.style.display = 'block';
		} else if ( status == 'restart' ) {
			clickStart.outerHTML = clickStart.outerHTML;
			if ( isTouchDevice === true ) {
				clickStart.addEventListener( "touchstart", function() { window.location.reload(); }, false );
			} else {			
				clickStart.addEventListener( "click", function() { window.location.reload(); }, false );
			}
			clickStart.innerHTML = '<i class="fa fa-play"></i>Quiz neu starten';
			this.gfaNav.style.top = '0';
			shiftMap.nav.style.display = 'none';
		} else {
			if ( (statesPlaced.length > 0 || correctAnswers > 0) && statesPlaced.length < shiftMap.pickFromCompleteSet.length ) {
				clickStart.innerHTML = '<i class="fa fa-play"></i>Quiz fortsetzen';
			}
			this.gfaNav.style.top = '0';
			shiftMap.nav.style.display = 'none';
		}
	}

	set view( step ) {		
		switch ( step ) {
			case "reset" :
				sqr.hideSquare();
				this.hidePrompt();
				this.wrap.style.width = 'initial';
				this.bottomDiv.style.height = 'initial';
				
				if ( shiftMap.nav.classList.contains( 'topright' ) ) {
					shiftMap.nav.firstChild.style.display = 'block';
				} else {
					shiftMap.nav.firstChild.style.display = 'inline-block';
				}
				
				break;
			case "q" :

				break;
			case "a" :

				break;
			case "sqr" :
				sqr.div.style.opacity = 0.85;
				sqr.div.style.border = '2px dashed #0978ab';
				this.wrap.style.opacity = 0;
				this.overlay.style.opacity = 0;
				break;
			default:
				document.getElementById("stateID" + currentID).style.fill = "#" + colorPrefs["shapeColorPlaced"];
				sqr.hideSquare();
				this.hidePrompt();
				this.wrap.style.width = 'initial';
				this.bottomDiv.style.height = 'initial';
		}		
	}
	
	set puzzle( step ) {
		if ( step == "placed" ) {
			document.getElementById( "stateID" + currentID ).style.fill = "#" + colorPrefs["shapeColorPlaced"];
			statesPlaced.push( currentID );
			if ( currentID == usingQasC ) {
				qToSolve--;
				this.answerPrompt.innerHTML = correctAnswers + ' von ' + qToSolve + ' Fragen richtig beantwortet';
			}
//			this.toggleBorders = 'hide';		
			nextPiece();
		}	
	}
	
	set controlButtonAction( action ) {
		switch ( action ) {
			case "start" :
				this.controlButton.setAttribute('onclick', 'currentID=nextPiece();');
				this.controlButton.setAttribute('title', 'Quiz starten …');
				this.controlButton.innerHTML = '<i class="fa fa-play"></i>';
				break;
			case "restart" :
				this.controlButton.setAttribute('onclick', 'window.location.reload();');
				this.controlButton.setAttribute('title', 'Quiz starten …');
				this.controlButton.innerHTML = '<i class="fa fa-play"></i>';
				break;
			case "next" :
				this.controlButton.setAttribute('onclick', 'currentID=nextPiece();');
				this.controlButton.setAttribute('title', 'weiter im Quiz …');
				this.controlButton.innerHTML = '<i class="fa fa-play"></i>';
				break;		
			case "skip" :
				this.controlButton.setAttribute('onclick', 'skipPiece();');
				this.controlButton.setAttribute('title', 'Staat überspringen');
				this.controlButton.innerHTML = '<i class="fa fa-fast-forward"></i>';
				break;		
			case "cancel" :
				this.controlButton.setAttribute('onclick', 'cancel();');
				this.controlButton.setAttribute('title', 'Quiz unterbrechen');
				this.controlButton.innerHTML = '<i class="fa fa-pause"></i>';
				break;
			case "quit" :
				this.controlButton.setAttribute('onclick', 'quit();');
				this.controlButton.setAttribute('title', 'Quiz beenden');
				this.controlButton.innerHTML = '<i class="fa fa-stop"></i>';
				break;
			default:
				this.controlButton.setAttribute('onclick', 'currentID=nextPiece();');
				this.controlButton.setAttribute('title', 'Quiz starten …');
				this.controlButton.innerHTML = '<i class="fa fa-play"></i>';
		}
	}

	set appendTitlesTargetFrames ( states ) {
		let gNode = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
		for ( let key in states ) {
			if ( typeof states[key] == "object" ) {
				let
					retrievedID = states[key].firstElementChild.id.replace( "stateID", "" ),
					index = parseInt( retrievedID.replace(/[a-z]/i,"") ),
					name = stateNames[index]
				;
				if (typeof name != "undefined") {
					let att = document.createAttribute( "href" );
					att.value = "#" + name;
					states[key].setAttributeNode( att );	

					att = document.createAttribute( "onclick" );
					att.value = "showAdditionalInfo(" + key + ");";
					states[key].setAttributeNode( att );	

					let titleNode = document.createElementNS( 'http://www.w3.org/2000/svg', 'title' );
					let textnode = document.createTextNode( name );
					att = document.createAttribute( "id" );
					att.value = "titleID" + retrievedID;
					titleNode.setAttributeNode( att );	
					titleNode.appendChild( textnode );
					states[key].insertBefore(titleNode, states[key].childNodes[0]);

					this.targetFrameNodes[key] = document.createElementNS( 'http://www.w3.org/2000/svg', 'rect' );

					att = document.createAttribute( "id" );
					att.value = "targetFrameID" + retrievedID;
					this.targetFrameNodes[key].setAttributeNode( att );

					att = document.createAttribute( "x" );
					att.value = coordinates[index].targetX - this.toleranceConst;
					this.targetFrameNodes[key].setAttributeNode( att );

					att = document.createAttribute( "y" );
					att.value = coordinates[index].targetY - this.toleranceConst;
					this.targetFrameNodes[key].setAttributeNode( att );

					att = document.createAttribute( "fill" );
					att.value = 'none';
					this.targetFrameNodes[key].setAttributeNode( att );

					att = document.createAttribute( "width" );
					att.value = 2 * this.toleranceConst;
					this.targetFrameNodes[key].setAttributeNode( att );

					att = document.createAttribute( "height" );
					att.value = 2 * this.toleranceConst;
					this.targetFrameNodes[key].setAttributeNode( att );

					gNode.appendChild( this.targetFrameNodes[key] );
				}
			}
		}
		shiftMap.svgmap.querySelector("g").appendChild( gNode );
	}

	initializeView() {
		wRatio = window.innerWidth / window.innerHeight;	
		if ( window.innerWidth <= 720 ) { // likely mobile device
			shiftMap.svgmap.style.width = "115%";
			shiftMap.svgmap.style.right = "-6%";
			shiftMap.svgmap.style.left = "-9%";		
			if ( wRatio > 2 ) { // most unlikely
				shiftMap.svgmap.style.left = "initial";
				shiftMap.svgmap.style.right = "0";
				shiftMap.svgmap.style.transform = "scale(1,1)";
				shiftMap.mode = 'y';
				shiftMap.y = ( window.innerWidth / shiftMap.origRatio * 2/wRatio/1.15 ) - window.innerHeight;
			} else if ( (wRatio * 1.15) > 1.095 ) { // quite unlikely
				shiftMap.svgmap.style.transform = "scale(1,1)";
				shiftMap.mode = 'y';
				shiftMap.y = ( window.innerWidth / shiftMap.origRatio * 1.15 ) - window.innerHeight;
			} else if ( wRatio < 0.58 ) { // for smaller wRatio, too large a piece would be cut off South Africa 
				shiftMap.svgmap.style.left = "-15%";
				shiftMap.svgmap.style.transform = "scale(1.7,1.7)";
				shiftMap.mode = 'x';
				shiftMap.x = .85 * window.innerWidth;
			} else { // likely (smart phone, portrait)
				shiftMap.svgmap.style.transform = "scale(1.7,1.7)";
				let renderedDimensions = shiftMap.svgmap.getBoundingClientRect();
				let renderedHeight = renderedDimensions.height;
				shiftMap.mode = 'xy';
				shiftMap.x = .85 * window.innerWidth;
				shiftMap.y = (renderedHeight) - window.innerHeight;
			}
			if ( window.innerWidth <= 560 ) this.toleranceVar = 9; else this.toleranceVar = 6;		
		} else { 
			shiftMap.svgmap.style.transform = "scale(1,1)";		
			if ( wRatio > 2 ) {
				shiftMap.svgmap.style.width = 200/wRatio + "%";
				shiftMap.svgmap.style.left = "initial";
				shiftMap.svgmap.style.right = "0";

				shiftMap.mode = 'y';
				shiftMap.y = ( window.innerWidth / shiftMap.origRatio * 2/wRatio ) - window.innerHeight;
			} else {
				shiftMap.svgmap.style.width = window.innerWidth + "px";
				shiftMap.svgmap.style.right = "0";
				shiftMap.svgmap.style.left = "0";

				if ( wRatio > 1.095 ) {
					shiftMap.mode = 'y';
					shiftMap.y = ( window.innerWidth / shiftMap.origRatio ) - window.innerHeight;
				} else {
					shiftMap.mode = 'none';
					this.moveButton.parentNode.style.display = 'none';
				}
			}	
			if ( window.innerWidth <= 940 ) this.toleranceVar = 3; else this.toleranceVar = 0;
		}
		shiftMap.svgmap.style.top = 0;
		shiftMap.storeLeft = shiftMap.svgmap.style.left;
		shiftMap.toggle = 0;	
		let rect = shiftMap.svgmap.getBoundingClientRect();
		shiftMap.renderedScale = rect.width / shiftMap.origWidth;
		toPickFrom = shiftMap.setToPickFrom( shiftMap.mode, shiftMap.toggle );
		lineup = [];
		this.view = 'reset';
		this.controlButtonAction = 'next';
		return wRatio;
	}

	set initializePuzzle( svgElemStates ) {
		if ( document.getElementById( svgElemStates ) === null ) return;
		this.appendTitlesTargetFrames = document.getElementById( svgElemStates ).children;
		this.hlpr.disableDraggableAhrefByParentTagName = "g";	
		const att = document.createAttribute( "onclick" );
		att.value = "shiftMap.move();";
		this.moveButton.setAttributeNode( att );	
		shiftMap.initialize();
		wRatio = this.initializeView();
	}
}


window.onload = function() {
	dlg = new Dialogue();
	dlg.view = 'reset';
	dlg.controlButtonAction = 'start';
	dlg.toggleBorders = 'show'; // show state borders by default
	if ( window.innerWidth < 720 || window.innerHeight < 560 ) {
		const t = setTimeout( function() {
			dlg.gfaNav.style.top = '-120px';
			showStartPrompt();
		}, 600 );
	} else {
		showStartPrompt();
	}
};
