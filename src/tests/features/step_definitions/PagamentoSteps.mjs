import { expect } from 'chai';
import { Given, Then, When, AfterAll} from '@cucumber/cucumber';
import request from 'supertest';
import * as http from 'http'; 
import server from '../../../../dist/server.js';

let response;
let pagamentoRequest;

Given('Eu tenho um pagamento pedido de criação válido', function () {
    pagamentoRequest = {
        idPedido: 2,
        valor: 10.0,
        tipoPagamento: 'CARTAO_DEBITO',
    };
});

When('Eu submento os dados para criar o pagamento', async function () {
  
    response = await server.default.post('/api/pagamentos').send({
      idPedido: 2,
      valor: 10.0,
      tipoPagamento: 'CARTAO_DEBITO',
  })

});

Then('o pagamento deve ser criado com sucesso', function () {
    expect(response.status).to.equal(201);
});

AfterAll(async () => {
    await server.close();

    // Desconecte do MongoDB
    // await MongoDB.disconnect();
})