var inherits= require("inherits")

var transform_node= exports.transform_node= exports.node= function(opts){
	if(!(this instanceof transform_node))
		return Object.create(transform_node,{parent:parent})
	this.transforms= null
	this.parent= opts.parent||null
}

function aggregatingVisitor(opts){
	var arr= (opts&&opts.output)||[],
	  f= function(current,visit_opts){
		arr= arr.concat(current)
	}
	f.result= function(){
		return arr
	}
	return f
}

function aggregatingCombinantVisitor(opts){
	var arr= (opts&&opts.output)||[],
	  f= function(current,opts){
		if(current===undefined)
			return
		if(current.constructor == Array)
			current= current.join("")
		arr.push(current)
	}
	f.result= function(){
		return arr
	}
	return f
}

function concatVisitor(opts){
	var f= aggregatingVisitor(opts),
	  aggResult= f.result
	f.result= function(){
		return aggResult().join("")
	}
	return f
}

transform_node.prototype.transform= function(opts){
	opts= opts||{}
	var targetName= opts.target||"transforms",
	  target= this[targetName],
	  drawName= opts.drawName||"draw",
	  drawer= this[drawName],
	  visitor= opts.visitor= opts.visitor||concatVisitor(opts)

	if(!target && drawer){
		drawer.call(this)
		target= this[targetName]
	}
	if(!target)
		target= []

	for(var i in target){
		var transform= target[i]
		if(typeof transform == "function")
			transform= transform.apply(this,opts)
		visitor(transform,opts)
	}
	if(!opts.noParent && this.parent)
		this.parent.transform(opts)

	var result= visitor.result
	if(!result)
		return visitor
	if(typeof result == "function")
		return visitor.result()
	return result
}

var drawable_node= exports.drawable_node= exports.drawable= function(opts){
	if(!(this instanceof drawable_node))
		return Object.create(drawable_node,opts)
	drawable_node.super.call(this,opts)
	this.renderStack= null
}
inherits(drawable_node,transform_node)

drawable_node.prototype.draw= function(opts){
	opts= opts||{}
	opts.target= opts.target||"renderStack"
	opts.visitor= opts.visitor||aggregatingCombinantVisitor()
	opts.noParent= opts.noParent||true
	var destination= opts.destination||"transforms"
	this[destination]= this.transform(opts)
}

// 2D string templates http://www.w3.org/TR/css3-2d-transforms/#transform-functions
var templates2d= {
	matrix: 6,
	rotate: 1,
	translate: 2,
	translateX: 1,
	translateY: 1,
	scale: 2,
	scaleX: 1,
	scaleY: 1,
	skewX: 1,
	skewY: 1 }

// 3D string templates http://www.w3.org/TR/css3-3d-transforms/#transform-functions
var templates3d= {
	matrix3d: 16,
	translate3d: 3,
	translateZ: 1,
	scale3d: 3,
	scaleZ: 1,
	rotate3d: 4,
	rotateZ: 1,
	skew: 2,
	perspective: 1 }

function _template(name,count,outputArray){
	outputArray= outputArray||[]
	outputArray.push(name+"(")
	var j= 0
	while(1){
		outputArray.push(null)
		if(++j != count)
			outputArray.push(",")
		else
			break
	}
	outputArray.push(") ")
	return outputArray
}

function _invoker(arr,name){
	var template_arguments_count= arr[name],
	  template_end= 2*(template_arguments_count-1),
	  template= _template(name,template_arguments_count)
	return function(){
		var i,
		  j= -1, 
		  max,
		  outputArray
		if(arguments.length > template_arguments_count){
			outputArray= arguments[template_arguments_count]
			i= outputArray.length+1
			outputArray.concat(template)
		} else {
			outputArray= template
			i= 1
		}
		max= i+ template_end

		for(;i <= max; i+= 2){
			outputArray[i]= arguments[++j]
		}
		return outputArray
	}
}

for(var name in templates2d){
	exports[name]= _invoker(templates2d,name)
}
for(var name in templates3d){
	exports[name]= _invoker(templates3d,name)
}

templates2d.rotate= 3
var minRotate= exports.rotate,
  fullRotate= _invoker(templates2d,"rotate")
exports.rotate= function(a,b,c){
	return b||c ? fullRotate(a,b,c) : minRotate(a)
}
