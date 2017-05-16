import React, {Component} from 'react';

import * as constants from './GlobalConstants';
import '../styles/Drawing.css';

const fetch_url_defaultrev = constants.BASE_SERVER_URL + '/defaultrevforpart';

class Drawing extends Component{
    constructor(props) {
        super(props);
        this.state={
            partNumber: this.props.match.params.part,
            revLetter: this.props.match.params.rev || ''
        }
    }

    propagatePartRevToParents = () => {
        // console.log(`this.state.partNumber=${this.state.partNumber}`);
        this.props.setCurrentPartRevOnParent(this.state.partNumber, this.state.revLetter);
    }

    componentWillMount() {
        if (this.state.revLetter.length === 0) {
            this.getDefaultRev(this.state.partNumber);
        }
        this.propagatePartRevToParents();
    }

    getDefaultRev(part) {
        fetch(`${fetch_url_defaultrev}/${part}`)
        .then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    this.setState({revLetter: data.rev}, () => {
                        this.propagatePartRevToParents();
                    });
                })
            }
        }).catch(err => {
            return;
        });
    }

    render() {
        return(
            <div className="drawing-container">
                <iframe src={`${constants.BASE_SERVER_URL}/drawing/${this.state.partNumber}/${this.state.revLetter}`} frameBorder="0"></iframe>
            </div>
        );
    }
}

export default Drawing;