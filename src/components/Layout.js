import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Body from './Body';

import '../styles/Layout.css';

class Header extends Component {
    showFeatureUnderConstruction() {
        alert('This feature is under construction');
    }
    render() {
        return(
            <div className="mdl-layout mdl-js-layout">
                <header className="mdl-layout__header mdl-layout__header--scroll">
                    <div className="mdl-layout__header-row">
                        {/*<!-- Title -->*/}
                        <Link to="/" className="mdl-navigation__link"><span className="mdl-layout-title">Visual PDM</span></Link>
                        {/*<!-- Add spacer, to align navigation to the right -->*/}
                        <div className="mdl-layout-spacer"></div>
                        {/*<!-- Navigation -->*/}
                        <nav className="mdl-navigation">
                            {/*<Link to="/" className="mdl-navigation__link">Home</Link>*/}
                            <Link to="/" className="mdl-navigation__link">
                                <label className="mdl-button mdl-js-button mdl-button--icon">
                                <i className="material-icons">search</i>
                                </label>                            
                            </Link>
                            <Link to="/drawing" className="mdl-navigation__link">Drawing</Link>
                            <Link to="/parameters" className="mdl-navigation__link">Parameters</Link>
                            <Link to="/bom" className="mdl-navigation__link">BOM</Link>
                            <Link to="/processplan" className="mdl-navigation__link">Process Plan</Link>
                            <Link to="/other" className="mdl-navigation__link">Other</Link>
                            {/*<a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>*/}
                        </nav>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <Link to="/" className="mdl-navigation__link"><span className="mdl-layout-title">Visual PDM</span></Link>
                    <nav className="mdl-navigation">
                        {/*<Link to="/" className="mdl-navigation__link">Home</Link>*/}
                        <Link to="/" className="mdl-navigation__link">
                            <label className="mdl-button mdl-js-button mdl-button--icon">
                            <i className="material-icons">search</i>
                            </label>                            
                        </Link>
                        <Link to="/drawing" className="mdl-navigation__link">Drawing</Link>
                        <Link to="/parameters" className="mdl-navigation__link">Parameters</Link>
                        <Link to="/bom" className="mdl-navigation__link">BOM</Link>
                        <Link to="/processplan" className="mdl-navigation__link">Process Plan</Link>
                        <Link to="/other" className="mdl-navigation__link">Other</Link>
                    </nav>
                </div>

                <main className="mdl-layout__content">
                    <div className="page-content">
                        <Body />
                    </div>
                </main>
            </div>
        );
    }      
}

export default Header;