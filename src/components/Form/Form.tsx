import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import TextEditor from '../TextEditor/TextEditor';
import Creatable from 'react-select/creatable';
import { Item, Tag, ItemDiff } from '../../types/index';
import './Form.css';

interface FormProps {
    item: Item;
    tags: Tag[];
    sending: boolean;
    changed: boolean;
    onItemChange: (item: ItemDiff) => void;
    onCreateTag: (tagName: string) => void;
    onPublicLinkCopy: () => void;
}

export default class Form extends React.Component<FormProps, {}> {
  titleInput!: HTMLInputElement | null;
  publicLinkInput!: HTMLInputElement | null;

  componentDidMount(){
    this.titleInput && this.titleInput.focus();
  }

  copyPublicLink() {
    if (this.publicLinkInput){
      this.publicLinkInput.focus();
      this.publicLinkInput.select();
    }
  
    try {
      document.execCommand('copy');
      this.props.onPublicLinkCopy();
    } catch (err) {
      console.error('unable to copy', err);
    }
  }

  render(){
    var item = this.props.item;
    /* 
    var accessLevelOptions = this.props.accessLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>);
    var accessLevelSelect = <select id="accessLevel" value={item.accessLevel} onChange={e => this.props.onItemChange({accessLevel: +e.target.value})}>
      {accessLevelOptions}
    </select> 
    */
    var publicLink = window.location.origin + '/notes/public/' + item._id;
    var publicLinkCont = <>
      <input type="text" id="publicLink" value={publicLink} readOnly ref={i => this.publicLinkInput = i} />
      <IconButton id="copyPublicLink" title="Copy public link" onClick={e => this.copyPublicLink()}><FileCopyIcon /></IconButton>
    </>;
    return (
      <form id="Form" /* onSubmit={this.props.onSubmit} */ key={item._id}>
        <input type="hidden" id="id" value={item._id} readOnly />
        <div className="fieldBlock" id="titleAndPublicAccess">
          <input type="text" id="title" value={item.title} onChange={e => this.props.onItemChange({title: e.target.value})} autoFocus
            ref={i => this.titleInput = i} />
          <label htmlFor="publicAccess">
            <input type="checkbox" id="publicAccess" checked={item.publicAccess} onChange={e => this.props.onItemChange({publicAccess: e.target.checked})} />
            Public access 
            {/* item.publicAccess ? 'for ' : '' */}
          </label>{' '}
          {item.publicAccess && publicLinkCont}
          {/* item.publicAccess ? accessLevelSelect : null */}
        </div>
        <div className="fieldBlock">
          <TextEditor value={item.text} onChange={(value: string) => this.props.onItemChange({text: value})} />
        </div>
        <div className="fieldBlock">
          <Creatable id="tags" isMulti options={this.props.tags} value={item.tags} onChange={(value: any) => this.props.onItemChange({tags: value})}
            onCreateOption={this.props.onCreateTag}></Creatable>
        </div>
        { /* <div className="fieldBlock">
          <button id="submit" disabled={this.props.sending}>{this.props.sending ? 'Sending...' : 'Submit'}</button>
        </div> */ }
        <span id="formState">{this.props.sending ? 'Saving...' : (this.props.changed ? 'Changed' : (item._id ? 'Saved' : ''))}</span>
      </form>
    );
  }
}
