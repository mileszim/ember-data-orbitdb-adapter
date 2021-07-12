import Service from '@ember/service';
import { A } from '@ember/array';

import IPFS from 'ipfs-core';
import OrbitDB from 'orbit-db';

export default class OrbitDBService extends Service {
  _orbitdb = null;
  _ipfsNode = null;
  _repo = 'ipfs';
  _databases = A([]);

  async startIFPSNode() {
    if (this._ipfsNode !== null) {
      return this._ipfsNode;
    }

    this._ipfsNode = await IPFS.create({ repo: this._repo });
    return this._ipfsNode;
  }

  async createInstance() {
    this._ipfsNode = this._ipfsNode || (await this.startIFPSNode());
    return this._orbitdb || (await OrbitDB.createInstance(this._ipfsNode));
  }

  async findOrCreateDB(name) {
    if (!this._orbitdb) {
      await this.createInstance();
    }

    // Find
    let db = this._databases.findBy('name', name);
    if (db) return db;

    // Create
    db = await this._orbitdb.docs(name);
    this._databases.pushObject({ [name]: db });

    // Load
    db.load();

    return db;
  }
};
