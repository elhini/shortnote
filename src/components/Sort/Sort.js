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
    var options = [
      {id: 'dateOfUpdate', name: 'date of update'}, 
      {id: 'dateOfCreate', name: 'date of create'}
    ];
    var optionNodes = options.map(o => <option key={o.id} value={o.id}>{o.name}</option>);
    return (
      <form id="Sort">
        <label>Sort</label>:{' '}
        <span className="fieldInline">
          <label>by field</label>{' '}
          <select id="sortField" value={this.state.field} onChange={(e) => this.onSortChange({field: e.target.value})}>
            {optionNodes}
          </select>
        </span>
      </form>
    );
  }
}
