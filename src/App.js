import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
    var emptyItem = this.buildEmptyItem();
    this.state = {
      item: emptyItem,
      items: [emptyItem],
      filters: {},
      sort: {field: 'dateOfUpdate', direction: 'desc'}
    };
    this.tags = [];
    this.history = null;
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onItemAddedOrUpdated = this.onItemAddedOrUpdated.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
  }

  componentDidMount() {
    NotesApiClient.getAll(items => {
      items = items.filter(i => i._id);
      var openedItem = items.reduce((last, item) => {
        return (!last || item.dateOfUpdate > last.dateOfUpdate) ? item : last;
      }, null);
      var emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
      this.setState({items: items, item: openedItem || emptyItem});
    });
  }

  findOpenedItem(items = this.state.items){
    return items.find(i => i._id === this.state.item._id);
  }

  findEmptyItem(items = this.state.items){
    return items.find(i => !i._id);
  }

  buildEmptyItem(){
    return {_id: '', title: '', text: '', tags: []};
  }

  onOpenNew(){
    var items = this.state.items;
    var emptyItem = this.findEmptyItem();
    if (!emptyItem){
      emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
    }
    this.setState({items: items, item: emptyItem});
  }

  onSubmit(e, formCmp){
    e.preventDefault();
    var form = e.target;
    if (!form.title.value && !form.text.value){
      return;
    }
    var id = form.id.value;
    var items = this.state.items;
    var item = id ?
      items.find(i => i._id === id) : 
      this.buildEmptyItem();
    if (!id){
      item.dateOfCreate = new Date();
    }
    item.dateOfUpdate = new Date();
    item.title = form.title.value;
    item.text = form.text.value;
    item.tags = formCmp.state.tags;
    if (id){
      this.updateItem(item, i => this.onItemAddedOrUpdated(i, false));
    }
    else {
      this.createItem(item, i => this.onItemAddedOrUpdated(i, true));
    }
  }

  createItem(item, cb){
    NotesApiClient.create(item, cb);
  }

  updateItem(item, cb){
    NotesApiClient.update(item, cb);
  }

  onItemAddedOrUpdated(item, isNew){
    var items = this.state.items;
    items = items.filter(i => i._id !== item._id);
    items.push(item);
    this.setState({items: items, item: item});
    isNew && this.history.push('/note/' + item._id);
  }

  onDeleteItem(item){
    var items = this.state.items;
    var emptyItem = this.findEmptyItem();
    items = items.filter(i => i._id !== item._id);
    NotesApiClient.remove(item, res => {
      var openedItem = item._id === this.state.item._id ? emptyItem : this.state.item;
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
    this.tags = this.state.items.reduce((tags, item) => tags.concat(item.tags || []), []);
  }

  onCreateTag(tagName) {
    var maxID = Math.max.apply(Math, this.tags.map(t => t.value));
    var newID = maxID < 0 ? 1 : maxID + 1;
    var tag = { value: newID, label: tagName };
    this.tags.push(tag);
    var item = this.state.item;
    if (!item.tags){
      item.tags = [];
    }
    item.tags.push(tag);
    this.onItemAddedOrUpdated(item);
  }

  onItemChange(item) {
    // TODO: refactor this
    this.onItemAddedOrUpdated(item);
  }

  render(){
    return (
      <div id="App">
        <Router>
          <div id="head">
            <h1>
              ShortNote
              <Link to={'/note/new'} id="openNew" onClick={this.onOpenNew}>Open new</Link>
            </h1>
          </div>
          <Route path={`/note/:id`} render={m => this.renderBody(m)} />
          <Route path={`/`}   exact render={m => this.renderBody(m)} />
        </Router>
      </div>
    );
  }

  renderBody({ match, history }){
    this.history = history;
    var id = match.params.id === 'new' ? '' : match.params.id;
    var item = match.params.id ? this.state.items.find(i => i._id === id) : null;
    var filteredItems = this.filter(this.state.items);
    var sortedItems = this.sort(filteredItems);
    this.buildTagList();
    var form = item ? 
      <Form item={item} onSubmit={this.onSubmit} tags={this.tags} onCreateTag={this.onCreateTag} onItemChange={this.onItemChange}></Form> : 
      null;
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
            <List items={sortedItems} item={item} onDeleteItem={this.onDeleteItem}></List>
          </div>
        </div>
        <div id="formCont">
          {form}
        </div>
      </div>
    );
  }
}
