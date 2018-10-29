import string from 'rollup-plugin-string';
import resolve from './rollup-es/rollup-plugin-node-resolve';
import commonjs from './rollup-es/rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import Debug from 'debug';
const debug = Debug('rollup.config.mjs')
function _highlight() {
  const data = _interopRequireWildcard(require("@babel/highlight"));

  _highlight = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let deprecationWarningShown = false;

function getDefs(chalk) {
  return {
    gutter: chalk.grey,
    marker: chalk.red.bold,
    message: chalk.red.bold
  };
}

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

function getMarkerLines(loc, source, opts) {
  const startLoc = Object.assign({
    column: 0,
    line: -1
  }, loc.start);
  const endLoc = Object.assign({}, startLoc, loc.end);
  const {
    linesAbove = 2,
    linesBelow = 3
  } = opts || {};
  const startLine = startLoc.line;
  const startColumn = startLoc.column;
  const endLine = endLoc.line;
  const endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);

  if (startLine === -1) {
    start = 0;
  }

  if (endLine === -1) {
    end = source.length;
  }

  const lineDiff = endLine - startLine;
  const markerLines = {};

  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;

      if (!startColumn) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [0, endColumn];
      } else {
        const sourceLength = source[lineNumber - i].length;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  } else {
    if (startColumn === endColumn) {
      if (startColumn) {
        markerLines[startLine] = [startColumn, 0];
      } else {
        markerLines[startLine] = true;
      }
    } else {
      markerLines[startLine] = [startColumn, endColumn - startColumn];
    }
  }

  return {
    start,
    end,
    markerLines
  };
}

function codeFrameColumns(rawLines, loc, opts = {}) {
  const highlighted = (opts.highlightCode || opts.forceColor) && (0, _highlight().shouldHighlight)(opts);
  const chalk = (0, _highlight().getChalk)(opts);
  const defs = getDefs(chalk);

  const maybeHighlight = (chalkFn, string) => {
    return highlighted ? chalkFn(string) : string;
  };

  if (highlighted) rawLines = (0, _highlight().default)(rawLines, opts);
  const lines = rawLines.split(NEWLINE);
  const {
    start,
    end,
    markerLines
  } = getMarkerLines(loc, lines, opts);
  const hasColumns = loc.start && typeof loc.start.column === "number";
  const numberMaxWidth = String(end).length;
  let frame = lines.slice(start, end).map((line, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} | `;
    const hasMarker = markerLines[number];
    const lastMarkerLine = !markerLines[number + 1];

    if (hasMarker) {
      let markerLine = "";

      if (Array.isArray(hasMarker)) {
        const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = ["\n ", maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")), markerSpacing, maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)].join("");

        if (lastMarkerLine && opts.message) {
          markerLine += " " + maybeHighlight(defs.message, opts.message);
        }
      }

      return [maybeHighlight(defs.marker, ">"), maybeHighlight(defs.gutter, gutter), line, markerLine].join("");
    } else {
      return ` ${maybeHighlight(defs.gutter, gutter)}${line}`;
    }
  }).join("\n");

  if (opts.message && !hasColumns) {
    frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;
  }

  if (highlighted) {
    return chalk.reset(frame);
  } else {
    return frame;
  }
}

var to_ascii = typeof atob == "undefined" ? function(b64) {
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
      // Node >= 4.5.0
      return Buffer.from(b64, "base64").toString();
    } else {
      // Node < 4.5.0, old API, manual safeguards
      if (typeof b64 !== "string") throw new Errror("\"b64\" must be a string");
      return new Buffer(b64, "base64").toString();
    }
} : atob;

var to_base64 = typeof btoa == "undefined" ? function(str) {
    if (Buffer.from && Buffer.from !== Uint8Array.from) {
      // Node >= 4.5.0
      return Buffer.from(str).toString("base64");
    } else {
      // Node < 4.5.0, old API, manual safeguards
      if (typeof str !== "string") throw new Errror("\"str\" must be a string");
      return new Buffer(str).toString("base64");
    }
} : btoa;

function read_source_map(code) {
    var match = /\n\/\/# sourceMappingURL=data:application\/json(;.*?)?;base64,(.*)/.exec(code);
    if (!match) {
        AST_Node.warn("inline source map not found");
        return null;
    }
    return to_ascii(match[2]);
}

function set_shorthand(name, options, keys) {
    if (options[name]) {
        keys.forEach(function(key) {
            if (options[key]) {
                if (typeof options[key] != "object") options[key] = {};
                if (!(name in options[key])) options[key][name] = options[name];
            }
        });
    }
}

function init_cache(cache) {
    if (!cache) return;
    if (!("props" in cache)) {
        cache.props = new Dictionary();
    } else if (!(cache.props instanceof Dictionary)) {
        cache.props = Dictionary.fromObject(cache.props);
    }
}

function to_json(cache) {
    return {
        props: cache.props.toObject()
    };
}

function minify(files, options) {
    var warn_function = AST_Node.warn_function;
    try {
        options = defaults(options, {
            compress: {},
            ecma: undefined,
            enclose: false,
            ie8: false,
            keep_classnames: undefined,
            keep_fnames: false,
            mangle: {},
            module: false,
            nameCache: null,
            output: {},
            parse: {},
            rename: undefined,
            safari10: false,
            sourceMap: false,
            timings: false,
            toplevel: false,
            warnings: false,
            wrap: false,
        }, true);
        var timings = options.timings && {
            start: Date.now()
        };
        if (options.keep_classnames === undefined) {
            options.keep_classnames = options.keep_fnames;
        }
        if (options.rename === undefined) {
            options.rename = options.compress && options.mangle;
        }
        set_shorthand("ecma", options, [ "parse", "compress", "output" ]);
        set_shorthand("ie8", options, [ "compress", "mangle", "output" ]);
        set_shorthand("keep_classnames", options, [ "compress", "mangle" ]);
        set_shorthand("keep_fnames", options, [ "compress", "mangle" ]);
        set_shorthand("module", options, [ "parse", "compress", "mangle" ]);
        set_shorthand("safari10", options, [ "mangle", "output" ]);
        set_shorthand("toplevel", options, [ "compress", "mangle" ]);
        set_shorthand("warnings", options, [ "compress" ]);
        var quoted_props;
        if (options.mangle) {
            options.mangle = defaults(options.mangle, {
                cache: options.nameCache && (options.nameCache.vars || {}),
                eval: false,
                ie8: false,
                keep_classnames: false,
                keep_fnames: false,
                module: false,
                properties: false,
                reserved: [],
                safari10: false,
                toplevel: false,
            }, true);
            if (options.mangle.properties) {
                if (typeof options.mangle.properties != "object") {
                    options.mangle.properties = {};
                }
                if (options.mangle.properties.keep_quoted) {
                    quoted_props = options.mangle.properties.reserved;
                    if (!Array.isArray(quoted_props)) quoted_props = [];
                    options.mangle.properties.reserved = quoted_props;
                }
                if (options.nameCache && !("cache" in options.mangle.properties)) {
                    options.mangle.properties.cache = options.nameCache.props || {};
                }
            }
            init_cache(options.mangle.cache);
            init_cache(options.mangle.properties.cache);
        }
        if (options.sourceMap) {
            options.sourceMap = defaults(options.sourceMap, {
                content: null,
                filename: null,
                includeSources: false,
                root: null,
                url: null,
            }, true);
        }
        var warnings = [];
        if (options.warnings && !AST_Node.warn_function) {
            AST_Node.warn_function = function(warning) {
                warnings.push(warning);
            };
        }
        if (timings) timings.parse = Date.now();
        var toplevel;
        if (files instanceof AST_Toplevel) {
            toplevel = files;
        } else {
            if (typeof files == "string") {
                files = [ files ];
            }
            options.parse = options.parse || {};
            options.parse.toplevel = null;
            for (var name in files) if (HOP(files, name)) {
                options.parse.filename = name;
                options.parse.toplevel = parse(files[name], options.parse);
                if (options.sourceMap && options.sourceMap.content == "inline") {
                    if (Object.keys(files).length > 1)
                        throw new Error("inline source map only works with singular input");
                    options.sourceMap.content = read_source_map(files[name]);
                }
            }
            toplevel = options.parse.toplevel;
        }
        if (quoted_props) {
            reserve_quoted_keys(toplevel, quoted_props);
        }
        if (options.wrap) {
            toplevel = toplevel.wrap_commonjs(options.wrap);
        }
        if (options.enclose) {
            toplevel = toplevel.wrap_enclose(options.enclose);
        }
        if (timings) timings.rename = Date.now();
        // disable rename on harmony due to expand_names bug in for-of loops
        // https://github.com/mishoo/UglifyJS2/issues/2794
        if (0 && options.rename) {
            toplevel.figure_out_scope(options.mangle);
            toplevel.expand_names(options.mangle);
        }
        if (timings) timings.compress = Date.now();
        if (options.compress) toplevel = new Compressor(options.compress).compress(toplevel);
        if (timings) timings.scope = Date.now();
        if (options.mangle) toplevel.figure_out_scope(options.mangle);
        if (timings) timings.mangle = Date.now();
        if (options.mangle) {
            base54.reset();
            toplevel.compute_char_frequency(options.mangle);
            toplevel.mangle_names(options.mangle);
        }
        if (timings) timings.properties = Date.now();
        if (options.mangle && options.mangle.properties) {
            toplevel = mangle_properties(toplevel, options.mangle.properties);
        }
        if (timings) timings.output = Date.now();
        var result = {};
        if (options.output.ast) {
            result.ast = toplevel;
        }
        if (!HOP(options.output, "code") || options.output.code) {
            if (options.sourceMap) {
                if (typeof options.sourceMap.content == "string") {
                    options.sourceMap.content = JSON.parse(options.sourceMap.content);
                }
                options.output.source_map = SourceMap({
                    file: options.sourceMap.filename,
                    orig: options.sourceMap.content,
                    root: options.sourceMap.root
                });
                if (options.sourceMap.includeSources) {
                    if (files instanceof AST_Toplevel) {
                        throw new Error("original source content unavailable");
                    } else for (var name in files) if (HOP(files, name)) {
                        options.output.source_map.get().setSourceContent(name, files[name]);
                    }
                }
            }
            delete options.output.ast;
            delete options.output.code;
            var stream = OutputStream(options.output);
            toplevel.print(stream);
            result.code = stream.get();
            if (options.sourceMap) {
                result.map = options.output.source_map.toString();
                if (options.sourceMap.url == "inline") {
                    result.code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," + to_base64(result.map);
                } else if (options.sourceMap.url) {
                    result.code += "\n//# sourceMappingURL=" + options.sourceMap.url;
                }
            }
        }
        if (options.nameCache && options.mangle) {
            if (options.mangle.cache) options.nameCache.vars = to_json(options.mangle.cache);
            if (options.mangle.properties && options.mangle.properties.cache) {
                options.nameCache.props = to_json(options.mangle.properties.cache);
            }
        }
        if (timings) {
            timings.end = Date.now();
            result.timings = {
                parse: 1e-3 * (timings.rename - timings.parse),
                rename: 1e-3 * (timings.compress - timings.rename),
                compress: 1e-3 * (timings.scope - timings.compress),
                scope: 1e-3 * (timings.mangle - timings.scope),
                mangle: 1e-3 * (timings.properties - timings.mangle),
                properties: 1e-3 * (timings.output - timings.properties),
                output: 1e-3 * (timings.end - timings.output),
                total: 1e-3 * (timings.end - timings.start)
            };
        }
        if (warnings.length) {
            result.warnings = warnings;
        }
        return result;
    } catch (ex) {
        return { error: ex };
    } finally {
        AST_Node.warn_function = warn_function;
    }
}

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = (!process.env.ROLLUP_WATCH);

/*
uglify-es is no longer maintained and uglify-js does not support ES6+.
terser is a fork of uglify-es that retains API and CLI compatibility with uglify-es and uglify-js@3
will later get replaced by babel/minify as soon as we have hardned the apis
*/
function terser() {
  return {
    name: 'terser',
    renderChunk(code) {
      const result = minify(code, {
        sourceMap: true,
      });  
      if (result.error) {
        const { message, line, col: column } = result.error;
        console.error(codeFrameColumns(code, { start: { line, column } }, { message }));
        throw result.error;
      } else {
        return result;
      }
    }
  };
}

export const outputOptions = {
  output: [
    { // ESModule version, for modern browsers
      dir: 'dist/module',
      format: 'esm',
      exports: 'named',
      sourcemap: true
    }, { // SystemJS version, for older browsers
      dir: 'dist/system',
      format: 'system',
      exports: 'named',
      sourcemap: true
    }
  ]
}

export const inputOptions = {
  experimentalCodeSplitting: true,
  plugins: [
    commonjs(),
    globals(),
    builtins(),
    resolve({
      browser: false, 
    }),
    // optional exclude: ['**/index.html']
    string({ include: '**/*.html'	}),
    string({ include: '**/*.stache'	}),
    string({ include: '**/*.css'	}),
    !production && function(){
      return { // CanJS Related Stuff
        name: '',
        transform(code, id) {
          const isCan=(code)=>{
            if (code.indexOf('Component.extend({') > -1) {
              Debug('rollup.config.mjs')('')
              console.log(id,'=>','CanJS Component');
              return true
            }
            return false;
          };    
          if (isCan(code)) {
            return {
              code,
              map: { mappings: null } //'' for no map
            };
          }
        }
      };
    }(),
    terser()
  ]
}
const rollupConfigGeneral = Object.assign(inputOptions,outputOptions);

/* StealJS like keeps project folder structure */
export const configPromise = async function configPromise() {
  const { join } = await import('path');
  const { readdir, stat } = await import('fs');
  const { promisify } = await import('util');

  async function rreaddir(dir, allFiles = []) {
    const files = (await promisify(readdir)(dir)).map(f => join(dir, f));
    allFiles.push(...files);
    await Promise.all(files.map(async f => (await promisify(stat)(f)).isDirectory() && rreaddir(f, allFiles)));
    return allFiles;
  }
  
  const Files = await rreaddir('src');
    
  let input = {};
  Files.filter(x=>((x.indexOf('.js') > -1) ||  (x.indexOf('.mjs') > -1))).map(x=>input[x.split('src/')[1].split('.js')[0].split('.mjs')[0]] = x);
  debug(input);
  return Object.assign({ input },rollupConfigGeneral)
}();

export const rollupConfig = Object.assign({ input: {'canapp/index': 'src/canapp/index.mjs'} },rollupConfigGeneral);

export default configPromise; //Promise.resolve(rollupConfig).catch(console.log);