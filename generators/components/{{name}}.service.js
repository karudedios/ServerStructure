import fs from 'fs';
import { compose } from 'functional-programming-utilities';

const path = __dirname + '/data.json';
const getData = compose(fs.readFileSync.bind(fs, path, 'utf8'), JSON.parse);
const saveData = compose(JSON.stringify, fs.writeFileSync.bind(fs, path), getData);

export default class <%=name%>Service{
  constructor() {
  }

  static getAll() {
    return getData();
  }

  static where(predicate) {
    return getData().filter(predicate);
  }

  static first(predicate) {
    return getData().filter(predicate)[0];
  }

  static save(item) {
    const data = getData();
    const id = (data.sort((a, b) => b.id - a.id).map(x => x.id)[0] || 0) + 1;
    return saveData(getData().concat(Object.assign({}, item, { id })));
  }

  static update(id, item) {
    return saveData(getData().map(data => data.id == id ? Object.assign({}, data, item) : data));
  }

  static delete(id) {
    return saveData(getData().filter(data => data.id != id));
  }
};
