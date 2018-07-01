const $ = require('shelljs');

const deployDir = __dirname;
const distDir = `${deployDir}/../dist`;


function verifySettings() {
    console.log('# Verifying settings...');
    const script = require('./verify-settings');
    try {
        script.verifyDistDirectory();
        script.verifyDockerSettings();
        script.verifyDockerConnection();
        script.verifyDockerCompose();
    } catch (e) {
        console.error('## Settings are invalid!');
        console.error(e);
        process.exit(1);
    }
}

function pushContainers() {
    console.log('# Pushing Docker Compose containers...');
    const dcOptions = `--file ${deployDir}/docker-compose.yml --project-name home-server`;

    console.log('## Removing previous containers...');
    $.exec(`docker-compose ${dcOptions} rm -f`);

    console.log('## Copying Nginx site templates...');
    const nginxDir = `${distDir}/nginx/`;
    if (!$.test('-d', nginxDir)) {
        $.mkdir(nginxDir);
    }
    $.cp(`${deployDir}/nginx-templates/*.conf`, nginxDir);

    console.log('## Building containers...');
    $.exec(`docker-compose ${dcOptions} build --force-rm --no-cache`);

    console.log('## Pushing new containers...');
    $.exec(`docker-compose ${dcOptions} up -d`);
}


verifySettings();
pushContainers();