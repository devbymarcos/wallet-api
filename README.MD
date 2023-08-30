# Api de gerenciamento de Carteira

## Introdução

O obejtivo da api é o gerenciamento de receitas e despesas financeiras. Todos os registros estão vinculados a uma carteira.
Também é possivel criar categorias para vincular as depesas ou a receitas.

### URL BASE

A url base está definida no arquivo `env` na raiz do projeto.

Ao baixar o projeto você terá na raiz um `.env.exemplo` é um arquivo de modelo. Você deve copiar ele e criar um `.env` com os dados de exemplo e substituir

```
http://localhost:4000/v1
```

## Login

O objetivo do `login` é termos um token para poder validar na nossa api todas as outras requisições, durante o uso do nosso aplicativo.

Para realizar de fato o login você pode utilizar o **Insomnia** ou o **Postman**.

Faça requisição enviando um JSON.

### Ponto de acesso / endPoint

`POST` **/login**

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
