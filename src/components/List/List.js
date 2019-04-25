import React from 'react';
import './List.css';
import DateUtils from '../../utils/DateUtils';

export default class List extends React.Component {
  onDelete(e, item){
    e.stopPropagation(); 
    this.props.onDeleteItem(item);
  }

  buildNodes(){
    var nodes = this.props.items.map(function(item){
      if (!item.id && this.props.items.length > 1){
        return null;
      }
      var opened = item.opened ? 'opened' : '';
      var aside = (<div className="aside">
        <span className="dateOfCreate">{DateUtils.toStr(item.dateOfCreate)}</span>
        <span className="dateOfUpdate">{DateUtils.toStr(item.dateOfUpdate)}</span>
        <button className="delete" onClick={(e) => this.onDelete(e, item)}>X</button>
      </div>);
      return (
        <li key={item.id} data-id={item.id} className={opened} onClick={() => this.props.onOpenItem(item)}>
          {item.id ? aside : null}
          <div className="title">{item.id ? item.title : 'No items found'}</div>
          <div className="text">{item.text}</div>
        </li>
      );
    }, this);
    return nodes;
  }

  render(){
    return (
      <ul id="List">
        {this.buildNodes()}
      </ul>
    );
  }
}
