import React from 'react';
import { Link } from "react-router-dom";
import './App.css';
import NotesApiClient from './api-clients/notes';
import StringUtils from './utils/StringUtils';
import Filters from './components/Filters/Filters';
import Sort from './components/Sort/Sort';
import Form from './components/Form/Form';
import List from './components/List/List';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var id = props.match.params.id;
    var item = id === 'new' ? this.buildEmptyItem() : null;
    this.state = {
      item: item,
      items: [],
      filters: {},
      sort: {field: 'dateOfUpdate', direction: 'desc'}
    };
    this.tags = [];
    this.history = props.history;
    this.stopListeningHistory = this.history.listen(location => {
      var item = this.getItemByLocation();
      this.setState({item: item});
    });
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
  }

  getItemByLocation(items = this.state.items){
    var id = window.location.pathname.split('note/')[1];
    var item = id === 'new' ? this.buildEmptyItem() : items.find(i => i._id === id);
    return item;
  }

  componentDidMount() {
    this.setState({loadingList: true});
    NotesApiClient.getAll(items => {
      var item = this.getItemByLocation(items);
      this.setState({items: items, loadingList: false, item: item});
    });
  }

  componentWillUnmount() {
    this.stopListeningHistory();
  }

  buildEmptyItem(){
    return {_id: '', title: '', text: '', tags: []};
  }

  onOpenNew(){
    var emptyItem = this.buildEmptyItem();
    this.setState({item: emptyItem});
  }

  onSubmit(e, formCmp){
    e.preventDefault();
    var form = e.target;
    if (!form.title.value){
      return;
    }
    var id = form.id.value;
    var item = this.state.item;
    if (!id){
      item.dateOfCreate = new Date();
    }
    item.dateOfUpdate = new Date();
    this.setState({sendingForm: true});
    if (id){
      this.updateItem(item, i => this.onItemChange(i, false));
    }
    else {
      this.createItem(item, i => this.onItemChange(i, true));
    }
  }

  createItem(item, cb){
    NotesApiClient.create(item, cb);
  }

  updateItem(item, cb){
    NotesApiClient.update(item, cb);
  }

  onItemChange(item, isNew){
    item = Object.assign({}, this.state.item, item);
    var items = this.state.items;
    if (!isNew){
      items = items.filter(i => i._id !== item._id); // remove old version
    }
    items.push(item);
    this.setState({items: items, item: item, sendingForm: false});
    isNew && this.history.push('/note/' + item._id);
  }

  onDeleteItem(item){
    var items = this.state.items;
    items = items.filter(i => i._id !== item._id);
    NotesApiClient.remove(item, res => {
      var openedItem = this.state.item && this.state.item._id === item._id ? null : this.state.item;
      this.setState({items: items, item: openedItem});
      this.history.push('/');
    });
  }

  onFiltersChange(filters){
    filters = Object.assign({}, this.state.filters, filters);
    this.setState({filters: filters});
  }

  onSortChange(sort){
    sort = Object.assign({}, this.state.sort, sort);
    this.setState({sort: sort});
  }

  filter(items){
    return items.filter(i => {
      // text
      var text = this.state.filters.text;
      var useTextFilter = !!text;
      var matchByText = useTextFilter ? StringUtils.isContains(i.text, text) || StringUtils.isContains(i.title, text) : true;
      // tags
      var tags = this.state.filters.tags;
      var filterTagIDs = tags ? tags.map(t => t.value) : [];
      var itemTagIDs = i.tags ? i.tags.map(t => t.value) : [];
      var useTagsFilter = tags && !!tags.length;
      var matchByTags = useTagsFilter ? itemTagIDs.some(itemTagID => filterTagIDs.includes(itemTagID)) : true;
      // match
      var useFilters = useTextFilter || useTagsFilter;
      return useFilters && i._id 
        ? (
          (useTextFilter ? matchByText : true) && 
          (useTagsFilter ? matchByTags : true)
        )
        : true;
    });
  }

  sort(items){
    var field = this.state.sort.field;
    var sign = this.state.sort.direction === 'asc' ? 1 : -1;
    return items.sort((i1, i2) => {
      return i1[field] > i2[field] ? sign : (i1[field] < i2[field] ? -sign : 0);
    })
  }

  // TODO: load from DB
  buildTagList(){
    return this.state.items.reduce((tags, item) => tags.concat(item.tags || []), []);
  }

  onCreateTag(tagName) {
    var maxID = Math.max.apply(Math, this.tags.map(t => t.value));
    var newID = maxID < 0 ? 1 : maxID + 1;
    var tag = { value: newID, label: tagName };
    this.tags.push(tag);
    var item = this.state.item || this.buildEmptyItem();
    if (!item.tags){
      item.tags = [];
    }
    item.tags.push(tag);
    this.onItemChange(item);
  }

  render(){
    return (
      <div id="App">
        <div id="head">
          <h1>
            ShortNote
            <Link to={'/note/new'} id="openNew" onClick={this.onOpenNew}>Open new</Link>
          </h1>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  renderBody(){
    var filteredItems = this.filter(this.state.items);
    var sortedItems = this.sort(filteredItems);
    this.tags = this.buildTagList();

    var form = null;
    var item = this.state.item;
    if (item){
      form = <Form item={item} onSubmit={this.onSubmit} tags={this.tags} onCreateTag={this.onCreateTag} onItemChange={this.onItemChange} 
        sending={this.state.sendingForm}></Form>;
    }

    return (
      <div id="body">
        <div id="aside">
          <div id="filtersAndSortCont">
            <div id="filtersCont">
              <Filters filters={this.state.filters} onFiltersChange={this.onFiltersChange} tags={this.tags}></Filters>
            </div>
            <div id="sortCont">
              <Sort sort={this.state.sort} onSortChange={this.onSortChange}></Sort>
            </div>
          </div>
          <div id="listCont">
            <List items={sortedItems} item={item} onDeleteItem={this.onDeleteItem} loading={this.state.loadingList}></List>
          </div>
        </div>
        <div id="formCont">
          {form}
        </div>
      </div>
    );
  }
}
