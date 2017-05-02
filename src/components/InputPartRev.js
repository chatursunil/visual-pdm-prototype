import React from 'react';
import Autosuggest from 'react-autosuggest';
import renderHTML from 'react-render-html';

import '../styles/InputPartRev.css';
import downArrow from '../images/down_arrow_48.png';

const server_url = 'http://n-cdt-sc:9000';
const fetch_url_items = server_url + '/suggestitems';
const fetch_url_revs = server_url + '/revsforpart';

/* ---------- */
/*    Data    */
/* ---------- */

// const languages = [
//   {
//     name: 'C',
//     year: 1972
//   },
//   {
//     name: 'C#',
//     year: 2000
//   },
//   {
//     name: 'C++',
//     year: 1983
//   },
//   {
//     name: 'Clojure',
//     year: 2007
//   },
//   {
//     name: 'Elm',
//     year: 2012
//   },
//   {
//     name: 'Go',
//     year: 2009
//   },
//   {
//     name: 'Haskell',
//     year: 1990
//   },
//   {
//     name: 'Java',
//     year: 1995
//   },
//   {
//     name: 'Javascript',
//     year: 1995
//   },
//   {
//     name: 'Perl',
//     year: 1987
//   },
//   {
//     name: 'PHP',
//     year: 1995
//   },
//   {
//     name: 'Python',
//     year: 1991
//   },
//   {
//     name: 'Ruby',
//     year: 1995
//   },
//   {
//     name: 'Scala',
//     year: 2003
//   }
// ];

// function getMatchingValues(value) {
//   const escapedValue = escapeRegexCharacters(value.trim());
  
//   if (escapedValue === '') {
//     return [];
//   }
  
//   const regex = new RegExp('^' + escapedValue, 'i');

//   return languages.filter(language => regex.test(language.name));
// }

/* ----------- */
/*    Utils    */
/* ----------- */

// // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
// function escapeRegexCharacters(str) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

/* --------------- */
/*    Component    */
/* --------------- */

function getSuggestionValue(suggestion) {
  // console.log(suggestion.ITEM);
  return suggestion.ITEM;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.ITEM}</span>
  );
}

class InputPartRev extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partNumber: '',
      revLetter: '',
      value: '',
      suggestions: [],
      revDisabled: true,
      revOptions: [],
      currentRev: ''
    };

    // this.lastRequestId = null;
  }
  
  loadSuggestions(value) {
    // We will only fetch items from server if the value length is greater than 3
    if (value.trim().length <= 3) {
      this.setState({suggestions: []});
      return;
    }
    //  Now let's fetch the suggestions from the server
    fetch(`${fetch_url_items}/${value}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            // console.log(data);
            this.setState({
              suggestions: data
            });
          })
        } else {
          this.setState({
            suggestions: []
          });
        }
      }).catch((err) => {
        this.setState({
          suggestions: []
        });
      })
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
    if (newValue.trim().length === 0) {
      this.setState({revDisabled: true});
    }
  };
    
  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    // Write code here using suggestionValue
    // Note that when enter key is pressed, it is automatically handled by the onKeyDown event
    // So we just need to handle the 'click' method
    if (method !== 'enter'){
      this.handlePartNumberConfirmed(suggestionValue);
    }     
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      e.stopPropagation();
      this.handlePartNumberConfirmed(this.state.value);
      this.refs.revInput.focus();
    }
  }

  handlePartNumberConfirmed = (partNumber) => {
    // This code will be invoked when user presses enter after
    // either entering the partnumber or after selecting from the suggestions
    this.setState({partNumber}, () => {
      this.setState({revDisabled: partNumber.length > 0 ? false : true});
      this.propagatePartRevToParents();
    });
    this.loadRevs(partNumber);
  }

  propagatePartRevToParents = () => {
    // console.log(`this.state.partNumber=${this.state.partNumber}`);
    this.props.setCurrentPartRevOnParent(this.state.partNumber, this.state.revLetter);
  }

  // ************* Rev related functions below
  onRevChange = (e) => {
    this.setState({revLetter: e.target.value}, () => {
      this.propagatePartRevToParents();
    });
  }

  makeSelectDisabled = (arg) => {
    return arg ? 'disabled' : '';
  }

  loadRevs = (part) => {
    fetch(`${fetch_url_revs}/${part}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            this.setState({revOptions: data}, () => {
              if (data.length > 0) {
                this.setState({
                  currentRev: data[0].CURRENTREV,
                  revLetter: data[0].CURRENTREV
                }, () => {
                  this.propagatePartRevToParents();
                });
              }
            });
          });
        } else {
          this.setState({revOptions: []});
        }
      }).catch((err) => {
        this.setState({revOptions: []});
      });
  }

  renderRevOptions = () => {
    const revOptions = this.state.revOptions;
    let retText = '';
    // let selectedValue = '';
    if (revOptions.length > 0) {
      // selectedValue = revOptions[0].CURRENTREV;
      revOptions.forEach((option) => {
        retText += `<option value="${option.REV}">${option.REV}</option>`;
      });
    }
    // Since this method is called during render, we cannot setState at this point
    // This is because the setState causes another render which leads to an infinite call to render
    // As a result you will receive the following error:
    // reactjs cannot update during an existing state transition
    // So we need to set this state in a different place.
    // this.setState({currentRev: selectedValue});
    return retText;
  }

  render() {
    const { value, suggestions} = this.state;
    const inputProps = {
      placeholder: "Enter Part Number",
      autoFocus: true,
      value,
      onChange: this.onChange,
      onKeyDown: this.handleKeyDown
    };
    
    return (
      <div>
        <div style={{float: 'left'}}>
          {/*<div className="status">
            <strong>Status:</strong> {status}
          </div>*/}
          <Autosuggest 
            ref="partInput"
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps} />
          </div>

          {/*<div style={{float: 'left', width:'20px'}}>&nbsp;</div>*/}

          <div style={{float: 'left'}}>
            <select disabled={this.state.revDisabled}
              value={this.state.revLetter.length > 0 ? this.state.revLetter : this.state.currentRev}              
              ref="revInput"
              style={{background: `url(${downArrow}) 96% / 15% no-repeat #fff`}}             
              onChange={this.onRevChange}>
                <option value="" disabled>Select Rev</option>
                {renderHTML(this.renderRevOptions())}
            </select>
          </div>
      </div>
    );
  }
}

export default InputPartRev;