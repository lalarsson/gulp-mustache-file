var stream = through.obj((file, enc, cb) => {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME,
                'Streams are not supported!'));
            return cb();
        } else if (file.isBuffer()) {
            const paths = file.path;
            const whereAmI = path.dirname(paths)
                .split('/');
            const format = whereAmI[whereAmI.length - 1];
            const p = path.join(__dirname, 'src', 'templates',
                format, 'mockdata.js');
            const config = require(p)
                .mockdata;
            let buffer = new Buffer(file.contents.toString());
            if (format === 'cube') {
                buffer = new Buffer(render(file.contents.toString(),
                    config));
            }
            file.contents = buffer;
            this.push(file);
            cb();
        } else {
            this.push(file);
            cb();
        }
