# create-p2p-app

Create a fresh choo application for (probably) a site on the peer-to-peer web. Because starting a new project should take
minutes, not days.

A modified, simplified version of [create-choo-app](https://github.com/choojs/create-choo-app), with [Beaker Browser](https://beakerbrowser.com) applications in mind.

## Usage
```sh
$ npx create-p2p-app <project-directory>
```

## Dependencies
`create-p2p-app` installs the following dependencies:

Name                                                                 | Dependency Type | Description |
---------------------------------------------------------------------|-----------------|-------------|
[choo](https://github.com/choojs/choo)                               | Production      | Fast, 4kb framework.
[sheetify](https://github.com/stackcss/sheetify/)                    | Production      | Hyper performant CSS-in-JS.
[omnomnomnom](https://github.com/kodedninja/omnomnomnom)             | Production      | A functional CSS library.
[bankai](https://github.com/choojs/bankai)                           | Development     | An asset bundler and static file server.
[browserify](https://github.com/browserify/browserify)*              | Development     | `require('modules')` in the browser                        
[watchify](https://github.com/browserify/watchify)*                  | Development     | Watch mode for browserify builds
[choo-devtools](https://github.com/choojs/choo-devtools)             | Development     | Debug Choo applications.
[choo-scaffold](https://github.com/choojs/choo-scaffold)             | Development     | Generate new application files.
[dependency-check](https://github.com/maxogden/dependency-check)     | Development     | Verify project dependencies.
[standard](https://standardjs.com/)                                  | Development     | Statically check JavaScript files for errors.

`*` plus helper modules for these ([yo-yoify](https://github.com/shama/yo-yoify) and [es2040](https://github.com/ahdinosaur/es2040))

> Note: as a default it installs my little CSS framework, omnomnomnom, but only to speed up my project generation process.

## Removing Dependencies

If you want to remove Tachyons you can do so by running `npm uninstall tachyons` and removing the reference to Tachyons in `./index.js`.

## API
```txt
  $ create-p2p-app <project-directory> [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo application
    $ create-p2p-app

  Running into trouble? Feel free to file an issue:
  https://github.com/kodedninja/create-p2p-app/issues/new

  Do you enjoy using this software? Become a backer:
  https://opencollective.com/choo
```

## License
[MIT](https://tldrlegal.com/license/mit-license)
