const fs = require('fs');
const pkg = require('./package.json');
const _xml = fs.readFileSync('./static/config.xml', 'utf-8');

const xml2js = require('xml2js');
      xml2js.parseString(_xml, (err, res) => {

        if (err) { throw err; }

        res.widget.$.version = pkg.version;
        res.widget.description[0] = pkg.description;
        res.widget.author[0]._ = pkg.author.name;
        res.widget.author[0].$.href = pkg.author.url;

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(res);

        fs.writeFileSync( './static/config.xml', xml );
        console.log('./static/config.xml file created!')
    });
