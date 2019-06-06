import React from 'react';
import Select from 'react-select'
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
        <label>Filter</label>:{' '}
        <span className="fieldInline">
          <label>by title & text</label>{' '}
          <input type="text" id="textFilter" value={this.state.text} onInput={e => this.onFiltersChange({text: e.target.value})} />
        </span>
        <span className="fieldInline">
          <label>by tags</label>{' '}
          <Select id="tagsFilter" isMulti options={this.props.tags} onChange={v => this.onFiltersChange({tags: v})}></Select>
        </span>
      </form>
    );
  }
}
