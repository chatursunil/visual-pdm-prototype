import React from 'react';

import InputPartRev from './InputPartRev';

import '../styles/Home.css';

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            partNumber: '',
            revLetter: ''
        };
    }

    setCurrentPartRev(partNumber, revLetter) {
        // This function will be called by the child component (InputPartRevs)
        // to set the state in this parent component
        // console.log('Here!');
        this.setState({
            partNumber,
            revLetter
        });
        // Also propagate this state to the parent component (Body.js)
        this.props.setCurrentPartRevOnParent(partNumber, revLetter);
    }

    render() {
        let {partNumber, revLetter} = this.state;
        return(
            <div className="inputpartrev-container">
                {/*<div><b>Home:</b> {`Part=${this.state.partNumber}, Rev=${this.state.revLetter}`}</div>*/}
                <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--4-col"></div>
                    <div className="mdl-cell mdl-cell--6-col">
                        <InputPartRev setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)}/>
                    </div>
                    <div className="mdl-cell mdl-cell--2-col"></div>
                </div>
            </div>
        );
    }
}

export default Home;