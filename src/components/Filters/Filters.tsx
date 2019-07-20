import React from 'react';
import Select from 'react-select'
import { FiltersValue, Tag, FiltersValueDiff } from '../../types/index';
import './Filters.css';

interface FiltersProps {
    filters: FiltersValue;
    tags: Tag[];
    onFiltersChange: (filters: FiltersValueDiff) => void;
}

export default class Filters extends React.Component<FiltersProps, {}> {
  render(){
    var filters = this.props.filters;
    return (
      <form id="Filters">
        <label>Filter</label>:{' '}
        <span className="fieldInline">
          <label>by title & text</label>{' '}
          <input type="text" id="textFilter" value={filters.text} onChange={e => this.props.onFiltersChange({text: e.target.value})} key="textFilter" />
        </span>
        <span className="fieldInline">
          <label>by tags</label>{' '}
          <Select id="tagsFilter" value={filters.tags} isMulti options={this.props.tags} onChange={(v: any) => this.props.onFiltersChange({tags: v})}></Select>
        </span>
      </form>
    );
  }
}
