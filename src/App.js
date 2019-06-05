import React from 'react';
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
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onOpenItem = this.onOpenItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onItemAddedOrUpdated = this.onItemAddedOrUpdated.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onTagsChange = this.onTagsChange.bind(this);
  }

  componentDidMount() {
    NotesApiClient.getAll(items => {
      items = items.filter(i => i.id);
      var openedItem = items.reduce((last, item) => {
        return (!last || item.dateOfUpdate > last.dateOfUpdate) ? item : last;
      }, null);
      var emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
      this.setState({items: items, item: openedItem || emptyItem});
    });
  }

  findOpenedItem(items = this.state.items){
    return items.find(i => i.id === this.state.item.id);
  }

  findEmptyItem(items = this.state.items){
    return items.find(i => !i.id);
  }

  buildEmptyItem(){
    return {id: 0, title: '', text: '', tags: []};
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
    var id = parseInt(form.id.value);
    var items = this.state.items;
    var item = id ?
      items.find(i => i.id === id) : 
      this.buildEmptyItem();
    if (!id){
      item.id = Date.now();
      item.dateOfCreate = new Date();
    }
    item.dateOfUpdate = new Date();
    item.title = form.title.value;
    item.text = form.text.value;
    item.tags = formCmp.state.tags;
    if (id){
      this.updateItem(item, this.onItemAddedOrUpdated);
    }
    else {
      this.createItem(item, this.onItemAddedOrUpdated);
    }
  }

  createItem(item, cb){
    NotesApiClient.create(item, cb);
  }

  updateItem(item, cb){
    NotesApiClient.update(item, cb);
  }

  onItemAddedOrUpdated(item){
    var items = this.state.items;
    items = items.filter(i => i.id !== item.id);
    items.push(item);
    items.sort((a, b) => a.id - b.id);
    this.setState({items: items, item: item});
  }

  onOpenItem(item){
    var items = this.state.items;
    this.setState({items: items, item: item});
  }

  onDeleteItem(item){
    var items = this.state.items;
    var emptyItem = this.findEmptyItem();
    items = items.filter(i => i.id !== item.id);
    NotesApiClient.remove(item, res => {
      var openedItem = item.id === this.state.item.id ? emptyItem : this.state.item;
      this.setState({items: items, item: openedItem});
    });
  }

  onFiltersChange(filters){
    this.setState({filters: filters});
  }

  onSortChange(sort){
    sort = Object.assign({}, this.state.sort, sort);
    this.setState({sort: sort});
  }

  filter(items){
    return items.filter(i => {
      var text = this.state.filters.text;
      var matchByTitle = text && StringUtils.isContains(i.title, text);
      var matchByText = text && StringUtils.isContains(i.text, text);
      return text ? (!i.id || matchByTitle || matchByText) : true;
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

  onTagsChange(tags) {
    var item = this.state.item;
    item.tags = tags;
    this.onItemAddedOrUpdated(item);
  }

  render(){
    var filteredItems = this.filter(this.state.items);
    var sortedItems = this.sort(filteredItems);
    this.buildTagList();
    return (
      <div id="App">
        <div id="head">
          <h1>ShortNote</h1>
          <button id="openNew" onClick={this.onOpenNew}>Open new</button>
        </div>
        <div id="body">
          <div id="aside">
            <div id="filtersAndSortCont">
              <div id="filtersCont">
                <Filters filters={this.state.filters} onFiltersChange={this.onFiltersChange}></Filters>
              </div>
              <div id="sortCont">
              <Sort sort={this.state.sort} onSortChange={this.onSortChange}></Sort>
              </div>
            </div>
            <div id="listCont">
              <List items={sortedItems} item={this.state.item} onOpenItem={this.onOpenItem} onDeleteItem={this.onDeleteItem}></List>
            </div>
          </div>
          <div id="formCont">
            <Form item={this.state.item} onSubmit={this.onSubmit} tags={this.tags} onCreateTag={this.onCreateTag} onTagsChange={this.onTagsChange}></Form>
          </div>
        </div>
      </div>
    );
  }
}
