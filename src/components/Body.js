import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Home';
import Drawing from './Drawing';
import Parameters from './Parameters';
import Bom from './Bom';
import Auxiliary from './Auxiliary';
import Processplan from './Processplan';
import Other from './Other';

import '../styles/Body.css';

class Body extends React.Component{
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
            <div className="body-container">
                {/*<h2>Body Component</h2>*/}
                {/*<div><b>Body:</b> {`Part=${this.state.partNumber}, Rev=${this.state.revLetter}`}</div>*/}
                <Switch>
                    {/*<Route exact path='/' component={Home} />*/}
                    <Route exact path='/' render={(props) => <Home setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/drawing/:part/:rev' render={(props) => <Drawing setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/parameters/:part/:rev' render={(props) => <Parameters setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/bom/:part/:rev' render={(props) => <Bom setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/auxiliary/:part/:rev' render={(props) => <Auxiliary setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/processplan/:part/:rev' render={(props) => <Processplan setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} {...props} />} />
                    <Route path='/other/:part/:rev' component={Other} />
                </Switch>
            </div>
        );
    }
}


export default Body;