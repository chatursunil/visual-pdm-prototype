import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './Home';
import Drawing from './Drawing';
import Parameters from './Parameters';
import Bom from './Bom';
import Processplan from './Processplan';
import Other from './Other';

const Body = () => (
    <div>
        <h2>Body Component</h2>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/drawing' component={Drawing} />
            <Route path='/parameters' component={Parameters} />
            <Route path='/bom' component={Bom} />
            <Route path='/processplan' component={Processplan} />
            <Route path='/other' component={Other} />
        </Switch>
    </div>
);

export default Body;