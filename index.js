function Noise(id="jesus" , nearest=0 , fpCount=10 , factor=3) {
	this.canvas    = document.getElementById(id);
	this.context   = this.canvas.getContext("2d");
	this.pixelSize = 1;
	this.fPoints   = [];
	this.featurePointsCount = (fpCount <= 0) ? 1 : fpCount;
	this.nearest            = (nearest > fpCount - 1) ? fpCount - 1 : (nearest < 0) ? 0 : nearest;
	this.largestSide        = Noise.getMaxSide(this.canvas.width , this.canvas.height);
	this.factor             = factor;
	this.generateFeaturePoints();

}

//-------------------------------------------------------------------------------------------------

Noise.getRandomNumber = function(min , max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//-------------------------------------------------------------------------------------------------

Noise.getMaxSide = function(width , height) {
	return Math.round(Math.sqrt(width * width + height * height));
}

//-------------------------------------------------------------------------------------------------

Noise.distanceBetweenTwoPoints = function(x1 , y1 , x2 , y2) {
	return Math.round(Math.sqrt(Math.pow((x1 - x2) , 2) + Math.pow((y1 - y2) , 2)));
}

//-------------------------------------------------------------------------------------------------

Noise.generateRandomColor = function() {
	return {
		"r" : Noise.getRandomNumber(0,255) ,
		"g" : Noise.getRandomNumber(0,255) ,
		"b" : Noise.getRandomNumber(0,255) ,
		"a" : Noise.getRandomNumber(0,1)
	}
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.drawPixel = function(x , y , r , g , b , a=1) {
	this.context.fillStyle = `rgba(${r},${g},${b},${a})`;
	this.context.fillRect(x , y , this.pixelSize , this.pixelSize);
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.getColorFromDist = function(dist) {
	return Math.round(255 * dist / this.largestSide * this.factor);
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.generateFeaturePoints = function() {
	for(let i = 0;i < this.featurePointsCount;i++) {
		this.fPoints.push({x : Noise.getRandomNumber(0 , this.canvas.width) , y : Noise.getRandomNumber(0 , this.canvas.height)});
	}
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.getNnearestDist = function(x , y) {
	let distances = [];
	this.fPoints.forEach((fp) => {
		distances.push( Noise.distanceBetweenTwoPoints(x , y , fp.x , fp.y) );
	})
	return distances.sort((d1 , d2) => {return d1 - d2;})[0];
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.drawFeaturePoints = function() {
	this.fPoints.forEach((fp) => {
		this.drawPixel(fp.x , fp.y , 0 , 0 , 0 , 1);
	})
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.drawPoints = function() {
	for(let x = 0;x < this.canvas.width;x += this.pixelSize) {
		for(let y = 0;y < this.canvas.height;y += this.pixelSize) {
			let color = this.getColorFromDist(this.getNnearestDist(x , y));
			this.drawPixel(x , y , color , color , color);
		}
	}
}

//-------------------------------------------------------------------------------------------------

Noise.prototype.draw = function() {
	this.drawFeaturePoints();
	this.drawPoints();
}



let noise = new Noise("jesus" , 5 , 20 , 5);
noise.draw();
