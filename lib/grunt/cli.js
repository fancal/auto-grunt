/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
//函数的主要功能是提取用户输入的命令以及任务,其中任务存储在cli.tasks，命令options存放cli.options
var grunt = require('../grunt');

// Nodejs libs.
var path = require('path');
//提取输入命令中的参数(有-)与任务的库
// External libs.
var nopt = require('nopt');

//提取输入命令中的参数(有-)与任务的库传递到grunt.tasks中 
// This is only executed when run via command line.
var cli = module.exports = function(options, done) {
  // CLI-parsed options override any passed-in "default" options.
  if (options) {
    // For each defult option...
    Object.keys(options).forEach(function(key) {
      if (!(key in cli.options)) {
        // If this option doesn't exist in the parsed cli.options, add it in.
        cli.options[key] = options[key];
      } else if (cli.optlist[key].type === Array) {
        // If this option's type is Array, append it to any existing array
        // (or create a new array).
        [].push.apply(cli.options[key], options[key]);
      }
    });
  }

  // Run tasks.
  grunt.tasks(cli.tasks, cli.options, done);
};
//命令可以有的配置项
// Default options.
var optlist = cli.optlist = {
  help: {
    short: 'h',
    info: 'Display this help text.',
    type: Boolean
  },
  base: {
    info: 'Specify an alternate base path. By default, all file paths are relative to the "grunt.js" gruntfile. (grunt.file.setBase) *',
    type: path
  },
  color: {
    info: 'Disable colored output.',
    type: Boolean,
    negate: true
  },
  config: {
    info: 'Specify an alternate "grunt.js" gruntfile.',
    type: path
  },
  debug: {
    short: 'd',
    info: 'Enable debugging mode for tasks that support it. For detailed error stack traces, specify --debug 9.',
    type: Number
  },
  force: {
    short: 'f',
    info: 'A way to force your way past warnings. Want a suggestion? Don\'t use this option, fix your code.',
    type: Boolean
  },
  tasks: {
    info: 'Additional directory paths to scan for task and "extra" files. (grunt.loadTasks) *',
    type: Array
  },
  npm: {
    info: 'Npm-installed grunt plugins to scan for task and "extra" files. (grunt.loadNpmTasks) *',
    type: Array
  },
  write: {
    info: 'Disable writing files (dry run).',
    type: Boolean,
    negate: true
  },
  verbose: {
    short: 'v',
    info: 'Verbose mode. A lot more information output.',
    type: Boolean
  },
  version: {
    info: 'Print the grunt version.',
    type: Boolean
  }
};

// Parse `optlist` into a form that nopt can handle.
var aliases = {};
var known = {};

Object.keys(optlist).forEach(function(key) {
  var short = optlist[key].short;
  if (short) {
    aliases[short] = '--' + key;
  }
  known[key] = optlist[key].type;
});

var parsed = nopt(known, aliases, process.argv, 2);
//分离出任务
cli.tasks = parsed.argv.remain;
//分离出命令参数
cli.options = parsed;
delete parsed.argv;
// Initialize any Array options that weren't initialized.
Object.keys(optlist).forEach(function(key) {
  if (optlist[key].type === Array && !(key in cli.options)) {
    cli.options[key] = [];
  }
});
