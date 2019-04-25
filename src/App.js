import React from 'react';
import './App.css';
import ls from './utils/LocalStorage';
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
      items: items
    };
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onOpenItem = this.onOpenItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
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

  render(){
    var openedItem = this.findOpenedItem();
    return (
      <div id="App">
        <h1>ShortNote</h1>
        <button id="openNew" onClick={this.onOpenNew}>Open new</button>
        <Form item={openedItem} onSubmit={this.onSubmit}></Form>
        <h2>List</h2>
        <List items={this.state.items} onOpenItem={this.onOpenItem} onDeleteItem={this.onDeleteItem}></List>
      </div>
    );
  }
}
