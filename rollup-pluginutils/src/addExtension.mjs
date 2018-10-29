import { extname } from 'path';

export default function addExtension ( filename, ext = '.mjs' ) {
	if ( !extname( filename ) ) filename += ext;
	return filename;
}
