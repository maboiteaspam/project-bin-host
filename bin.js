#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var through = require('through');
var split = require('split');
var hostile = require('hostile');
var program = require('commander');

program.version(pkg.version);


var runAsRoot = function(then){
  if(process.argv.indexOf('--elevated') > -1){
    then();
  } else {
    // when it s windows
    if(process.platform.match(/win/) && process.arch.match(/32/) ){
      // ensure the program is not started ad admin yet
      // then re run node with UAC control for admin privileges
      var elevate = require('node-windows').elevate;
      var args = process.argv;
      args.forEach(function(a,i){
        if(a.match(/\s/) ) args[i] = '"'+a+'"';
      });
      args.push(' --elevated');
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
    runAsRoot(function(){
      file = file || '.hostile';
      var done = function(){};
      fs.createReadStream(file, 'utf8')
        .pipe(split())
        .pipe(through(online))
        .on('close', done)
        .on('error', done);

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
    runAsRoot(function(){
      file = file || '.hostile';
      var done = function(){};
      fs.createReadStream(file, 'utf8')
        .pipe(split())
        .pipe(through(online))
        .on('close', done)
        .on('error', done);

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

