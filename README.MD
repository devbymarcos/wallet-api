# Api de gerenciamento de Carteira

## Introdução

O obejtivo da api é o gerenciamento de receitas e despesas financeiras. Todos os registros estão vinculados a uma carteira.
Também é possivel criar categorias para vincular as depesas ou a receitas.

## Instruções Primarias

-   Para realizar requisições você pode utilizar um cliente como **Insomnia** ou o **Postman**.
-   O Sumário vai ajudar a navegar na documentação.
-   A url base está definida no arquivo `env` na raiz do projeto.

## Sumário

Endpoints

-   [/user](#User)
-   [/login](#login)

### URL BASE

Ao baixar o projeto você terá na raiz um `.env.exemplo` é um arquivo de modelo. Você deve copiar ele e criar um `.env` com os dados de exemplo e substituir

```
http://localhost:4000/v1
```

## User -

Cria um novo usuário

`POST` **/user**

**Request body:**

Você deve enviar os dados no corpo da requisição

```
{
  "first_name": "seu nome",
  "last_name": "seu sobrenome",
  "email": "email@email.com",

}
```

### Schema

```
    {
        "first_name": "string",
        "last_name": "string",
        "email": "string",

    }
```

### Response -

Você pode obter as seguintes respostas

Code `200` description `ok`

Tipo: `application/json`

```
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "photo": "string",
  "token": "string"
}
```

## Login

Verifica os dados e devolve o token

Para realizar de fato o login você pode utilizar o **Insomnia** ou o **Postman**.

### Ponto de acesso / endPoint

`POST` **/login**

**Request body:**

Você deve enviar os dados no corpo da requisição

```
{
    "email": "email@alteraroemail.com",
    "passwd" : "senha-aqui"
}
```

### Schema

```
    {
        "email": string,
        "passwd" : string
    }
```

**Response:**

Você pode obter as seguintes respostas

-   `200` description `ok`
    Tipo: `application/json`

```
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "photo": "string",
  "token": "string"
}
```

-   `204` usuário nao encontrado
