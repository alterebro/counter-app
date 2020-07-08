const fs = require('fs');
const pkg = require('./package.json');
const builder = require('xmlbuilder');

const root = builder.create('widget')
    .att('xmlns', 'http://www.w3.org/ns/widgets')
    .att('xmlns:gap', 'http://phonegap.com/ns/1.0')
    .att('id', 'com.alterebro.counter-app')
    .att('version', pkg.version);

    const _name = root.ele('name', 'Counter App');
    const _desc = root.ele('description', pkg.description);
    const _author = root.ele('author', { 'href' : pkg.author.url }, pkg.author.name);

    const _apilevel = root.ele('preference', {
        'name' : 'android-targetSdkVersion',
        'value' : '28'
    });

    const _icon = root.ele('icon', {'src' : 'counter-app-icon.png'});
    const _platform = root.ele('platform', { 'name' : 'android'}, '');

const xml = root.end({ pretty: true});

fs.writeFileSync('./static/config.xml', xml);
console.log('config.xml file created!');
