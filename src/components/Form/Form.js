import React from 'react';
import Select from 'react-select';
import './Form.css';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.item;
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
  }
  
  onTitleChange(e) {
    this.setState({title: e.target.value});
  }

  onTextChange(e) {
    this.setState({text: e.target.value});
  }

  onTagsChange(selectedTags) {
    this.setState({tags: selectedTags});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.item.id !== prevState.id) {
      return nextProps.item; // <- this is setState equivalent
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.title !== this.state.title || !this.state.title){
      this.titleInput.focus();
    }
  }

  render(){
    return (
      <form id="Form" onSubmit={e => this.props.onSubmit(e, this)}>
        <input type="hidden" id="id" value={this.state.id} readOnly />
        <div className="fieldBlock">
          <input type="text" id="title" value={this.state.title} onChange={this.onTitleChange} autoFocus={true} ref={c => this.titleInput = c} />
        </div>
        <div className="fieldBlock">
          <textarea id="text" value={this.state.text} onChange={this.onTextChange}></textarea>
        </div>
        <div className="fieldBlock">
          <Select id="tags" isMulti options={this.props.tags} value={this.state.tags} onChange={this.onTagsChange} ref={c => this.tagsSelect = c}></Select>
        </div>
        <div className="fieldBlock">
          <button id="submit">Submit</button>
        </div>
      </form>
    );
  }
}
