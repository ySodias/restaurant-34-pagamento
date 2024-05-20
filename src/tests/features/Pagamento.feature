Feature: Criando pagamento

  Scenario: Criação de pagamento bem sucedido
    Given Eu tenho um pagamento pedido de criação válido
    When Eu submento os dados para criar o pagamento
    Then o pagamento deve ser criado com sucesso

#   Scenario: Failed payment due to insufficient funds
#     Given I have a payment request with insufficient funds
#     When I submit the payment
#     Then the payment should be declined
