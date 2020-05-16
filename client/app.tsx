import * as React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader/root';

import Index from './src';


const HotApp = hot( Index );

document.addEventListener( 'DOMContentLoaded', () => {
	render( <HotApp/>, document.getElementById( 'root' ) );
} );
