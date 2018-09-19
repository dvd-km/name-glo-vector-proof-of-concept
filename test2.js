const spp = require("svg-path-properties");
const svgson = require('svgson')

const fs = require('fs')

fs.readFile('./svgs/test_50.svg', 'utf-8', function(err, data) {
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
      console.log('ength ::::')
      console.log(length)

    }
  )
})