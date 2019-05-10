import React from 'react';
import './Filters.css';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.filters;
    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  onFiltersChange(state) {
    this.setState(state);
    this.props.onFiltersChange(state);
  }

  render(){
    return (
      <form id="Filters">
      <label>Filters</label>:{' '}
        <span className="fieldInline">
          <label>by title & text</label>{' '}
          <input type="text" id="textFilter" value={this.state.text} onInput={(e) => this.onFiltersChange({text: e.target.value})} />
        </span>
      </form>
    );
  }
}
