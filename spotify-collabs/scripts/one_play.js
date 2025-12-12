document.addEventListener("DOMContentLoaded", () => {
const iframes = document.querySelectorAll("iframe");

iframes.forEach((iframe) => {
  iframe.addEventListener("click", () => {
	iframes.forEach((other) => {
	  if (other !== iframe) {
		other.src = other.src;
	  }
	});
  });
});
});
