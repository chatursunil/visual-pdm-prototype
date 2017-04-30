import React from 'react';
import Autosuggest from 'react-autosuggest';

import '../styles/InputPartRev.css';
const fetch_url = 'http://n-cdt-sc:9000/suggestitems';

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
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
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
    fetch(`${fetch_url}/${value}`)
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
      value: newValue
    });
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
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.handlePartNumberConfirmed(this.state.value);
    }
  }

  handlePartNumberConfirmed = (partNumber) => {
    // This code will be invoked when user presses enter after
    // either entering the partnumber or after selecting from the suggestions
    console.log(`Part Number=${partNumber}`);
  }

  render() {
    const { value, suggestions} = this.state;
    const inputProps = {
      placeholder: "Enter Part Number",
      value,
      onChange: this.onChange,
      onKeyDown: this.handleKeyDown
    };
    
    return (
      <div>
        {/*<div className="status">
          <strong>Status:</strong> {status}
        </div>*/}
        <Autosuggest 
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
}

export default InputPartRev;