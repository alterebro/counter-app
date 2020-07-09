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

    const _whitelist = root.ele('plugin', { 'name' : 'cordova-plugin-whitelist', 'version' : '1' });

        const _whitelistPr01 = root.ele('allow-intent', { 'href' : 'http://*/*' });
        const _whitelistPr02 = root.ele('allow-intent', { 'href' : 'https://*/*' });

    const _splash = root.ele('plugin', { 'name' : 'cordova-plugin-splashscreen' });

        const _splashPr01 = root.ele('preference', { 'name' : 'SplashMaintainAspectRatio', 'value' : 'true' });
        const _splashPr02 = root.ele('preference', { 'name' : 'SplashShowOnlyFirstTime', 'value' : 'false' });
        const _splashPr03 = root.ele('preference', { 'name' : 'AutoHideSplashScreen', 'value' : 'true' });
        const _splashPr04 = root.ele('preference', { 'name' : 'SplashScreenDelay', 'value' : '3000' });
        const _splashPr05 = root.ele('preference', { 'name' : 'ShowSplashScreenSpinner', 'value' : 'false' });

    const _splashScreen = root.ele('splash', { 'src' : 'counter-app.jpg' });

    const _icon = root.ele('icon', {'src' : 'counter-app-icon.png'});
    const _platform = root.ele('platform', { 'name' : 'android'}, '');

const xml = root.end({ pretty: true});

fs.writeFileSync('./static/config.xml', xml);
console.log('config.xml file created!');
