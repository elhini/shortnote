import { autorun, observable } from "mobx"
import { Item } from '../../types/index';

export default class NoteStore {
  constructor() {
    autorun(() => {
      console.log('item', this.item);
      console.log('items', this.items);
    });
  }

  @observable item = null;
  @observable items = [];
  @observable filters = {text: '', tags: []};
  @observable sort = {field: 'dateOfUpdate', direction: 'desc'};
  @observable loading = false;
  @observable formChanged = false;
  @observable submitting = false;
  @observable error = '';
  @observable publicLinkCopied = false;
  @observable formManualSubmitEnabled = false;

  buildEmptyItem(): Item {
    return {_id: '', title: '', text: '', tags: [], dateOfCreate: new Date(), dateOfUpdate: new Date(), publicAccess: false};
  }
}