const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')


// Run Typeface through Calculator, populate array of objects

const allChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#$%&:()+=-~"/@.,' + "'"
const typeface = 'Wylie'

// When Converting Symbols .ai file to .svg, use the following naming conventions for select special characters:
// ':' = '_sc.svg'
// '/' = '_fs.svg'
// '.' = '_p.svg'

// const lowercase = 'abcdefghijklmnopqrstuvwxyz';
// const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const numbers = '0123456789';
// const symbols = '!?#$%&:()+=-~"/@.,'+"'";

const fontPath = './svgs/'+typeface+'/';

const readFile = (name, callback) => {

  // Check for special characters ( badChar )
	const badChar = [':' , '/' , '.'];

	if( badChar.includes(name)){
		var fileName;
		switch (name) {
			case ':':
				fileName = '_sc';
				break;
			case '/':
				fileName = '_fs';
				break;
			case '.':
				fileName = '_p';
				break;
		}

		fs.readFile(fontPath + fileName +'.svg', 'utf-8', function(err, data) {
		  	if(err){
		  		console.log(err);
		  	} else {
			  	const svgLetter = [ name, data];
			  	callback(svgLetter);
		  	}
			});

	} else{

	  if( name === name.toLowerCase()){

	  	fs.readFile(fontPath + name +'.svg', 'utf-8', function(err, data) {
		  	if(err){
		  		console.log(err);
		  	} else {
			  	const svgLetter = [ name, data];
			  	callback(svgLetter);
		  	}
			});
	  } else {
	  	fs.readFile(fontPath + name + name +'.svg', 'utf-8', function(err, data) {
		  	if (err) {
		  		console.log(err);
		  	} else {
			  	const svgLetter = [ name, data]
			  	callback(svgLetter)
		  	}
			});
	  }
	}
}

const parseSvg = (file, callback) => {
  svgson(
    file[1],
    {
      svgo: true,
      title: 'myFile',
      pathsKey: 'myPaths',
      customAttrs: {
        letter: file[0],
      },
    },
    function(result) {
    	callback(result)
    }
  )
}

const createCharObject = (svg, callback) => {

	var properties;

	if('childs' in svg.myPaths.childs[0] && svg.myPaths.childs[0].childs.length > 0 ){
		// console.log('childs is TWO levels deep')
		properties = spp.svgPathProperties(svg.myPaths.childs[0].childs[0].attrs.d);
	} else {
		// console.log('childs is ONE level deep')
		properties = spp.svgPathProperties(svg.myPaths.childs[0].attrs.d);
	}

	let letter = svg.letter
	var length = properties.getTotalLength();

	const charObj = {
		char : letter,
		length : length,
		width : parseFloat(svg.myPaths.attrs.width),
		height : parseFloat(svg.myPaths.attrs.height)
	}

	callback(charObj);
}

const calculateCharacterDimensions = (string, fontMap) => {

	const letterSpacing = 0;
	// const letterSpacing = ( string.length-1 ) * 1.5 // multiply by letter spacing value (in inches) ... add to total width
	const xMargin = 0;
	const yMargin = 0;

  // How to handle unsupported characters.

	const totalLength = Number(Math.round(string.split('').reduce( (acc, char) => { return acc + fontMap.find( i=> i.char === char ).length},0)* 0.01388894472361809045226+'e4')+'e-4');
	const totalWidth = Number(Math.round(string.split('').reduce( (acc, char) => { return acc + fontMap.find( i=> i.char === char ).width},0)* 0.01388894472361809045226+letterSpacing+'e4')+'e-4');
	const totalHeight = Number(Math.round( Math.max(...string.split('').map(char => fontMap.find( i=> i.char === char ).height), 0) * 0.01388894472361809045226+'e4')+'e-4');
	// console.log(totalLength);
	console.log('String : ', string);
	console.log('Total Length : ',totalLength + " inches");
	console.log('Total Width : ',totalWidth + " inches");
	console.log('Total Height : ',totalHeight + " inches");

	const dimensions = {
		string : string,
		length : totalLength,
		width : totalWidth,
		height : totalHeight
	}

	return dimensions;
}


const generateCharacterMap = (typeface) => {

  // Catch Here, is any svg file missing for a character

  const promiseArray = allChar.split('').map ( (char)=> {
  	return new Promise((resolve,reject) =>{

  		var firstPromise = new Promise( (resolve,reject) => {
  			readFile(char, (file)=> {
  				resolve(file);
  			})
  		})

  		firstPromise.then( (file) => {
  			return new Promise((resolve,reject) => {
  				parseSvg(file, (parsedSvg)=>{
  					resolve(parsedSvg);
  				})
  			})
  		}).then((svg)=>{
  			return new Promise((resolve,reject) => {
  				createCharObject(svg, (charObj) =>{
  					resolve(charObj);
  				})
  			})
  		}).then((charObj) => {
  			// console.log('inside last then, charObj : ', charObj)
  			fontMap[charObj.char] = charObj;
  			resolve(charObj)
  		}).catch( (error) => {
  		    console.log('error ', error)
  		});
  	});

  });

  Promise.all(promiseArray).then((results) => {
    fs.writeFile(`${typeface}.json`, JSON.stringify(results));
  })
};


// //generateCharacterMap(typeface);

const wylieMap = require('./wylie.json');

const calculateStringDimensions = (str, fontMap) => {

  if ( str === str.replace(/(\r\n|\n|\r)/gm,"") ){
   // no line breaks
   return calculateCharacterDimensions(str, fontMap);
  } else {

   const splitString = str.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

   var lineDimensions = [];

   for (i=0;i<splitString.length;i++){
     lineDimensions.push( calculateCharacterDimensions(splitString[i], fontMap) );
   }

   const totalLength = lineDimensions.reduce( (acc, line) => { return acc + line.length},0);
   const totalWidth = Math.max.apply(Math, lineDimensions.map(function(o) { return o.width; }));
   const totalHeight = lineDimensions.reduce( (acc, line) => { return acc + line.height},0);
   return {totalLength, totalWidth, totalHeight};
  }

}

  const input = 'abcAg';

  const dimensions = calculateStringDimensions(input, wylieMap);

  console.log(dimensions);



