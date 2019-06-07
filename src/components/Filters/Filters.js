import React from 'react';
import Select from 'react-select'
import './Filters.css';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.filters;
  }

  render(){
    return (
      <form id="Filters">
        <label>Filter</label>:{' '}
        <span className="fieldInline">
          <label>by title & text</label>{' '}
          <input type="text" id="textFilter" value={this.state.text} onChange={e => this.props.onFiltersChange({text: e.target.value})} key="textFilter" />
        </span>
        <span className="fieldInline">
          <label>by tags</label>{' '}
          <Select id="tagsFilter" value={this.state.tags} isMulti options={this.props.tags} onChange={v => this.props.onFiltersChange({tags: v})}></Select>
        </span>
      </form>
    );
  }
}
