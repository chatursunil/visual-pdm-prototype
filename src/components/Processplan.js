import React, {Component} from 'react';

import * as constants from './GlobalConstants';
import '../styles/ProcessPlan.css';

class Processplan extends Component {
    constructor(props) {
        super(props);
        this.state={
            partNumber: this.props.match.params.part,
            revLetter: this.props.match.params.rev
        }
        this.propagatePartRevToParents();
    }

    propagatePartRevToParents = () => {
        // console.log(`this.state.partNumber=${this.state.partNumber}`);
        this.props.setCurrentPartRevOnParent(this.state.partNumber, this.state.revLetter);
    }

    render() {
        return(
            <div className="plan-container">
                <iframe src={`${constants.BASE_SERVER_URL}/processplan/${this.state.partNumber}/${this.state.revLetter}`} frameBorder="0"></iframe>
            </div>
        );
    }
}

export default Processplan;