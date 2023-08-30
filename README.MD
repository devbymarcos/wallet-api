# Api de gerenciamento de Carteira

**URL BASE**

A url base está definida no arquivo `env` na raiz do projeto.

Ao baixar o projeto você terá na raiz um `env.exemplo` é um arquivo de modelo. Você deve copiar ele e criar um `env` com os dados de exemplo e substituir

```
http://localhost:4000/v1
```

## Login

O objetivo do `login` é termos um token para poder validar na nossa api todas as outras requisições, durante o uso do nosso aplicativo.

Para realizar de fato o login você pode utilizar o **Insomnia** ou o **Postman**.

Faça requisição enviando um JSON.

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
