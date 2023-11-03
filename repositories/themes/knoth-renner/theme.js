/* --- Custom Global Script --- */

console.log("Hello from jens custom global.js");

/* ------------------------------- */
/* ---Global Variables --- */

const html = document.documentElement;
const body = document.body;
const appBase = body.querySelector('.AppBase');

/* ------------------------------- */
/* --- Once --- */

/* Add lang attribute to html */
// Check if the <html> element has no lang attribute
if (!document.documentElement.hasAttribute('lang')) {
	// Get the browser's language
	const browserLanguage = 'de'; // 'und'; // navigator.language || navigator.userLanguage || 'en';
	// Set the lang attribute of the <html> element to the browser's language
	document.documentElement.setAttribute('lang', browserLanguage);
}

/* ------------------------------- */
/* --- Global Functions --- */

function setHeadlineFontClass(){
	// add class to app for better, font-sensitive typography
	//$('.AppBase.Theming').first().addClass('font-headline-galgo');
}

function randomBackgroundColor(){
	
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	
	const buildingCityColors = [
		/*
		"rgb(206, 151, 111)",
		"rgb(205, 133, 63)",
		"rgb(171, 119, 55)",
		"rgb(132, 102, 82)",
		"rgb(160, 82, 45)",
		"rgb(160, 119, 90)",
		"rgb(255, 160, 122)",
		"rgb(195, 107, 50)",
		"rgb(184, 134, 11)",
		"rgb(202, 155, 95)",
		*/
		/*
		// Lighter:
		"rgb(233, 220, 210)",
		"rgb(230, 218, 206)",
		"rgb(236, 229, 221)",
		"rgb(238, 228, 221)",
		"rgb(231, 218, 211)",
		"rgb(242, 232, 224)",
		"rgb(212, 204, 201)",
		"rgb(233, 219, 210)",
		"rgb(245, 238, 223)",
		"rgb(244, 238, 231)",
		*/
		
		// Grey:
		"rgb(231, 231, 231)",
		"rgb(223, 219, 216)",
		"rgb(222, 229, 229)",
		"rgb(222, 223, 216)",
		"rgb(218, 218, 223)",
		"rgb(212, 210, 212)",
		"rgb(229, 230, 225)",
		"rgb(235, 231, 233)",
		"rgb(224, 227, 228)",
		"rgb(237, 235, 232)",
		
	];
	
	shuffleArray(buildingCityColors);

	
	const elems = appBase.querySelectorAll('.Card, .Tile, .Slider__Slide, .DataCell, .UserCard');
	elems.forEach((elem, index) => {
		if (!elem.classList.contains('RandomBackgroundColor')) {
			elem.classList.add('RandomBackgroundColor');
			
			const colorIndex = index % buildingCityColors.length;
			//elem.style.backgroundColor = buildingCityColors[colorIndex];
			elem.style.setProperty('--color-background-special', buildingCityColors[colorIndex]);
		}
	});

}

function wrapText(){
	// --- Wrap text inside of .CardHeader__Description etc. with <p> tag. I'd suggest to implement this in the html.
	const elems = appBase.querySelectorAll('.CardHeader__Description, .Card__content');
	//console.log({ elems });
	elems.forEach((description) => {
		console.log({ description });
		if (description.children.length === 0 && description.textContent.trim().length > 0) {
			description.innerHTML = '<p>' + description.textContent + '</p>';
		}
	});
}

function moveInOut(elem, direction = 'in'){
	
	var options = { x: 0, y: 0, opacity: 1, duration: 0.2, scale: 1, ease: 'none' };

	if( direction == 'in'){
		gsap.to(elem, options);
	} else if( direction == 'set'){
		options.duration = 0;
		gsap.set(elem, options);
	} else { // out
		
		// Compare the element's top position with the vertical center of the viewport
		//var verticalShift = elem.getBoundingClientRect().top > window.innerHeight / 2 ? -100 : 100;
		var verticalShift = 0;
		var horizontalShift = Math.random() < 0.5 ? 50 : -50;
		
		options.x = horizontalShift;
		options.y = verticalShift;
		options.opacity = 0;
		options.scale = .98;
		gsap.to(elem, options);
		
	}
}

function setupIntersectionObserver(){
	// --- Intersection Observer	
	var options;
	var observer;
	var observedElements;
	var roots = appBase.querySelectorAll('.LayoutShellAudio__Content .ScrollContainer');
	
	if ( roots.length == 0) {
		roots = appBase.querySelectorAll('.LayoutShellAudio__Content .SectionShell');
	}
	
		
	function initObserver(rootElem) {
		// Set up the intersection observer to detect when to define
		// and load the real image source
		options = {
			rootMargin: "-24px 0px 0px -32px",
			threshold: 0,
			root: rootElem,
		};
		observer = new IntersectionObserver(callback, options);
	
		observeElements = rootElem.querySelectorAll('.DataCell, .Card, .ListItem, .Tile, .AccordeonShell, .UserCard');
		
		if (observeElements.length == 0) {
			observeElements = rootElem.childNodes;
		}

		rootElem.classList.add('IntersectionObserver--root');
	
		observeElements.forEach(elem => {
			if (!elem.classList.contains('IntersectionObserver')) {
				observer.observe(elem);
				elem.classList.add('IntersectionObserver');
				//elem.classList.add('IntersectionObserver--isNotIntersecting');
				moveInOut(elem,'set');
			}
		});
	}
	
	let callback = (entries, observer) => {
		entries.forEach(entry => {
			// Each entry describes an intersection change for one observed
			// target element:
			//   entry.boundingClientRect
			//   entry.intersectionRatio
			//   entry.intersectionRect
			//   entry.isIntersecting
			//   entry.rootBounds
			//   entry.target
			//   entry.time
			if (entry.isIntersecting) {
				entry.target.classList.remove('IntersectionObserver--isNotIntersecting');
				entry.target.classList.add('IntersectionObserver--isIntersecting');
				moveInOut(entry.target,'in');
			} else {
				entry.target.classList.add('IntersectionObserver--isNotIntersecting');
				entry.target.classList.remove('IntersectionObserver--isIntersecting');
				moveInOut(entry.target,'out');
			}
			
		});
	};
	
	roots.forEach(root => {
		initObserver(root);
	});
	
}


/* ------------------------------- */
/* --- Init Function --- */

function init() {
	wrapText();
	setupIntersectionObserver();
	randomBackgroundColor();
	setHeadlineFontClass();
}

/* ------------------------------- */
/* --- Listen to DOM change --- */

var observeDOM = (function() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	return function(obj, callback) {
		if (!obj || obj.nodeType !== 1) return;

		if (MutationObserver) {
			// define a new observer
			var mutationObserver = new MutationObserver(callback)

			// have the observer observe for changes in children
			mutationObserver.observe(obj, { childList: true, subtree: true })
			return mutationObserver
		}

		// browser support fallback
		else if (window.addEventListener) {
			obj.addEventListener('DOMNodeInserted', callback, false)
			obj.addEventListener('DOMNodeRemoved', callback, false)
		}
	}
})()

// Observe a specific DOM element:
observeDOM(appBase, function(m) {
	/*
	var addedNodes = [],
		removedNodes = [];
	m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))
	m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes))
	console.clear();
	console.log('Added:', addedNodes, 'Removed:', removedNodes);
	*/
	console.clear();
	init();
});



const cardHeaders = appBase.querySelectorAll('.CardHeader__Description');
console.log({ cardHeaders });