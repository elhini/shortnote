import React from 'react';
import { Link } from "react-router-dom";
import { observer } from "mobx-react"
import NotesApiClient from '../../api-clients/notes';
import SettingsApiClient from '../../api-clients/settings';
import StringUtils from '../../utils/StringUtils';
import Filters from '../../components/Filters/Filters';
import Sort from '../../components/Sort/Sort';
import Form from '../../components/Form/Form';
import List from '../../components/List/List';
import Alert from '../../components/Alert/Alert';
import ReadonlyNote from '../../components/ReadonlyNote/ReadonlyNote';
import DateUtils from '../../utils/DateUtils';
import AddIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import { Item, FiltersValue, SortValue, ItemDiff, Tag, FiltersValueDiff, SortValueDiff, Setting } from '../../types/index';
import { RouteComponentProps } from "react-router-dom";
import './Notes.css';

interface AppProps extends RouteComponentProps {
    match: {
        params: {
            id: string
        }; 
        isExact: boolean; 
        path: string; 
        url: string;
    };
    store: AppStore
}

interface AppStore {
    item: Item | null | undefined;
    items: Item[];
    filters: FiltersValue;
    sort: SortValue;
    loading: boolean;
    formChanged: boolean;
    submitting: boolean;
    error: string;
    publicLinkCopied: boolean;
    formManualSubmitEnabled: Setting['notesFormManualSubmitEnabled'];
    buildEmptyItem: () => Item;
}

@observer
export default class Notes extends React.Component<AppProps> {
  tags: Tag[]; // TODO: move to state
  accessLevels: {id: number, name: string}[];
  history: RouteComponentProps['history'];
  stopListeningHistory: () => void;
  notesApiClient: NotesApiClient;
  autosaveTimeoutID: number;

  constructor(props: AppProps) {
    super(props);
    var id = props.match.params.id;
    props.store.item = id === 'new' ? props.store.buildEmptyItem() : null;
    this.tags = [];
    this.accessLevels = [{id: 1, name: 'viewing'}, {id: 2, name: 'editing'}];
    this.history = props.history;
    this.stopListeningHistory = this.history.listen(location => {
      this.getItemByLocation(props.store.items);
    });
    this.notesApiClient = new NotesApiClient(this);
    this.autosaveTimeoutID = 0;
    this.onOpenNew = this.onOpenNew.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onItemChangePartially = this.onItemChangePartially.bind(this);
    this.onPublicLinkCopy = this.onPublicLinkCopy.bind(this);
  }
  
  getItemIDFromLocation(){
    return window.location.pathname.split('notes/')[1];
  }
  
  getPublicItemIDFromLocation(){
    var id = this.getItemIDFromLocation() || '';
    return id.split('public/')[1];
  }

  isPublicItemLocation(){
    return !!this.getPublicItemIDFromLocation();
  }

  getItemByLocation(items: Item[]){
    var cb = (item: Item | undefined) => {
      this.props.store.items = items;
      this.props.store.item = item;
    };
    var id = this.getItemIDFromLocation();
    var item = id === 'new' ? this.props.store.buildEmptyItem() : items.find(i => i._id === id);
    if (id && id !== 'new' && !item){
      var publicID = this.getPublicItemIDFromLocation();
      if (publicID){
        this.notesApiClient.getPublic(publicID, (item: Item) => {
          cb(item);
        });
      }
      else {
        this.props.store.error = 'note with specified id not found';
      }
    }
    cb(item);
  }

  loadSettings(){
    return new Promise((resolve, reject) => {
      new SettingsApiClient().getAll((settings: Setting[]) => {
        var setting = settings[0] || {};
        this.props.store.formManualSubmitEnabled = setting.notesFormManualSubmitEnabled;
        resolve();
      });
    });
  }

  loadItems(){
    return new Promise((resolve, reject) => {
      this.notesApiClient.getAll((items: Item[]) => {
        this.getItemByLocation(items);
        resolve();
      });
    });
  }

  componentDidMount() {
    if (this.isPublicItemLocation()){
      this.getItemByLocation([]);
      return;
    }
    Promise.all([this.loadSettings(), this.loadItems()]);
  }

  componentWillUnmount() {
    this.stopListeningHistory();
  }

  onOpenNew(){
    var emptyItem = this.props.store.buildEmptyItem();
    this.props.store.item = emptyItem;
  }

  onClose(){
    this.props.store.item = null;
  }

  onSubmit(e: React.FormEvent<HTMLFormElement> | null, item = this.props.store.item){
    e && e.preventDefault();
    if (!item || (!item.title && !item.text)){
      return;
    }
    if (!item._id){
      item.dateOfCreate = new Date();
    }
    item.dateOfUpdate = new Date();
    if (item._id){
      this.updateItem(item, i => this.onItemChange(i, false));
    }
    else {
      this.createItem(item, i => this.onItemChange(i, true));
    }
  }

  createItem(item: Item, cb: (i: Item) => void){
    this.notesApiClient.create(item, cb);
  }

  updateItem(item: Item, cb: (i: Item) => void){
    this.notesApiClient.update(item, cb);
  }

  // TODO: move to Utils
  isObjectsEqual(obj1: any, obj2: any){
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  isItemsDiffer(item1: Item, item2: AppStore['item']){
    if (!item2){
      return true;
    }
    return item1.title !== item2.title || 
           item1.text !== item2.text || 
           item1.publicAccess !== item2.publicAccess || 
           // item1.accessLevel !== item2.accessLevel || 
           !this.isObjectsEqual(item1.tags, item2.tags);
  }

  onItemChange(item: Item, isNew?: boolean){
    item = {...this.props.store.item, ...item};
    var isChanged = this.isItemsDiffer(item, this.props.store.item);
    var items = this.props.store.items;
    if (!isNew){
      items = items.filter(i => i._id !== item._id); // remove old version
    }
    items.push(item);
    this.props.store.items = items;
    this.props.store.item = item;
    this.props.store.formChanged = isChanged;
    isNew && this.history.push('/notes/' + item._id);
    if (isChanged && !this.props.store.submitting && !this.props.store.formManualSubmitEnabled){
      window.clearTimeout(this.autosaveTimeoutID);
      this.autosaveTimeoutID = window.setTimeout(() => {
        this.onSubmit(null, item);
      }, 1000);
    }
  }

  onDeleteItem(item: Item){
    var items = this.props.store.items;
    items = items.filter(i => i._id !== item._id);
    this.notesApiClient.remove(item, () => {
      var openedItem = this.props.store.item && this.props.store.item._id === item._id ? null : this.props.store.item;
      this.props.store.items = items;
      this.props.store.item = openedItem;
      this.history.push('/notes');
    });
  }

  onFiltersChange(filters: FiltersValueDiff){
    let newFilters = {...this.props.store.filters, ...filters};
    this.props.store.filters = newFilters;
  }

  onSortChange(sort: SortValueDiff){
    let newSort = {...this.props.store.sort, ...sort};
    this.props.store.sort = newSort;
  }

  filter(items: Item[]){
    return items.filter(i => {
      // text
      var text = this.props.store.filters.text;
      var useTextFilter = !!text;
      var matchByText = useTextFilter ? StringUtils.isContains(i.text, text) || StringUtils.isContains(i.title, text) : true;
      // tags
      var tags = this.props.store.filters.tags;
      var filterTagIDs = tags ?   tags.map(t => t.value) : [];
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

  sort(items: Item[]){
    var field = this.props.store.sort.field;
    var sign = this.props.store.sort.direction === 'asc' ? 1 : -1;
    return items.sort((i1, i2) => {
      var v1 = i1[field];
      var v2 = i2[field];
      if (field.includes('date')){
        v1 = DateUtils.toStr(v1);
        v2 = DateUtils.toStr(v2);
      }
      return v1 > v2 ? sign : (v1 < v2 ? -sign : 0);
    })
  }

  // TODO: load from DB
  buildTagList(){
    return this.props.store.items.reduce((tags: Tag[], item) => tags.concat(item.tags || []), []);
  }

  onCreateTag(tagName: string) {
    var maxID = Math.max.apply(Math, this.tags.map(t => t.value));
    var newID = maxID < 0 ? 1 : maxID + 1;
    var tag = { value: newID, label: tagName };
    this.tags.push(tag);
    var item: ItemDiff = {};
    item.tags = this.props.store.item ? this.props.store.item.tags.slice() : [];
    item.tags.push(tag);
    this.onItemChangePartially(item);
  }

  onItemChangePartially(item: ItemDiff) {
    this.onItemChange(item as Item);
  }

  onPublicLinkCopy(){
    this.props.store.publicLinkCopied = true;
  }

  render(){
    if (this.props.store.item && this.isPublicItemLocation()){
      return <ReadonlyNote item={this.props.store.item} />;
    }
    return (
      <div id="Notes" className={this.props.store.item ? 'itemSelected' : ''}>
        <div>
          <Link to={'/notes/new'} id="openNew" onClick={this.onOpenNew} className="btnLink"><AddIcon /> Open new</Link>
          <Link to={'/notes'} id="close" onClick={this.onClose} className="btnLink"><CloseIcon /> Close</Link>
          {this.props.store.error && <div className="alert error" id="notesError">{this.props.store.error}</div>}
          {this.props.store.publicLinkCopied && <Alert variant="success" message="Copied!" onClose={() => this.props.store.publicLinkCopied = false} />}
        </div>
        {this.renderBody()}
      </div>
    );
  }

  filterAndSortItems(items: Item[]){
    var filteredItems = this.filter(items);
    var sortedItems = this.sort(filteredItems);
    return sortedItems;
  }

  renderBody(){
    var items = this.filterAndSortItems(this.props.store.items);
    this.tags = this.buildTagList();

    var form = null;
    var item = this.props.store.item;
    if (item){
      form = <Form item={item} onSubmit={this.onSubmit} submitEnabled={this.props.store.formManualSubmitEnabled} tags={this.tags} 
        /* accessLevels={this.accessLevels} */
        onCreateTag={this.onCreateTag} onItemChange={this.onItemChangePartially} onPublicLinkCopy={this.onPublicLinkCopy} 
        sending={this.props.store.submitting} changed={this.props.store.formChanged}></Form>;
    }

    return (
      <div id="wrap">
        <div id="aside">
          <div id="filtersAndSortCont">
            <div id="filtersCont">
              <Filters filters={this.props.store.filters} onFiltersChange={this.onFiltersChange} tags={this.tags}></Filters>
            </div>
            <div id="sortCont">
              <Sort sort={this.props.store.sort} onSortChange={this.onSortChange}></Sort>
            </div>
          </div>
          <div id="listCont">
            <List items={items} item={item} onDeleteItem={this.onDeleteItem} loading={this.props.store.loading}></List>
          </div>
        </div>
        <div id="formCont">
          {form}
        </div>
      </div>
    );
  }
}
