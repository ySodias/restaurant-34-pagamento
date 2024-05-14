print('Start #################################################################');

db = db.getSiblingDB('db_pagamento');
db.createUser(
  {
    user: 'root',
    pwd: 'password',
    roles: [{ role: 'readWrite', db: 'api_prod_db' }],
  },
);
db.createCollection('users');

print('END #################################################################');