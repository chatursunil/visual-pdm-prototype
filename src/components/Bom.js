import React from 'react';
import {Link} from 'react-router-dom';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';

import '../styles/Bom.css';
import fileImage from '../images/file.png';
import folderImage from '../images/folder.png';
import diskImage from '../images/disk.png';
import * as constants from './GlobalConstants';

const columnDef = [
    {headerName: '<b>COMPONENT</b>', field: 'COMPONENT', width: 420,
        cellRenderer: 'group',
        cellRendererParams: {
            innerRenderer: innerCellRenderer
        }
    },
    {headerName: '<b>LEVEL</b>', field: 'LEVEL', width: 120}, 
    {headerName: '<b>REV</b>', field: 'REV', width: 70},
    {headerName: '<b>PT_USE</b>', field: 'PT_USE'},
    {headerName: '<b>QTY</b>', field: 'QTY'},
    {headerName: '<b>UM</b>', field: 'UM', width: 60},
    {headerName: '<b>SEQN</b>', field: 'SEQN'},
    {headerName: '<b>COM_TYP</b>', field: 'COM_TYP'},
    {headerName: '<b>MB</b>', field: 'MB', width: 60},
    {headerName: '<b>IN_EFFECT</b>', field: 'IN_EFFECT'},
    {headerName: '<b>OUT_EFFECT</b>', field: 'OUT_EFFECT'}
];

function innerCellRenderer(params) {
    // console.log(params);
    let image;
    if (params.node.group) {
        // image = params.node.level === 0 ? diskImage : folderImage;
        image = folderImage;
    } else {
        image = fileImage;
    }
    let cellValue = '<img src="' + image + '" style="padding-left: 4px;" /> '
    cellValue  += `<a href="/drawing/${params.data.COMPONENT}">${params.data.COMPONENT}</a>`;
    return cellValue;
}

class Bom extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            partNumber: this.props.match.params.part,
            revLetter: this.props.match.params.rev,
            rowData: []
        }
    }

    propagatePartRevToParents = () => {
        // console.log(`this.state.partNumber=${this.state.partNumber}`);
        this.props.setCurrentPartRevOnParent(this.state.partNumber, this.state.revLetter);
    }

    getRowData() {
        const {partNumber, revLetter, rowData} = this.state;
        if (partNumber.length === 0 || revLetter.length === 0) return;
        // Now fetch parameters data from the server
        fetch(`${constants.BASE_SERVER_URL}/bom/${partNumber}/${revLetter}`)
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

    getNodeChildDetails(rowItem) {
        if (rowItem.folder) {
            // console.log(rowItem);
            return {
                group: true,
                children: rowItem.children,
                expanded: rowItem.open
            };
        } else {
            return null;
        }        
    }

    getRowStyle(params) {
        if (params.node.rowIndex === params.api.rowModel.rowsToDisplay.length - 1) {
            return {borderBottom: 'solid 1px #808080'};
        }   
    }

    render() {
        return(
            <div className="ag-fresh bom-container">
                <AgGridReact
                    columnDefs={columnDef}
                    rowData={this.state.rowData}
                    enableColResize="true"
                    animateRows="true"
                    onGridReady={this.onGridReady.bind(this)}
                    getNodeChildDetails={this.getNodeChildDetails.bind(this)}
                    onGridSizeChanged={this.onGridSizeChanged.bind(this)}
                    getRowStyle={this.getRowStyle.bind(this)}
                />
            </div>
        );
    }
}

export default Bom;