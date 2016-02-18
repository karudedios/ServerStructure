"use strict";

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const argv = require('yargs').argv;
const rename = require('gulp-rename');
const eventStream = require('event-stream');
const template = require('gulp-template');

const buildBasePath = path.join.bind(null, __dirname);
const buildGeneratorsPath = buildBasePath.bind(null, 'generators');

const buildServerPath = buildBasePath.bind(null, 'server');
const buildApiPath = buildServerPath.bind(null, 'api');

const forEachFolder = (stream, predicate) =>
  eventStream.map(function(data, cb){
    if(data.isDirectory() && stream && predicate(data)){
      console.log(`Directory Found: ${data.path}`);
      stream(data);
    }

    cb(null, data);
  });

gulp.task('scaffold', () => {
  const name = argv.name;
  const parent = argv.parent && argv.parent.concat('.') || '';

  const destination = buildApiPath(parent.replace(/\./g, '\\').concat(name));

  console.log(destination);

  gulp.src(buildGeneratorsPath('components', '**', '*.**'))
    .pipe(template({ name }))
    .pipe(rename(path => { path.basename = path.basename.replace('{{name}}', name); }))
    .pipe(gulp.dest(destination));
});

gulp.task('bundle-api', () => {
  let components = [];
  const basePath = buildApiPath();
  const searchPath = buildApiPath('**', '*');

  const toTitleCase = (str) => ([str[0].toUpperCase()].concat(str.slice(1)).join(''));

  return gulp.src(searchPath)
    .pipe(forEachFolder(f => {
      const splitPath = f.path.replace(basePath + '\\', '').split('\\').reverse();
      
      const getPath = (arr) => [{ name: toTitleCase(arr[0]), path: arr.reverse().join('/') }];

      components = components
        .concat(getPath(splitPath))
        .filter((n, idx, orig) => idx === orig.map(k => k.name).indexOf(n.name))
    }, f => {
      return fs.existsSync(`${f.path}/routes.js`);
    })).on('end', () => {
      const generatorApiPath = buildGeneratorsPath('api');

      components = components
        .map(obj => ({ name: obj.name, path: `./${obj.path}`}))
        .sort((a, b) => a.path.length > b.path.length);

      return gulp.src(`${generatorApiPath}/routes.js`)
        .pipe(template({ components }))
        .pipe(gulp.dest(basePath));
    });
});

gulp.task('default', [ 'bundle-api' ]);

//import {{ name }} from {{ path }};