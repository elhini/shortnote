import React from 'react';
import './List.css';

export default class List extends React.Component {
  onDelete(e, item){
    e.stopPropagation(); 
    this.props.onDeleteItem(item);
  }

  buildNodes(){
    return this.props.items.map(function(item){
      var opened = item.opened ? 'opened' : '';
      var deleteBtn = item.id > 0 ? <button className="delete" onClick={(e) => this.onDelete(e, item)}>X</button> : null;
      return (
        <li key={item.id} data-id={item.id} className={opened} onClick={() => this.props.onOpenItem(item)}>
          {deleteBtn}
          <div className="title">{item.title}</div>
          <div className="text">{item.text}</div>
        </li>
      );
    }, this);
  }

  render(){
    return (
      <ul id="List">
        {this.buildNodes()}
      </ul>
    );
  }
}
