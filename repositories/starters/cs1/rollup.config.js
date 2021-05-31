import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;
const quick_compile = process.env.QUICK_COMPILE === "true"

console.log(`production: ${production ? "on" : "off"}, quick_compile: ${quick_compile ? "on" : "off"}`)

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/' + (quick_compile ? 'bundle_dev.js' : 'bundle.js')
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),
    
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && !quick_compile && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && !quick_compile && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && !quick_compile && terser(),

		production && !quick_compile && babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      babelHelpers: 'bundled',
      comments: false,
      presets: [
        ["@babel/preset-env", {
          loose: false,
          modules: false,
          targets: {
            esmodules: true,
            ios: "12"
          }
        }]
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
      ]
    }),

	],
	watch: {
		clearScreen: false
	}
};
