
# flightplan.coffee
plan = require 'flightplan'

plan.target 'production', (
  host: 'ssh.ankitsardesai.ca'
  username: 'ec2-user'
  agent: process.env.SSH_AUTH_SOCK
), (
  webRoot: '~/deployments'
  symlinkLocation: '/var/www/ankitsardesai'
)

tmpDir = "ankitsardesai-#{new Date().getTime()}"

# # # # # #
# SCRIPTS #
# # # # # #

# Deployment script - fly deploy:production

plan.local 'deploy', (transport) ->
  transport.log 'Copying files to remote host'
  filesToCopy = transport.exec 'git ls-files', (silent: true)
  transport.transfer filesToCopy, "/tmp/#{tmpDir}"

plan.remote 'deploy', (transport) ->
  webRoot = plan.runtime.options.webRoot
  symlinkLocation = plan.runtime.options.symlinkLocation

  transport.log 'Moving folder to web root'
  transport.exec "cp -R /tmp/#{tmpDir} #{webRoot}/"
  transport.rm "-rf /tmp/#{tmpDir}"

  transport.log 'Installing dependencies'
  transport.exec "npm --production --prefix #{webRoot}/#{tmpDir} install #{webRoot}/#{tmpDir}"

  transport.log 'Rebooting application'
  transport.exec "ln -snf #{webRoot}/#{tmpDir} #{symlinkLocation}"
  transport.exec 'pm2 reload ankitsardesai'






