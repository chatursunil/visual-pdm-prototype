import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Body from './Body';

import '../styles/Layout.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partNumber: '',
            revLetter: '',
            titleValue: '',
            routeExtension: ''
        };
    }

    setCurrentPartRev(partNumber, revLetter) {
        // This function will be called by the child component (InputPartRevs)
        // to set the state in this parent component
        // console.log('Here!');
        this.setState({
            partNumber,
            revLetter,
            // titleValue: (partNumber.length > 0 && revLetter.length > 0) ? `${partNumber} (${revLetter})` : '',
            titleValue: this.getTitleValue(partNumber, revLetter),
            // routeExtension: (partNumber.length > 0 && revLetter.length > 0) ? `/${partNumber}/${revLetter}` : ''
            routeExtension: this.getRouteExtension(partNumber, revLetter)
        });
    }

    getTitleValue(part, rev) {
        let retValue = '';
        if (part.length > 0) {
            retValue = part;
        }
        if (part.length > 0 && rev.length > 0) {
            retValue += '(' + rev + ')';
        }
        return retValue;
    }

    getRouteExtension(part, rev) {
        let retValue = '';
        if (part.length > 0) {
            retValue = '/' + part;
        }
        if (part.length > 0 && rev.length > 0) {
            retValue += '/' + rev;
        }
        return retValue;
    }

    getRouteLinkText(baseRoute) {
        // console.log(this.state.routeExtension);
        return baseRoute + this.state.routeExtension;
    }
    
    render() {
        return(
            <div className="mdl-layout mdl-js-layout">
                <header className="mdl-layout__header mdl-layout__header--scroll">
                    <div className="mdl-layout__header-row">
                        {/*<!-- Title -->*/}
                        <NavLink to="/" className="mdl-navigation__link"><span className="mdl-layout-title">Visual PDM</span></NavLink>
                        {/*<!-- Add spacer, to align navigation to the right -->*/}
                        <div className="mdl-layout-spacer"></div>
                        <div>{this.state.titleValue}</div>
                        <div className="mdl-layout-spacer"></div>
                        {/*<!-- Navigation -->*/}
                        <nav className="mdl-navigation">
                            {/*<Link to="/" className="mdl-navigation__link">Home</Link>*/}
                            <NavLink to="/" className="mdl-navigation__link">
                                <label className="mdl-button mdl-js-button mdl-button--icon">
                                <i className="material-icons">search</i>
                                </label>                            
                            </NavLink>
                            <NavLink to={this.getRouteLinkText('/drawing')} className="mdl-navigation__link" activeClassName="active-link">Drawing</NavLink>
                            <NavLink to={this.getRouteLinkText('/parameters')} className="mdl-navigation__link" activeClassName="active-link">Parameters</NavLink>
                            <NavLink to={this.getRouteLinkText('/bom')} className="mdl-navigation__link" activeClassName="active-link">BOM</NavLink>
                            <NavLink to={this.getRouteLinkText('/auxiliary')} className="mdl-navigation__link" activeClassName="active-link">Auxiliary</NavLink>
                            <NavLink to={this.getRouteLinkText('/processplan')} className="mdl-navigation__link" activeClassName="active-link">Process Plan</NavLink>
                            <NavLink to={this.getRouteLinkText('/other')} className="mdl-navigation__link" activeClassName="active-link">Other</NavLink>
                            {/*<a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>
                            <a className="mdl-navigation__link" href="">Link</a>*/}
                        </nav>
                    </div>
                </header>
                <div className="mdl-layout__drawer">
                    <NavLink to="/" className="mdl-navigation__link"><span className="mdl-layout-title">Visual PDM</span></NavLink>
                    <nav className="mdl-navigation">
                        {/*<Link to="/" className="mdl-navigation__link">Home</Link>*/}
                        <NavLink to="/" className="mdl-navigation__link">
                            <label className="mdl-button mdl-js-button mdl-button--icon">
                            <i className="material-icons">search</i>
                            </label>                            
                        </NavLink>
                        <NavLink to={this.getRouteLinkText('/drawing')} className="mdl-navigation__link" activeClassName="active-link">Drawing</NavLink>
                        <NavLink to={this.getRouteLinkText('/parameters')} className="mdl-navigation__link" activeClassName="active-link">Parameters</NavLink>
                        <NavLink to={this.getRouteLinkText('/bom')} className="mdl-navigation__link" activeClassName="active-link">BOM</NavLink>
                        <NavLink to={this.getRouteLinkText('/auxiliary')} className="mdl-navigation__link" activeClassName="active-link">Auxiliary</NavLink>
                        <NavLink to={this.getRouteLinkText('/processplan')} className="mdl-navigation__link" activeClassName="active-link">Process Plan</NavLink>
                        <NavLink to={this.getRouteLinkText('/other')} className="mdl-navigation__link" activeClassName="active-link">Other</NavLink>
                    </nav>
                </div>

                <main className="mdl-layout__content" style={{height: '100%', overflow: 'hidden'}}>
                    <div className="page-content">
                        <Body setCurrentPartRevOnParent={this.setCurrentPartRev.bind(this)} />
                    </div>
                </main>
            </div>
        );
    }      
}

export default Header;