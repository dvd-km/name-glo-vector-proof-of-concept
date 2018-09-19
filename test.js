const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')

// Sample input : [ Input String , Typeface ]

var inputArray = ['aA\nJj\n22', 'Wylie']
var str = inputArray[0].replace(/(\r\n|\n|\r)/gm,"");




const fontPath = './svgs/'+inputArray[1]+'/';

// Finding width, height of text as entered

// Split original string into array by new line

// var stringSplitArray = inputArray[0].split("\n");
// var numberOfLines = stringSplitArray.length;

// var totalLineHeight = 0;
// var totalLineWidth = 0;

// if( numberOfLines > 1){
// 	stringSplitArray.forEach(function(string){
// 		var thisLineHeight = 0;
// 		var thisLineWidth = 0;

// 		for ( var x = 0; x < string.length; x++)
// 			{
// 				var char = string.charAt(x);

// 				if( char === char.toLowerCase()){
// 				// lowercase letter
// 					fs.readFile(fontPath + char + '.svg', 'utf-8', function(err, data) {
// 					  svgson(
// 					    data,
// 					    {
// 					      svgo: true,
// 					      title: 'myFile',
// 					      pathsKey: 'myPaths',
// 					      customAttrs: {
// 					        foo: true,
// 					      },
// 					    },
// 					    function(result) {
// 					      // console.log('width: '+result.myPaths.attrs.width)
// 					      // console.log('height: '+result.myPaths.attrs.height)
					      
// 					      if( result.myPaths.attrs.height > thisLineHeight ){
// 					      	thisLineHeight = result.myPaths.attrs.height;
// 					      }
// 					      thisLineWidth += result.myPaths.attrs.width;
// 					      return thisLineWidth
// 					    }
// 					  )
// 					})

// 				} else {
// 				// Uppercase letter
// 				var newChar = char+char;

// 				fs.readFile(fontPath + newChar + '.svg', 'utf-8', function(err, data) {
// 				  svgson(
// 				    data,
// 				    {
// 				      svgo: true,
// 				      title: 'myFile',
// 				      pathsKey: 'myPaths',
// 				      customAttrs: {
// 				        foo: true,
// 				      },
// 				    },
// 				    function(result) {
// 				      console.log('width: '+result.myPaths.attrs.width)
// 				      console.log('height: '+result.myPaths.attrs.height)
// 				    }
// 				  )
// 				})	

// 				}

// 			}
// 		if (thisLineWidth > totalLineWidth){
// 			totalLineWidth = thisLineWidth;
// 		}
// 		console.log('this lines width :')
// 		console.log(thisLineWidth)
// 		console.log('total line width :')
// 		console.log(totalLineWidth)

// 		console.log('this lines height :')
// 		console.log(thisLineHeight)
// 		console.log('total line height :')
// 		console.log(totalLineHeight)
// 	})
// } else {

// }

// return;

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

// const fontPath = './svgs/'+inputArray[1]+'/';

const inputLetters = Object.keys(counts);

var totalLength = 0;
var totalWidth = 0;
var totalHeight = 0;

inputLetters.forEach(function(key) {
	if( key === key.toLowerCase()){
		// lowercase letter
			fs.readFile(fontPath + key + '.svg', 'utf-8', function(err, data) {
			  svgson(
			    data,
			    {
			      svgo: true,
			      title: 'myFile',
			      pathsKey: 'myPaths',
			      customAttrs: {
			        foo: true,
			      },
			    },
			    function(result) {
			      console.log(result.myPaths.attrs.width)
			      console.log(result.myPaths.attrs.height)

			      totalWidth += result.myPaths.attrs.width;

			      // let properties = spp.svgPathProperties(result.myPaths.childs[0].attrs.d);
			      // var length = properties.getTotalLength();
			      // // console.log('the letter '+key+' is length ::::')
			      // // console.log(length)
			      // // console.log('and '+key+' appears '+counts[key]+' times in the string')
			      // totalLength += length * counts[key];
			      // console.log('Total Length so far is: ')
			      // console.log(totalLength);
			    }
			  )
			})

	} else {
		// Uppercase letter
		var newKey = key+key;

		fs.readFile(fontPath + newKey + '.svg', 'utf-8', function(err, data) {
		  svgson(
		    data,
		    {
		      svgo: true,
		      title: 'myFile',
		      pathsKey: 'myPaths',
		      customAttrs: {
		        foo: true,
		      },
		    },
		    function(result) {
		      let properties = spp.svgPathProperties(result.myPaths.childs[0].attrs.d);
		      var length = properties.getTotalLength();
		      // console.log('the letter '+key+' is length ::::')
		      // console.log(length)
		      // console.log('and '+key+' appears '+counts[key]+' times in the string')
		      totalLength += length * counts[key];
		      console.log('Total Length so far is: ')
		      console.log(totalLength);
		    }
		  )
		})
	}

});



// Output all info for the letter. 
// width, height, path length all in INCHES, 2 dec point