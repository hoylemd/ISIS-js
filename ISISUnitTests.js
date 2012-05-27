// test image loader
window.onload = function(){
	objImmortalIcon = loadImage("Immortal1.png");
	
	if(typeof objImmortalIcon != 'undefined')
	{
		document.getElementById("loadImageResultText").innerHTML = "loadImage() passed."
		document.getElementById("loadImageResultImage").src = objImmortalIcon.src;
	}
	else
	{
		document.loadImageResult.loadImageResultText.innerHTML = "loadImage() failed." + 
			typeof objImmortalIcon;
	}
	
// test Unit constructor
}