const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')

// Sample input : [ Input String , Typeface ]

// var inputArray = ['thequickbrownfoxjumpsoverthelazydog', 'Wylie']; 
// var inputArray = ['THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG', 'Wylie'];
var inputArray = ['1234567890', 'Wylie'];
// var inputArray = ['abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#$%&:()+=-~"/@.,' + "'", 'Wylie']

// var inputArray = ['!?#$%&:()+=-~"/@.,' + "'", 'Wylie']

var str = inputArray[0];

// Create Character Count(var counts) Object with keys(letters) and values(count)

var counts = {};

var ch, index, len, count;

for (index = 0, len = str.length; index < len; ++index) {
    ch = str.charAt(index);
    count = counts[ch];
    counts[ch] = count ? count + 1 : 1;
}

const fontPath = './svgs/'+inputArray[1]+'/';

const inputLetters = Object.keys(counts);

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

const calcSomething = (svg, callback) => {

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

	const calc = {
		// char : letter,
		filename : letter+'.svg',
		length : length,
		width : parseFloat(svg.myPaths.attrs.width),
		height : parseFloat(svg.myPaths.attrs.height),
		freq : parseInt(counts[letter])
	}

	callback(calc);
}

const promiseArray = inputLetters.map( (letter) => {
    return new Promise( (resolve, reject) => {

      var firstPromise = new Promise((resolve, reject) => {
          readFile(letter, (file) => {
              resolve(file);
          })
      })

      firstPromise.then( (file) => {
          return new Promise((resolve, reject) => {
              parseSvg(file, (parsedSvg) => {
                  resolve(parsedSvg);
              })
          })
      }).then( (svg) => {
          return new Promise((resolve, reject) => {
              calcSomething(svg, (calculation) => {
                  resolve(calculation);
              })
          })
      }).then( (calc) => {
          resolve(calc);
      }).catch( (error) => {
			    console.log('error ', error)
			})
    });
});

Promise.all(promiseArray).then((results) => {
	// Convert px to inches, 1px = 0.01388894472361809045226 in

	// const totalLengthPx = Number(Math.round(results.reduce((acc, obj) => { return acc + (obj.length * obj.freq)}, 0)+'e4')+'e-4') + " px";
	// const totalWidthPx = Number(Math.round( results.reduce((acc, obj) => { return acc + obj.width},0)+'e4')+'e-4') + " px";
 //  const totalHeightPx = Number(Math.round( Math.max(...results.map(o => o.height), 0)+'e4')+'e-4') + " px";

 //  console.log('String : ', str);
	// console.log('Characters : ', inputLetters.join())
	// console.log('Total Length : ',totalLengthPx);
	// console.log('Total Width : ',totalWidthPx);
	// console.log('Total Height : ',totalHeightPx);

	const totalLength = Number(Math.round(results.reduce((acc, obj) => { return acc + (obj.length * obj.freq)}, 0)* 0.01388894472361809045226+'e4')+'e-4') + " inches";
	const totalWidth = Number(Math.round( results.reduce((acc, obj) => { return acc + obj.width},0) * 0.01388894472361809045226+'e4')+'e-4') + " inches";
  const totalHeight = Number(Math.round( Math.max(...results.map(o => o.height), 0) * 0.01388894472361809045226+'e4')+'e-4') + " inches";

	console.log('String : ', str);
	console.log('Characters : ', inputLetters.join())
	console.log('Total Length : ',totalLength);
	console.log('Total Width : ',totalWidth);
	console.log('Total Height : ',totalHeight);

})


// // Dumbed down version for only 1 File, a.svg

// fs.readFile('./svgs/Wylie/&.svg', 'utf-8', function(err, data) {
//   svgson(
//     data,
//     {
//       svgo: true,
//       title: 'myFile',
//       pathsKey: 'myPaths',
//       customAttrs: {
//         foo: true,
//       },
//     },
//     function(result) {
//     	// console.log(result.myPaths.childs[1].childs[0].attrs.d)
//       let properties = spp.svgPathProperties(result.myPaths.childs[0].attrs.d);
//       var length = properties.getTotalLength();
//       // Convert px to inches, 1px = 0.013899 in
//       let inchesLength = length * 0.01388894472361809045226;

//       console.log('The Letter j');
//       console.log('filename: j.svg')
//       console.log('length: '+Number(Math.round(length+'e4')+'e-4')+' px ('+Number(Math.round(inchesLength+'e4')+'e-4')+ ' inches)');
//       // console.log('('+inchesLength.toFixed(3)+ ' inches)')

//       console.log('width: '+Number(Math.round(parseFloat(result.myPaths.attrs.width)+'e4')+'e-4')+' px ('+Number(Math.round(result.myPaths.attrs.width*0.01388894472361809045226+'e4')+'e-4') + ' inches)')
//       // console.log('('+result.myPaths.attrs.width*0.013899.toFixed(3) + ' inches)')

//       console.log('height: '+Number(Math.round(parseFloat(result.myPaths.attrs.height)+'e4')+'e-4')+' px ('+Number(Math.round(result.myPaths.attrs.height*0.01388894472361809045226+'e4')+'e-4') + ' inches)')
//       // console.log('('+result.myPaths.attrs.height*0.013899.toFixed(3) + ' inches)')
//     }
//   )
// });



