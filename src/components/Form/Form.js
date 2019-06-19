import React from 'react';
import TextEditor from '../TextEditor/TextEditor';
import Creatable from 'react-select/creatable';
import './Form.css';

export default class Form extends React.Component {
  componentDidMount(){
    this.titleInput.focus();
  }

  render(){
    var item = this.props.item;
    return (
      <form id="Form" onSubmit={this.props.onSubmit} key={item._id}>
        <input type="hidden" id="id" value={item._id} readOnly />
        <div className="fieldBlock">
          <input type="text" id="title" value={item.title} onChange={e => this.props.onItemChange({title: e.target.value})} autoFocus
            ref={i => this.titleInput = i} />
        </div>
        <div className="fieldBlock">
          <TextEditor value={item.text} onChange={value => this.props.onItemChange({text: value})} />
        </div>
        <div className="fieldBlock">
          <Creatable id="tags" isMulti options={this.props.tags} value={item.tags} onChange={value => this.props.onItemChange({tags: value})}
            onCreateOption={this.props.onCreateTag}></Creatable>
        </div>
        <div className="fieldBlock">
          <button id="submit" disabled={this.props.sending}>{this.props.sending ? 'Sending...' : 'Submit'}</button>
        </div>
      </form>
    );
  }
}
