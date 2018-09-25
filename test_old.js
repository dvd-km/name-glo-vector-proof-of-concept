const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')


// ---------------------- OLD WAY, WORKING FROM STARTING POINT OF SPECIFIC STRING  --------------------


// Dumbed down version for only 1 File, a.svg

// fs.readFile('./svgs/Wylie/j.svg', 'utf-8', function(err, data) {
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





// Working off Robo Promise Example ::


// Sample input : [ Input String , Typeface ]

var inputArray = ['aaJa2j', 'Wylie']
var str = inputArray[0];

// Create Character Count(var counts) Object with keys(letters) and values(count)

var counts = {};

var ch, index, len, count;

for (index = 0, len = str.length; index < len; ++index) {
    ch = str.charAt(index);
    count = counts[ch];
    counts[ch] = count ? count + 1 : 1;
}

// Pull svg's from file system and get lengths of each character, multiply by frequency and add to total.
// Note : To differentiate from lower case and uppercase file names should be formatted as following
// lowercase a : a.svg
// uppercase A : aa.svg

const fontPath = './svgs/'+inputArray[1]+'/';

const inputLetters = Object.keys(counts);

var totalLength = 0;

const readFile = (name, callback) => {

  // console.log('read File : ', name );
  if( name === name.toLowerCase()){
  	fs.readFile(fontPath + name +'.svg', 'utf-8', function(err, data) {
	  	// console.log('inside fs.readFile, data returned : ');
	  	// console.log(data);
	  	const svgLetter = [ name, data]
	  	callback(svgLetter)
		});
  } else {
  	fs.readFile(fontPath + name + name +'.svg', 'utf-8', function(err, data) {
	  	// console.log('inside fs.readFile, data returned : ');
	  	// console.log(data);
	  	const svgLetter = [ name, data]
	  	callback(svgLetter)
		});
  }
  
}

const parseSvg = (file, callback) => {
	// console.log('parse File : ',file );	
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
	// console.log('inside calcSomething');
	
	let properties = spp.svgPathProperties(svg.myPaths.childs[0].attrs.d);
	let letter = svg.letter

	var length = properties.getTotalLength();
	// Convert px to inches, 1px = 0.013899 in
	let inchesLength = length * 0.01388894472361809045226;

	//totalLength += length * counts[letter];
	console.log('The Letter '+letter);
	console.log('Filename: '+letter+'.svg')
	console.log('Appears '+counts[letter]+' time(s)')
	console.log('length: '+Number(Math.round(length+'e4')+'e-4')+' px ('+Number(Math.round(inchesLength+'e4')+'e-4')+ ' inches)');
	console.log('width: '+Number(Math.round(parseFloat(svg.myPaths.attrs.width)+'e4')+'e-4')+' px ('+Number(Math.round(svg.myPaths.attrs.width*0.01388894472361809045226+'e4')+'e-4') + ' inches)')
	console.log('height: '+Number(Math.round(parseFloat(svg.myPaths.attrs.height)+'e4')+'e-4')+' px ('+Number(Math.round(svg.myPaths.attrs.height*0.01388894472361809045226+'e4')+'e-4') + ' inches)')

	const calc = {
		filename : ''
		length : ''
	}

	callback(calc);
}

const promiseArray = inputLetters.map( (letter) => {
    return new Promise( (resolve, reject) => {

      var firstPromise = new Promise ((resolve, reject) => {
          readFile(letter, (file) => {
              resolve(file);
          })
      })

      firstPromise.then( (file) => {
          return new Promise ((resolve, reject) => {
              parseSvg(file, (parsedSvg) => {
                  resolve(parsedSvg);
              })
          })
      }).then( (svg) => {
          return new Promise ((resolve, reject) => {
              calcSomething(svg, (calculation) => {
                  resolve(calculation);
              })
          })
      }).then( (calc) => {
          resolve(calc);
          // console.log('Largest Promise resolved, returns: ')
          // console.log(calc)
					// let totalInches = totalLength * 0.01388894472361809045226;
					// console.log("Total Length is : ",totalLength)
					// console.log("("+totalInches + " inches)")
      })
    });
});

// Promise.all(promiseArray).then((results) => {
// 	//
// 	const totalLength = results.reduce( (result, total) => {
// 		total += result.length;
// 		return total;
// 	},0);

// 	console.log(totalLength);

// })
