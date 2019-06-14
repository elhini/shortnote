import React from 'react';
import Creatable from 'react-select/creatable';
import './Form.css';

export default class Form extends React.Component {
  render(){
    var item = this.props.item;
    return (
      <form id="Form" onSubmit={e => this.props.onSubmit(e, this)}>
        <input type="hidden" id="id" value={item._id} readOnly />
        <div className="fieldBlock">
          <input type="text" id="title" value={item.title} onChange={e => this.props.onItemChange({title: e.target.value})} />
        </div>
        <div className="fieldBlock">
          <textarea id="text" value={item.text} onChange={e => this.props.onItemChange({text: e.target.value})}></textarea>
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
