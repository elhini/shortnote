import React from 'react';
import './List.css';
import DateUtils from '../../utils/DateUtils';
import { Link } from "react-router-dom";

export default class List extends React.Component {
  onDelete(e, item){
    e.stopPropagation(); 
    this.props.onDeleteItem(item);
  }

  buildNodes(){
    var nodes = this.props.items.map(item => {
      if (!item.id && this.props.items.length > 1){
        return null;
      }
      var opened = this.props.item && this.props.item.id === item.id ? 'opened' : '';
      var tags = item.tags.map(tag => <span className="tag" data-id="{tag.value}" key={tag.value}>{tag.label}</span>);
      var aside = (<div className="aside">
        <span className="dateOfCreate">{DateUtils.toStr(item.dateOfCreate)}</span>
        <span className="dateOfUpdate">{DateUtils.toStr(item.dateOfUpdate)}</span>
        <button className="delete" onClick={(e) => window.confirm('Delete this item?') && this.onDelete(e, item)}>X</button>
        <div className="tags">{tags}</div>
      </div>);
      return (
        <li key={item.id} data-id={item.id} className={opened}>
          <Link to={'/note/' + item.id}>
            {item.id ? aside : null}
            <div className="title">{item.id ? item.title : 'No items found'}</div>
            <div className="text">{item.text}</div>
          </Link>
        </li>
      );
    });
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
