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
    emptyItem.opened = true;
    this.state = {
      items: [emptyItem],
      filters: {},
      sort: {field: 'dateOfUpdate', direction: 'desc'}
    };
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onOpenItem = this.onOpenItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onItemAddedOrUpdated = this.onItemAddedOrUpdated.bind(this);
  }

  componentDidMount() {
    NotesApiClient.getAll(items => {
      items = items.filter(i => i.id);
      var openedItem = this.findOpenedItem(items);
      var emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
      items.forEach(i => i.opened = openedItem ? i.id === openedItem.id : !i.id);
      this.setState({items: items});
    });
  }

  findOpenedItem(items = this.state.items){
    return items.find(i => i.opened);
  }

  findEmptyItem(){
    return this.state.items.find(i => !i.id);
  }

  buildEmptyItem(){
    return {id: 0, title: '', text: ''};
  }

  onOpenNew(){
    var items = this.state.items;
    var emptyItem = this.findEmptyItem();
    if (!emptyItem){
      emptyItem = this.buildEmptyItem();
      items.unshift(emptyItem);
    }
    items.forEach(i => i.opened = !i.id);
    this.setItems(items);
  }

  onSubmit(e){
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
    item.opened = true;
    items.forEach(i => i.opened = i.id === id);
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
    this.setItems(items);
  }

  setItems(items){
    this.setState({items: items});
  }

  onOpenItem(item){
    var items = this.state.items;
    items.forEach(i => i.opened = i.id === item.id);
    this.setItems(items);
  }

  onDeleteItem(item){
    var items = this.state.items;
    if (item.opened){
      this.findEmptyItem().opened = true;
    }
    items = items.filter(i => i.id !== item.id);
    this.setItems(items);
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

  render(){
    var filteredItems = this.filter(this.state.items);
    var sortedItems = this.sort(filteredItems);
    var openedItem = this.findOpenedItem();
    return (
      <div id="App">
        <div id="head">
          <h1>ShortNote</h1>
          <button id="openNew" onClick={this.onOpenNew}>Open new</button>
        </div>
        <div id="body">
          <div id="filtersAndSortCont">
            <div id="filtersCont">
              <Filters filters={this.state.filters} onFiltersChange={this.onFiltersChange}></Filters>
            </div>
            <div id="sortCont">
            <Sort sort={this.state.sort} onSortChange={this.onSortChange}></Sort>
            </div>
          </div>
          <div id="listCont">
            <List items={sortedItems} onOpenItem={this.onOpenItem} onDeleteItem={this.onDeleteItem}></List>
          </div>
          <div id="formCont">
            <Form item={openedItem} onSubmit={this.onSubmit}></Form>
          </div>
        </div>
      </div>
    );
  }
}
