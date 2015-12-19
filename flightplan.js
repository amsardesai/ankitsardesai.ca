
// Import flightplan
const plan = require('flightplan');

// Set target
plan.target('production', {
  host: 'ssh.ankitsardesai.ca',
  username: 'ec2-user',
  agent: process.env.SSH_AUTH_LOCK,
}, {
  webRoot: '~/deployments',
  symlinkLocation: '/var/www/ankitsardesai',
});

const timestamp = new Date().getTime();
const tmpDir = `ankitsardesai-${timestamp}`;

/////////////
// SCRIPTS //
/////////////

// Deployment script - fly deploy:production

plan.local('deploy', transport => {
  transport.log('Copying files to remote host');
  const filesToCopy = transport.exec('git ls-files', { silent: true });
  transport.transfer(filesToCopy, `/tmp/${tmpDir}`);
});

plan.remote('deploy', transport => {
  const { webRoot, symlinkLocation } = plan.runtime.options;

  transport.log('Moving folder to web root');
  transport.exec(`cp -R /tmp/${tmpDir} ${webRoot}/`);
  transport.rm(`-rf /tmp/${tmpDir}`);

  transport.with(`cd ${webRoot}/${tmpDir}`, () => {

    transport.log('Installing dependencies');
    transport.exec(`npm install`);

    transport.log('Building ankitsardesai.ca');
    transport.exec(`npm run compile`);

    transport.log('Pruning dependencies');
    transport.exec(`npm prune --production`);

  });

  transport.log('Rebooting application');
  transport.exec(`ln -snf ${webRoot}/${tmpDir} ${symlinkLocation}`);
  transport.exec('pm2 reload ankitsardesai');

});






