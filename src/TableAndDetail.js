import React from 'react'

class TableAndDetail extends React.Component {
    state = {
        tableData: [],  // Table data returned from the API endpoint
        detailData: {}, // Detail data for one car from the API endpoint
        sortKey: "",    // Current column header used for sort
        sortDir: "",    // Current sort direction, either "asc" (ascending) or "desc" (descending)
        sortChars: {},  // Characters displayed with each column header, either
                        // ascending ("↑"), descending ("↓"), or not set ("↕")
        showPage: "",   // Current page, either "table" or "detail"
    }

    constructor(props) {
        super(props)
        this.state.sortChars = {id:"↑", manufacturer:"↕", model:"↕", price:"↕", mpg:"↕",
                                enginesize:"↕", horsepower:"↕", wheelbase:"↕", passengers:"↕"};
        this.state.sortKey = "id";     // Initial sort column is "id"
        this.state.sortDir = "asc";    // Initial sort direction is "asc" (ascending)
        this.state.showPage = "table"; // Set the initial sort column to "id"
    }

    // Load the table data from the API endpoint once the component is mounted
    componentDidMount() {
        fetch("https://api.danwritesandcodes.com/cars/allcars")
            .then(result => result.json())
            .then(result => {
                this.setState({
                    tableData: result,
                })
            })
    }

    // Return the sort direction for the selected column based on the column
    // name and current sort direction for the column
    setSortDir(prevSortKey,newSortKey,prevSortDir) {
        // Same sort key, previous sort direction is ascending (asc)
        // -> New direction is desc
        if ((prevSortKey.length > 0) && (prevSortKey===newSortKey) && (prevSortDir==="asc")) {
            return "desc";
        }

        // Same sort key, previous sort direction is descending (desc)
        // -> New direction is asc
        if ((prevSortKey.length > 0) && (prevSortKey===newSortKey) && (prevSortDir==="desc")) {
            return "asc";
        }

        // Otherwise, new direction is asc
        return "asc";
    }

    // Fetch the car details for the specified car id
    // and set the page display to "detail"
    showCar(event, carId) {
        fetch("https://api.danwritesandcodes.com/cars/id/"+carId)
            .then(result => result.json())
            .then(result => {
                this.setState({
                    detailData: result[0],
                    showPage: "detail"
                })
            })
    }

    // Show the summary table of all cars Assume no change on the server side
    // data, so don't perform a fetch here
    showAll(event) {
        this.setState({ showPage: "table" });
    }

    // Sort the tableData table by the selected column
    sortColumn(event, newSortKey) {
        const tableData = this.state.tableData;
        const sortChars = this.state.sortChars;

        // Determine the new sort direction based on column name and current
        // sort direction
        const newSortDir = this.setSortDir(this.state.sortKey,newSortKey,this.state.sortDir);

        // Sort the column tableData ascending or descending based on current table
        // state, sort key, and whether the column is integer or string tableData
        if (Number.isInteger(tableData[0][newSortKey]) && newSortDir === "asc") {
            tableData.sort((a,b) => a[newSortKey] - b[newSortKey])
        } else if (Number.isInteger(tableData[0][newSortKey]) && newSortDir === "desc") {
            tableData.sort((a,b) => b[newSortKey] - a[newSortKey])
        } else if (newSortDir === "asc") {
            tableData.sort((a,b) => a[newSortKey].localeCompare(b[newSortKey]))
        } else {
            tableData.sort((a,b) => b[newSortKey].localeCompare(a[newSortKey]))
        }

        // Set the sort direction characters
        for (let k in sortChars) { sortChars[k] = " "; };
        if (newSortDir === "desc") {
            sortChars[newSortKey] = "↓";
        } else {
            sortChars[newSortKey] = "↑";
        }

        // Set the state using the new sorted tableData
        this.setState({tableData :tableData,
                       sortKey   :newSortKey,
                       sortDir   :newSortDir,
                       sortChars :sortChars});
    }

    // Display detailed information for one car
    showDetail() {
        const { detailData } = this.state;

        return <div>
            <h1 class="display-4">1993 {detailData.manufacturer} {detailData.model}</h1>
            <button class="btn btn-primary btn-xs" onClick={e => this.showAll()}>View all cars</button>
            <div className="table-responsive">
            <table className="table">
            <thead></thead>
            <tbody>
            <tr><td>Id</td><td>{detailData.id}</td></tr>
            <tr><td>Manufacturer</td><td>{detailData.manufacturer}</td></tr>
            <tr><td>Model</td><td>{detailData.model}</td></tr>
            <tr><td>Price</td><td>${detailData.price}</td></tr>
            <tr><td>Mpg</td><td>{detailData.mpg}</td></tr>
            <tr><td>Engine Size</td><td>{detailData.enginesize} cc</td></tr>
            <tr><td>Horsepower</td><td>{detailData.horsepower} hp</td></tr>
            <tr><td>Wheelbase</td><td>{detailData.wheelbase} in</td></tr>
            <tr><td>Passengers</td><td>{detailData.passengers}</td></tr>
            </tbody>
            </table></div></div>
    }

    // Show a data table that lists all 93 cars in the database
    showTable() {
        const { tableData, sortChars } = this.state;

        const result = tableData.map((entry, index) => {
            return <tr key={"row"+entry.id}>
                <td key={entry.id}><button onClick={e => this.showCar(e, entry.id)} class="btn btn-primary btn-xs">{entry.id}</button></td>
                <td key={entry.id+entry.manufacturer}>{entry.manufacturer}</td>
                <td key={entry.id+entry.model}>{entry.model}</td>
                <td key={entry.id+entry.price}>{entry.price}</td>
                <td key={entry.id+entry.mpg}>{entry.mpg}</td>
                <td key={entry.id+entry.enginesize}>{entry.enginesize}</td>
                <td key={entry.id+entry.horsepower}>{entry.horsepower}</td>
                <td key={entry.id+entry.wheelbase}>{entry.wheelbase}</td>
                <td key={entry.id+entry.passengers}>{entry.passengers   }</td></tr>
        })

        return <div>
            <h1 class="display-4">1993 Cars</h1>
            <p class="lead">A simple presentation of the <a href="https://www.rdocumentation.org/packages/MASS/versions/7.3-51.5/topics/Cars93">Cars 93 database</a>. Click anywhere in the row for detailed information on a car. Click a column header to sort a column, click again to reverse the sort.</p>
            <div className="table-responsive">
            <table className="table table-striped">
            <thead>
            <tr>
            <th onClick={e => this.sortColumn(e, 'id')}>Id{sortChars.id}</th>
            <th onClick={e => this.sortColumn(e, 'manufacturer')}>Manufacturer{sortChars.manufacturer}</th>
            <th onClick={e => this.sortColumn(e, 'model')}>Model{sortChars.model}</th>
            <th onClick={e => this.sortColumn(e, 'price')}>Price{sortChars.price}</th>
            <th onClick={e => this.sortColumn(e, 'mpg')}>Mpg{sortChars.mpg}</th>
            <th onClick={e => this.sortColumn(e, 'enginesize')}>Engine Size{sortChars.enginesize}</th>
            <th onClick={e => this.sortColumn(e, 'horsepower')}>Horsepower{sortChars.horsepower}</th>
            <th onClick={e => this.sortColumn(e, 'wheelbase')}>Wheelbase{sortChars.wheelbase}</th>
            <th onClick={e => this.sortColumn(e, 'passengers')}>Passengers{sortChars.passengers}</th>
            </tr>
            </thead>
            <tbody>{result}</tbody>
            </table></div></div>
    }


    // Render the full data table for 93 cars or detailed information for one car
    // based on the showPage setting
    render() {
        if (this.state.showPage === "table") {
            return this.showTable();
        } else {
            return this.showDetail();
        }
    }
}

export default TableAndDetail;
