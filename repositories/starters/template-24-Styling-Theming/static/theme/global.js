/* this script gets loaded from the app when "Apply Theme" is on */
console.log("Hello from global.js")

/* below: example for a complex add-on script which adds a "ticker" animation to the card headline */

/* get elements, using interkit component selectors */
var animatedElementsSelector = ".card-header .headline:not(.tickered)"

function addAnimation(selector) {
  Array.from(document.querySelectorAll(selector)).map(elem => {
    var elemHtml = elem.innerHTML
    //var text = (elemHtml + "&nbsp".repeat(6)).repeat(16).trim()
    var text = (elemHtml + "&nbsp;" + "•" + "&nbsp;").repeat(16).trim()
    var elemNewHtml = '<span class="ticker-container"><span class="ticker-move">' + text + "</span></span>"
    //console.log(elem, elemHtml, elemNewHtml)
    elem.innerHTML = elemNewHtml
    elem.classList.add('tickered')
    //console.log(elem, elemHtml, elemNewHtml, elem.innerHtml)
  });
}

var runAddAnimation = function () { addAnimation(animatedElementsSelector) }

var updateUiState = function() {
  runAddAnimation()
}
updateUiState()

/* since there is no event to detect navigation, you need to poll the DOM for changes */
window.setInterval(updateUiState,1000)