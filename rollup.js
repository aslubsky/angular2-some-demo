import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

export default {
    entry: 'aot/app/main-aot.js',
    dest: 'dist/app-builded.js', // output a single application bundle
    sourceMap: true,
    format: 'iife',
    plugins: [
        nodeResolve({
            jsnext: true,
            module: true
        }),
        commonjs({
            include: [
                'node_modules/rxjs/**',
                'node_modules/angular2-text-mask/dist/angular2TextMask.js',
                'node_modules/text-mask-core/dist/textMaskCore.js'
            ]
        }),
        uglify()
    ]
}