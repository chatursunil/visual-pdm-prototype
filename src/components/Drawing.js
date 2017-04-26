import React, {Component} from 'react';

import '../styles/Drawing.css';

class Drawing extends Component{
    render() {
        return(
            <div className="drawing-container">
                <iframe src="http://n-cdt-sc:9000/" frameBorder="0"></iframe>
            </div>
        );
    }
}

export default Drawing;