const $ = require('shelljs');
const fs = require('fs');

const deployDir = __dirname;


exports.verifyDistDirectory = function () {
    const path = `${deployDir}/../dist`;
    if (!$.test('-d', path)) {
        throw `Distributions directory does not exist: "${path}"`;
    }
}

exports.verifyDockerSettings = function () {
    const dockerSettings = process.env['DOCKER_SETTINGS_JSON'];
    if (!(dockerSettings && dockerSettings.length)) {
        throw 'Docker settings is not set.\n' +
            '\tDOCKER_SETTINGS_JSON=\'{"host":"","ca":"","cert":"","key":""}\'';
    }
    let dockerSettingsJson;
    try {
        dockerSettingsJson = JSON.parse(dockerSettings)
    } catch (e) {
        throw 'Docker settings is not valid JSON. Valid format is:\n' +
            '\tDOCKER_SETTINGS_JSON=\'{"host":"","ca":"","cert":"","key":""}\'';
    }
    if (!(
            dockerSettingsJson.host && dockerSettingsJson.host.length &&
            dockerSettingsJson.ca && dockerSettingsJson.ca.length &&
            dockerSettingsJson.cert && dockerSettingsJson.ca.length &&
            dockerSettingsJson.key && dockerSettingsJson.key.length
        )) {
        throw 'Docker settings is not valid JSON. Valid format is:\n' +
            '\tDOCKER_SETTINGS_JSON=\'{"host":"","ca":"","cert":"","key":""}\'';
    }
}

exports.verifyDockerConnection = function () {
    const dockerSettings = JSON.parse(process.env['DOCKER_SETTINGS_JSON']);

    const dockerCertsDir = $.tempdir();
    fs.writeFileSync(`${dockerCertsDir}/ca.pem`, dockerSettings.ca);
    fs.writeFileSync(`${dockerCertsDir}/cert.pem`, dockerSettings.cert);
    fs.writeFileSync(`${dockerCertsDir}/key.pem`, dockerSettings.key);

    process.env['DOCKER_HOST'] = dockerSettings.host;
    process.env['DOCKER_TLS_VERIFY'] = 1;
    process.env['DOCKER_CERT_PATH'] = dockerCertsDir;

    if ($.exec(`docker version --format '{{.Server.Version}}'`).code !== 0) {
        throw 'Failed to connect to remote Docker daemon.';
    }
}

exports.verifyDockerCompose = function () {
    const filePath = `${deployDir}/docker-compose.yml`;
    if (!$.test('-f', filePath)) {
        throw `Docker Compose file does not exist: "${filePath}"`;
    }
    if ($.exec('docker-compose version').code !== 0) {
        throw 'Docker Compose not found.';
    }
    if ($.exec(`docker-compose --file ${filePath} config --quiet`).code !== 0) {
        throw `"${filePath}" is invalid.`;
    }
}