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

			      let properties = spp.svgPathProperties(result.myPaths.childs[0].attrs.d);
			      var length = properties.getTotalLength();
			      // Convert px to inches, 1px = 0.013899 in
			      let inchesLength = length * 0.013899;
			      console.log('The Letter '+key);
			      console.log('filename: '+key+'.svg')
			      console.log('length: '+length+' px');
			      console.log(inchesLength+ ' inches')
			      console.log('width: '+result.myPaths.attrs.width+' px')
			      console.log('('+result.myPaths.attrs.width*0.013899 + ' inches)')
			      console.log('height: '+result.myPaths.attrs.height+' px')
			      console.log('('+result.myPaths.attrs.height*0.013899 + ' inches)')
			      console.log('and '+key+' appears '+counts[key]+' times in the string')
			      totalLength += length * counts[key];
			      // Convert px to inches, 1px = 0.013899 in
			      let totalLengthInches = totalLength * 0.013899;
			      console.log('Total Length so far is: ');
			      console.log(totalLength+ ' px');
			      console.log(totalLengthInches+' inches')

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
		      // Convert px to inches, 1px = 0.013899 in
		      let inchesLength = length * 0.013899;
		      console.log('The Letter '+key);
		      console.log('filename: '+newKey+'.svg')
		      console.log('length: '+length+' px');
		      console.log(inchesLength+ ' inches')
		      console.log('width: '+result.myPaths.attrs.width+' px')
		      console.log('('+result.myPaths.attrs.width*0.013899 + ' inches)')
		      console.log('height: '+result.myPaths.attrs.height+' px')
		      console.log('('+result.myPaths.attrs.height*0.013899 + ' inches)')
		      console.log('and '+key+' appears '+counts[key]+' times in the string')
		      totalLength += length * counts[key];
		      // Convert px to inches, 1px = 0.013899 in
		      let totalLengthInches = totalLength * 0.013899;	
		      console.log('Total Length so far is: ')
		      console.log(totalLength+' px');
		      console.log(totalLengthInches+' inches')
		    }
		  )
		})
	}

});
