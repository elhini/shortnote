import React from 'react';
import './Sort.css';

export default class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.sort;
    this.onSortChange = this.onSortChange.bind(this);
  }

  onSortChange(state) {
    this.setState(state);
    this.props.onSortChange(state);
  }

  render(){
    var fields = [
      {id: 'dateOfUpdate', name: 'date of update'}, 
      {id: 'dateOfCreate', name: 'date of create'}
    ];
    var fieldOptions = fields.map(o => <option key={o.id} value={o.id}>{o.name}</option>);
    var directions = [ 
      {id: 'desc', name: 'descending'},
      {id: 'asc', name: 'ascending'}
    ];
    var directionOptions = directions.map(o => <option key={o.id} value={o.id}>{o.name}</option>);
    return (
      <form id="Sort">
        <label>Sort</label>:{' '}
        <span className="fieldInline">
          <label>by</label>{' '}
          <select id="sortField" value={this.state.field} onChange={(e) => this.onSortChange({field: e.target.value})}>
            {fieldOptions}
          </select>{' '}
          <label>in</label>{' '}
          <select id="sortDirection" value={this.state.direction} onChange={(e) => this.onSortChange({direction: e.target.value})}>
            {directionOptions}
          </select>{' '}
          <label>order</label>
        </span>
      </form>
    );
  }
}
