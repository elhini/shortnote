import React from 'react';
import './App.css';
import ls from './utils/LocalStorage';
import StringUtils from './utils/StringUtils';
import Filters from './components/Filters/Filters';
import Sort from './components/Sort/Sort';
import Form from './components/Form/Form';
import List from './components/List/List';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var items = ls.get();
    items = items.filter(i => i.id);
    var openedItem = this.findOpenedItem(items);
    var emptyItem = this.buildEmptyItem();
    items.unshift(emptyItem);
    items.forEach(i => i.opened = openedItem ? i.id === openedItem.id : !i.id);
    this.state = {
      items: items,
      filters: {},
      sort: {field: 'dateOfUpdate'}
    };
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onOpenItem = this.onOpenItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
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
    if (id){
      items = items.filter(i => i.id !== id);
    }
    items.forEach(i => i.opened = false);
    items.push(item);
    items.sort((a, b) => a.id - b.id);
    this.setItems(items);
  }

  setItems(items){
    this.saveToStore(items);
    this.setState({items: items});
  }

  saveToStore(items){
    ls.set(items.filter(i => i.id));
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
    console.log('on change', sort);
    this.setState({sort: sort});
  }

  render(){
    var items = this.state.items.filter(i => {
      var text = this.state.filters.text;
      return text ? (!i.id || StringUtils.isContains(i.text, text) || StringUtils.isContains(i.title, text)) : true;
    });
    console.log('on render', this.state.sort);
    items = items.sort((i1, i2) => {
      var field = this.state.sort.field;
      return i1[field] > i2[field] ? 1 : (i1[field] < i2[field] ? -1 : 0);
    })
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
            <List items={items} onOpenItem={this.onOpenItem} onDeleteItem={this.onDeleteItem}></List>
          </div>
          <div id="formCont">
            <Form item={openedItem} onSubmit={this.onSubmit}></Form>
          </div>
        </div>
      </div>
    );
  }
}
