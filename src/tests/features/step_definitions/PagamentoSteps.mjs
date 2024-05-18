import { expect } from 'chai';
import { Given, Then, When } from '@cucumber/cucumber';
import request from 'supertest';
import { app } from '../../../server';

// const request = require('supertest');
// const { Given, When, Then } = require('cucumber');
// const { expect } = require('chai');
// const { app } = require('../../../server');

let response;
let pagamentoRequest;

Given('Eu tenho um pagamento pedido de criação válido', async function () {
    pagamentoRequest = {
        idPedido: 2,
        valor: 10.0,
        tipoPagamento: 'CARTAO_DEBITO',
    };
});

When('Eu submento os dados para criar o pagamento', async function () {
    response = await request(app).post('/api/pagamentos').send(pagamentoRequest);
});

Then('o pagamento deve ser criado com sucesso', function () {
    expect(response.status).to.equal(201);
});