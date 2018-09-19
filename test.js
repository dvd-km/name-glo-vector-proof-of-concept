const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')

// Sample input : [ Input String , Typeface ]

var inputArray = ['2JajAJaaj2J', 'Wylie']
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
			      // console.log(result.myPaths.childs)
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
