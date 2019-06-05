import React from 'react';
import Creatable from 'react-select/creatable';
import './Form.css';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.item;
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }
  
  onTitleChange(e) {
    this.setState({title: e.target.value});
  }

  onTextChange(e) {
    this.setState({text: e.target.value});
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.item.id !== prevState.id || nextProps.item.tags !== prevState.tags) {
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
          <Creatable id="tags" isMulti options={this.props.tags} value={this.state.tags} onChange={this.props.onTagsChange} ref={c => this.tagsSelect = c}
                     onCreateOption={this.props.onCreateTag}></Creatable>
        </div>
        <div className="fieldBlock">
          <button id="submit">Submit</button>
        </div>
      </form>
    );
  }
}
