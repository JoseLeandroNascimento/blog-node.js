const express = require("express");
const app = express();
const Categoria = require("./categorias/Categoria");
const Artigo = require("./artigos/Artigo");
const User = require("./user/User");
const connection = require("./database/database");
const categoriaController = require("./categorias/categoriaController");
const artigoController = require("./artigos/artigosControllers");
const userController = require('./user/userController');
const session = require('express-session')


connection.authenticate().then(() => {

    console.log("Conexão estabelecida");

}).catch(err => {

    console.log(err);
})

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(session({
    secret: "m234j1kh42jh34jk2h34u2134jkjk2314i21h34ui2",
    cookie:{
        maxAge: 3000000
    }
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(categoriaController);
app.use(artigoController);
app.use(userController);


app.get('/session',(req,res)=>{

    req.session.treinamento = "formação node.js"
    req.session.ano = 2019
    req.session.email = "jose@gmail.com"
    req.session.user ={

        username: 'jose@gmail.com',
        email: 'email@gmail.com',
        id: 10
    }

    res.send('teste')
})


app.get('/leitura',(req,res)=>{

    res.json({

        treinamento: req.session.treinamento,
        ano : req.session.ano,
        email: req.session.email,
        user: req.session.user
    })

    

})

app.get('/', (req, res) => {

    Artigo.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4,

    }).then(artigos => {

        Categoria.findAll().then(categorias => {

            res.render("index", { artigos: artigos, categorias: categorias });

        })

    })
})

app.get('/:slug', (req, res) => {

    let slug = req.params.slug;

    Artigo.findOne({
        where: {
            slug: slug
        }
    }).then(artigo => {

        if (artigo != undefined) {

            Categoria.findAll().then(categorias => {

                res.render("artigo", { artigo: artigo, categorias: categorias });

            })

        } else {

            res.redirect("/");
        }
    }).catch(err => {

        res.redirect("/");
    })
})


app.get('/categoria/:slug', (req, res) => {

    let slug = req.params.slug;

    Categoria.findOne({
        where: {

            slug: slug
        },
        include: [{

            model: Artigo
        }]

    }).then(categoria => {

        if (categoria != undefined) {

            Categoria.findAll().then(categorias => {

                res.render('index', { artigos: categoria.artigos, categorias: categorias });
            });

        } else {

            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");

    })
})
app.listen(3000, () => {

    console.log("http://localhost:3000");
})