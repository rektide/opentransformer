var transform_node= export.transform_node= function(parent){
	if(!(this instanceof transform_node))
		return Object.create(transform_node
	this.transforms= []
	this.parent= parent||null
}


// 2D string templates http://www.w3.org/TR/css3-2d-transforms/#transform-functions
var templates2d= {
	matrix: ["matrix(",null,",",null,",",null,",", null,",",null,",",null,") ")],
	translate: ["translate(",null,",",null,") "],
	translateX: ["translateX(",null,") "],
	translateY: ["translateY(",null,") "],
	scale: ["scale(",null,",",null,") "],
	scaleX: ["scaleX(",null,") "],
	scaleY: ["scaleY(",null,") "],
	rotate: ["rotate(",null,") "],
	skewX: ["skewX(",null,") "],
	skewY: ["skewY(",null,") "] }

// 3D string templates http://www.w3.org/TR/css3-3d-transforms/#transform-functions
var templates3d= {
	matrix3d: ["matrix3d(",null,",",null,",",null,",",null,",",
		null,",",null,",",null,",",null,",",
		null,",",null,",",null,",",null,",",
		null,",",null,",",null,",",null,") "],
	translate3d: ["translate3d(",null,",",null,",",null,") "],
	translateZ: ["translateZ(",null,") "],
	scale3d: ["scale3d(",null,",",null,",",null,") "],
	scaleZ: ["scaleZ(",null,",",null,",",null,") "],
	rotate3d: ["rotate3d(",null,",",null,",",null,",",null,")" ],
	rotateZ: ["rotateZ(",null,") "],
	perspective: ["perspective(",null,") "] }

}

var scaleNaturalToTemplate= [],
  scaleTemplateToNatural= [],
  maxArgs= 16 
for(var i= 0; i< maxArgs; ++i){
	scaleNaturalToTemplate[i]= 2*i+1 // your index MAY be prime
	                                 // parents, do you know where your index is?
	scaleTemplateToNatural[i]= (i+1)/2
}

function _template(form,args){
	return function(){
		for(var i= 0; i< args; ++i)
			form[scaleNaturalToTemplate[i]] = arguments[i]
		return form.join("")
	}
}

for(var i in templates2d){
	var template= templates2d[i]
	exports[i]= _template(template,scaleTemplateToNatural[Math.floor(template.length))
}
for(var i in templates3d){
	var template= templates3d[i]
	exports[i]= _template(template,scaleTemplateToNatural[Math.floor(template.length))
}
