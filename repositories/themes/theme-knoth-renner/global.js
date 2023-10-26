/* custom global javascript */

console.log("Hello from global.js");

/* GSAP */
var scriptElement = document.createElement('script');
scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
//scriptElement.setAttribute('defer', '');
document.body.appendChild(scriptElement);


/* Custom JS */
var scriptElement = document.createElement('script');
scriptElement.src = 'theme.js';
scriptElement.setAttribute('defer', '');
document.body.appendChild(scriptElement);