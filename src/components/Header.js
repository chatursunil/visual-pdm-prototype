import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => (
    <div>
        Visual PDM
        <nav>
            <Link to="/">Home</Link> | 
            <Link to="/drawing">Drawing</Link> | 
            <Link to="/parameters">Parameters</Link> | 
            <Link to="/bom">BOM</Link> | 
            <Link to="/processplan">Process Plan</Link> | 
            <Link to="/other">Other</Link>
        </nav>
    </div>
);

export default Header;