var exec = require('child_process').exec
var dedent = require('dedent')
var mkdirp = require('mkdirp')
var path = require('path')
var pump = require('pump')
var fs = require('fs')

exports.mkdir = function (dir, cb) {
  mkdirp(dir, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dir))
    fs.readdir(dir, function (err, files) {
      if (err) return cb(new Error('Could not read directory ' + dir))
      if (files.length) return cb(new Error('Directory contains files. This might create conflicts.'))
      cb()
    })
  })
}

exports.writePackage = function (dir, cb) {
  var filename = path.join(dir, 'package.json')
  var name = path.basename(dir)
  var file = dedent`
  {
    "name": "${name}",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "build": "browserify source/index.js -o bundles/bundle.js -t sheetify -t yo-yoify -t es2040 --env NODE_ENV=production",
      "create": "cd source && choo-scaffold",
      "start": "watchify source/index.js -o bundles/bundle.js -t sheetify -t yo-yoify -t es2040",
      "test": "standard && npm run test-deps",
      "test-deps": "dependency-check . --entry ./source/index.js && dependency-check . --entry ./source/index.js --extra --no-dev -i tachyons"
    }
  }
  `
  write(filename, file, cb)
}

exports.writeDat = function (dir, cb) {
  var filename = path.join(dir, 'dat.json')
  var name = path.basename(dir)
  var file = dedent`
  {
    "title": "${name}",
    "fallback_page": "index.html"
  }
  `
  write(filename, file, cb)
}

exports.writeGitIgnore = function (dir, cb) {
  var filename = path.join(dir, '.gitignore')
  var file = dedent`
    node_modules/
    .nyc_output/
    coverage/
    bundles/
    tmp/
    npm-debug.log*
    .DS_Store
  `

  write(filename, file, cb)
}

exports.writeDatIgnore = function (dir, cb) {
  var filename = path.join(dir, '.datignore')
  var file = dedent`
    node_modules/
  `

  write(filename, file, cb)
}

exports.writeReadme = function (dir, description, cb) {
  var filename = path.join(dir, 'README.md')
  var name = path.basename(dir)
  var file = dedent`
    # ${name}
    ${description}

    ## Commands
    Command                --| Description                                      |
    -------------------------|--------------------------------------------------|
    \`$ npm start\`          | Start the watch compiler
    \`$ npm test\`           | Lint, validate deps & run tests
    \`$ npm run build\`      | Compile files
    \`$ npm run create\`     | Generate a scaffold file
  `

  write(filename, file, cb)
}

exports.writeHtml = function (dir, cb) {
  var filename = path.join(dir, 'index.html')
  var projectname = path.basename(dir)
  var file = dedent`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${projectname}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <script src="/bundles/bundle.js"></script>
      </body>
    </html>
  `

  write(filename, file, cb)
}

exports.writeIndex = function (dir, cb) {
  var dirname = path.join(dir, 'source')
  var filename = path.join(dirname, 'index.js')
  var file = dedent`
    var css = require('sheetify')
    var choo = require('choo')

    css('./design/index.js')

    var app = choo()

    app.use(require('./plugins/clicks'))

    app.route('/', require('./views/main'))
    app.route('/*', require('./views/404'))

    module.exports = app.mount('body')\n
  `

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeNotFoundView = function (dir, cb) {
  var dirname = path.join(dir, 'source/views')
  var filename = path.join(dirname, '404.js')
  var projectname = path.basename(dir)
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${projectname} - route not found'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
      return html\`
        <body class="1 db p2">
          <h1>Route not found.</h1>
          <a class="pt2" href="/">Back to main.</a>
        </body>
      \`
    }\n
  `

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeMainView = function (dir, cb) {
  var dirname = path.join(dir, 'source/views')
  var filename = path.join(dirname, 'main.js')
  var projectname = path.basename(dir)
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${projectname} - main'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

      return html\`
        <body class="1 db">
          <div class="p2 1 db">
            <section class="1/2 dib fl">
              <h2>1.</h2>
              <p>
                Welcome to your new peer-to-peer project.
              </p>
              <p>
                Soon we'll leave you on your own, but hey, at least you can do what you want with it.
              </p>
            </section>
            <section class="1/2 dib fl">
              <h2>2.</h2>
              <p>
                Your project's <strong>source</strong> directory contains some sub-directories.
                Let's have a look at them.
              </p>

              <ul>
                <li>
                  <strong>design</strong><br>
                  Currently only serves as a connection between <a href="https://github.com/kodedninja/omnomnomnom">omnomnomnom</a> and your application.
                  Feel free to delete this or change <a href="https://github.com/kodedninja/omnomnomnom">omnomnomnom</a> to whatever framework you want.
                </li>
                <li>
                  <strong>plugins</strong><br>
                  Pieces of logic that are shared by multiple components.
                  They're called stores in choo, but I like this name more.
                </li>
                <li>
                  <strong>views</strong><br>
                  Combinations of components that are mapped to routes.
                </li>
              </ul>
            </section>
            <section class="1/2 dib fl">
              <h2>3.</h2>
              <p>
                So far we've provided you with one base view, <a
                href="/oh-no">one fallback view</a>, and one store. This serves
                as an example. A place to start from. It's your project now, so
                go ahead and delete them once you know how they work.
              </p>

              <p>Number of clicks stored: \${state.totalClicks}</p>

              <button class=""
                onclick=\${handleClick}>
                Emit a click event
              </button>
            </section>
          </main>
        </body>
      \`

      function handleClick () {
        emit('clicks:add', 1)
      }
    }\n
  `
  file = file.replace(/\\\$/g, '$')

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeIcon = function (dir, cb) {
  var iconPath = path.join(__dirname, 'assets/icon.png')
  var dirname = path.join(dir, 'assets')
  var filename = path.join(dirname, 'icon.png')
  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    var source = fs.createReadStream(iconPath)
    var sink = fs.createWriteStream(filename)
    pump(source, sink, function (err) {
      if (err) return cb(new Error('Could not write file ' + filename))
      cb()
    })
  })
}

exports.writePlugin = function (dir, cb) {
  var filename = path.join(dir, 'source/plugins/clicks.js')
  var file = dedent`
    module.exports = plugin

    function plugin (state, emitter) {
      state.totalClicks = 0

      emitter.on('DOMContentLoaded', function () {
        emitter.on('clicks:add', function (count) {
          state.totalClicks += count
          emitter.emit(state.events.RENDER)
        })
      })
    }\n
  `

  mkdirp(path.dirname(filename), function (err) {
    if (err) return cb(err)
    write(filename, file, cb)
  })
}

exports.writeDesign = function (dir, cb) {
  var filename = path.join(dir, 'source/design/index.js')
  var file = dedent`
    var omn = require('omnomnomnom')

    module.exports = omn()\n
  `

  mkdirp(path.dirname(filename), function (err) {
    if (err) return cb(err)
    write(filename, file, cb)
  })
}

exports.install = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, {env: process.env}, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.devInstall = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save-dev --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, {env: process.env}, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.createGit = function (dir, message, cb) {
  var init = 'git init'
  var add = 'git add -A'
  var config = 'git config user.email'
  var commit = 'git commit -m "' + message + '"'

  var popd = pushd(dir)
  exec(init, function (err) {
    if (err) return cb(new Error(init))

    exec(add, function (err) {
      if (err) return cb(new Error(add))

      exec(config, function (err) {
        if (err) return cb(new Error(config))

        exec(commit, function (err) {
          if (err) return cb(new Error(commit))
          popd()
          cb()
        })
      })
    })
  })
}

exports.runBuild = function (dir, cb) {
  var build = 'npm run build'

  var popd = pushd(dir)
  exec(build, function (err) {
    if (err) return cb(new Error(build))
    popd()
    cb()
  })
}

function pushd (dir) {
  var prev = process.cwd()
  process.chdir(dir)
  return function popd () {
    process.chdir(prev)
  }
}

function write (filename, file, cb) {
  fs.writeFile(filename, file, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
