import React from 'react';
import Creatable from 'react-select/creatable';
import './Form.css';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.item;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.item) !== JSON.stringify(prevState)) {
      return nextProps.item; // <- this is setState equivalent
    }
    return null;
  }

  onItemChange(field, value){
    var item = this.state;
    item[field] = value;
    this.props.onItemChange(item);
  }

  render(){
    return (
      <form id="Form" onSubmit={e => this.props.onSubmit(e, this)}>
        <input type="hidden" id="id" value={this.state._id} readOnly />
        <div className="fieldBlock">
          <input type="text" id="title" value={this.state.title} onChange={e => this.onItemChange('title', e.target.value)} key="title" />
        </div>
        <div className="fieldBlock">
          <textarea id="text" value={this.state.text} onChange={e => this.onItemChange('text', e.target.value)}></textarea>
        </div>
        <div className="fieldBlock">
          <Creatable id="tags" isMulti options={this.props.tags} value={this.state.tags} onChange={v => this.onItemChange('tags', v)}
            onCreateOption={this.props.onCreateTag}></Creatable>
        </div>
        <div className="fieldBlock">
          <button id="submit" disabled={this.props.sending}>{this.props.sending ? 'Sending...' : 'Submit'}</button>
        </div>
      </form>
    );
  }
}
