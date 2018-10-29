import rollup from 'rollup';
import { configPromise } from './rollup.config.mjs';

async function build() {
  const inputOptions = await configPromise;
  const outputOptions = inputOptions.output;
  console.log(inputOptions)
  // create a bundle
  const bundle = await rollup.rollup(inputOptions).catch(console.log);
  //  const bundle = { imports: '', exports: '', modules: '' }
  console.log(bundle.imports); // an array of external dependencies
  console.log(bundle.exports); // an array of names exported by the entry point
  console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  //await bundle.write(outputOptions);
}

build();

