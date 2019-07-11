import React from 'react';
import './List.css';
import DateUtils from '../../utils/DateUtils';
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(e, item){
    e.stopPropagation(); 
    e.preventDefault();
    this.props.onDeleteItem(item);
  }

  strip(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  buildNodes(){
    var nodes = this.props.items.map(item => {
      if (!item._id){
        return null;
      }
      var opened = this.props.item && this.props.item._id === item._id ? 'opened' : '';
      var tags = (item.tags || []).map(tag => <span className="tag" data-id={tag.value} key={tag.value}>{tag.label}</span>);
      var aside = (<div className="aside">
        <div className="aside-inner">
          <span className="dateOfCreate" title="Date of create">{DateUtils.toStr(item.dateOfCreate)}</span>
          <span className="dateOfUpdate" title="Date of update">{DateUtils.toStr(item.dateOfUpdate)}</span>
          <div className="tags">{tags}</div>
        </div>
        <IconButton className="delete" onClick={(e) => window.confirm('Delete this item?') && this.onDelete(e, item)}><DeleteIcon /></IconButton>
      </div>);
      return (
        <li key={item._id} className={opened}>
          <Link to={'/note/' + item._id}>
            {aside}
            <div className="title">{item.title}</div>
            <div className="text">{this.strip(item.text)}</div>
          </Link>
        </li>
      );
    });
    return nodes.length ? nodes : <li>No items found</li>;
  }

  render(){
    return (
      <ul id="List">
        {this.props.loading ? <li>Loading...</li> : this.buildNodes()}
      </ul>
    );
  }
}
