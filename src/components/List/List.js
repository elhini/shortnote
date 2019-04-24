import React from 'react';
import './List.css';

export default class List extends React.Component {
  buildNodes(){
    return this.props.items.map(function(item){
      return (
        <li key={item.id} data-id={item.id} onClick={() => this.props.onEditItem(item)}>
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
