import React from 'react';
import './Sort.css';

export default class Sort extends React.Component {
  render(){
    var sort = this.props.sort;
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
          <select id="sortField" value={sort.field} onChange={(e) => this.props.onSortChange({field: e.target.value})}>
            {fieldOptions}
          </select>{' '}
          <label>in</label>{' '}
          <select id="sortDirection" value={sort.direction} onChange={(e) => this.props.onSortChange({direction: e.target.value})}>
            {directionOptions}
          </select>{' '}
          <label>order</label>
        </span>
      </form>
    );
  }
}
