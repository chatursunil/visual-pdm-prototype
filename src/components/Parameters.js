import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';

import '../styles/Parameters.css';
import * as constants from './GlobalConstants';

const fetch_url_defaultrev = constants.BASE_SERVER_URL + '/defaultrevforpart';

// Note that I am decalring the ColumnDef outside the class.
// I had to do this to make the PART/REV rows uneditable. I could not pass the params argument inside the react class
// Also I am no longer saving the column definition in the state.
const columnDef = [
        {headerName: '<b>Parameter</b>', field: 'ParameterName', width:50},
        {headerName: '<b>Value</b>', field: 'ParameterValue', editable: notKeyParamater},
        {headerName: 'ParameterType', field: 'ParameterType', hide: true},
        {headerName: 'RelateLabel', field: 'RelateLabel', hide: true},
        {headerName: 'SequenceNumber', field: 'SequenceNumber', hide: true}
    ]

function notKeyParamater(params) {
    // console.log(params);
    return params.node.childIndex === 0 || params.node.childIndex === 1 ? false : true;
}

class Parameters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            partNumber: this.props.match.params.part,
            revLetter: this.props.match.params.rev || '',
            rowData: []
        }
    }

    propagatePartRevToParents = () => {
        this.props.setCurrentPartRevOnParent(this.state.partNumber, this.state.revLetter);
    }

    getRowData() {
        const {partNumber, revLetter, rowData} = this.state;
        if (partNumber.length === 0 || revLetter.length === 0) return;
        // Now fetch parameters data from the server
        fetch(`${constants.BASE_SERVER_URL}/parameters/${partNumber}/${revLetter}`)
        .then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    // console.log(data);
                    this.setState({
                        rowData: data
                    })
                })
            } else {
                this.setState({
                    rowData: []
                })
            }
        }).catch((err) => {
            this.setState({
                rowData: []
            })
        });
    }

    componentWillMount() {
        this.propagatePartRevToParents();        
    }

    componentDidMount() {
        this.getRowData();
    }

    componentDidUpdate(preProps, newProps) {
        this.api.sizeColumnsToFit();
    }

    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        // The following doesn't work, so I will call the size to fit in ComponentDidMount event
        // this.api.sizeColumnsToFit();
    }

    onGridSizeChanged() {
        if (this.api !== undefined) this.api.sizeColumnsToFit();       
    }

    onCellValueChanged(event) {
        console.log(event);
        // Note the event object contains all the information we need to construct the sql to save the data in the database
        // event.oldValue and event.newValue contains what changed
        // event.data contains all of the row data including the hidden columns (RelateLabel, Type)
        // Part and rev information is available in the state.
    }

    render() {
        return (
            <div className="ag-fresh parameters-container">
                <div className="mdl-grid" style={{height: '100%', paddingTop: 0}}>
                    <div className="mdl-cell mdl-cell--2-col"></div>
                    <div className="mdl-cell mdl-cell--8-col" style={{margin: 0}}>
                        <AgGridReact
                            columnDefs={columnDef}
                            rowData={this.state.rowData}
                            singleClickEdit="true"
                            enableColResize="true"
                            onGridReady={this.onGridReady.bind(this)}
                            onCellValueChanged={this.onCellValueChanged.bind(this)}
                            onGridSizeChanged={this.onGridSizeChanged.bind(this)}
                        />
                    </div>
                    <div className="mdl-cell mdl-cell--2-col"></div>                    
                </div>
            </div>            
        )
    }
}

export default Parameters;