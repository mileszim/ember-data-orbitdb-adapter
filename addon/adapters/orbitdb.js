import Adapter from '@ember-data/adapter';
import { inject as service } from '@ember/service';

export default class OrbitDBAdapter extends Adapter {
  @service orbitdb;

  async createRecord(store, type, snapshot) {
    let db = await this.orbitdb.findOrCreateDB(type.modelName);
    
    let data = this.serialize(snapshot, { includeId: true });
    
    return await db.put(data)
  }
};
