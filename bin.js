#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var path = require('path');
var through = require('through');
var split = require('split');
var hostile = require('hostile');
var program = require('commander');

program.version(pkg.version);


var runAsRoot = function(file, then){
  if(process.argv.indexOf('--elevated') > -1){
    then();
  } else {
    // when it s windows
    if(process.platform.match(/win/) ){
      // ensure the program is not started ad admin yet
      // then re run node with UAC control for admin privileges
      var elevate = require('node-windows').elevate;
      var args = process.argv;
      args.shift();
      args.unshift(process.execPath);
      args.forEach(function(a,i){
        if(file===a) a = path.resolve(file);// privilege elevation on windows, won t restore cwd, needs to send only absolute path.
        if(a.match(/\s/) ) args[i] = '"'+a+'"';
      });
      args.push('--elevated');
      console.log(args.join(' '));
      elevate(args.join(' '));
    }else{
      // otherwise it s linux friendly system
      // ensure process gid / uid
      if(require('is-root')()){
        then();
      }else{
        // otherwise print error
        console.error('You must be root to run this command:\n');
        console.error('\tsudo '+process.argv.join(' '));
        console.error(' ');
        process.exit();
      }
    }
  }

};

program.command('load [file]')
  .option('--elevated', 'Internal option')
  .description('Load given file into your system')
  .action(function(file){
    file = file || '.hostile';
    runAsRoot(file,function(){
      var done = function(){
        if(process.platform.match(/win/) ){
          require('child_process').exec('ipconfig /flushdns');
        }
      };
      var error = function(e){
        console.error(e);
      };
      fs.createReadStream(file, 'utf8')
        .pipe(split())
        .pipe(through(online))
        .on('close', done)
        .on('error', error);

      function online (line) {
        var matches = /^\s*?([^#]+?)\s+([^#]+?)$/.exec(line)
        if (matches && matches.length === 3) {
          // Found a hosts entry
          var ip = matches[1];
          var host = matches[2];
          hostile.set(ip, host);
        } else {
          // Found a comment, blank line, or something else
          //- ignore it
        }
      }
    });
  });

program.command('unload [file]')
  .option('--elevated', 'Internal option')
  .description('Unload given file into your system')
  .action(function(file){
    file = file || '.hostile';
    runAsRoot(file,function(){
      var done = function(){
        if(process.platform.match(/win/) ){
          require('child_process').exec('ipconfig /flushdns');
        }
      };
      var error = function(e){
        console.error(e);
      };
      fs.createReadStream(file, 'utf8')
        .pipe(split())
        .pipe(through(online))
        .on('close', done)
        .on('error', error);

      function online (line) {
        var matches = /^\s*?([^#]+?)\s+([^#]+?)$/.exec(line)
        if (matches && matches.length === 3) {
          // Found a hosts entry
          var ip = matches[1];
          var host = matches[2];
          hostile.remove(ip, host);
        } else {
          // Found a comment, blank line, or something else
          //- ignore it
        }
      }
    });
  });

program.command('*')
  .description('Help')
  .action(function(){
    program.outputHelp();
  });

program.parse(process.argv);

