import React, {Component} from 'react';

import '../styles/Drawing.css';

class Drawing extends Component{
    constructor(props) {
        super(props)
        this.state={
            partNumber: this.props.match.params.part,
            revLetter: this.props.match.params.rev
        }
    }
    render() {
        return(
            <div className="drawing-container">
                <iframe src={`http://n-cdt-sc:9000/drawing/${this.state.partNumber}/${this.state.revLetter}`} frameBorder="0"></iframe>
            </div>
        );
    }
}

export default Drawing;