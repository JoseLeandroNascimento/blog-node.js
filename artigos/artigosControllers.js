const express = require('express');
const router = express.Router();
const Categoria = require("../categorias/Categoria");
const Artigo = require("./Artigo");
const slugify = require("slugify");

router.get("/admin/artigos", (req, res) => {

    Artigo.findAll({
        include: [{ model: Categoria }]


    }).then(artigos => {

        console.log(artigos);
        res.render("admin/artigos/index", { artigos: artigos });

    })
})

router.get("/admin/artigo/new", (req, res) => {


    Categoria.findAll().then(categorias => {

        res.render("admin/artigos/new", { categorias: categorias });

    });

})

router.post("/artigo/save", (req, res) => {

    let titulo = req.body.titulo;
    let body = req.body.corpo;
    let categoria = req.body.categoria;


    Artigo.create({

        titulo: titulo,
        slug: slugify(titulo),
        body: body,
        categoriumId: categoria
    }).then(() => {

        res.redirect("/admin/artigos")
    }).catch((err) => {

        res.redirect("/admin/artigos")

    })

});

router.post("/artigo/delete", (req, res) => {

    let id = req.body.id;
    if (id != undefined) {

        if (!isNaN(id)) {

            Artigo.destroy({
                where: {

                    id: id
                }
            }).then(() => {
                res.redirect("/admin/artigos")

            })

        } else {

            res.redirect("/admin/artigos")
        }

    } else {

        res.redirect("/admin/artigos")

    }
})

router.get("/admin/artigo/edit/:id", (req, res) => {

    let id = req.params.id;


    if (!isNaN(id)) {

        Artigo.findOne({
            where: {

                id: id
            }
        }).then(artigo => {

            if (artigo != undefined) {

                Categoria.findAll().then(categorias => {

                    res.render("admin/artigos/edite", { artigo: artigo, categorias: categorias });

                })
            } else {

                res.redirect('/admin/artigos');

            }
        })

    } else {

        res.redirect('/admin/artigos');
    }

})


router.post('/admin/artivo/update', (req, res) => {

    let id = req.body.id;
    let titulo = req.body.titulo;
    let body = req.body.corpo;
    let categoria = req.body.categoria;

    Artigo.update({
        titulo: titulo,
        slug: slugify(titulo),
        body: body,
        categoriumId: categoria
    }, {
        where: {
            id: id
        }
    }).then(() => {

        res.redirect("/admin/artigos");
    })
})

router.get("/artigos/page/:num", (req, res) => {

    let pagina = req.params.num;
    let offset = 0;

    if (isNaN(pagina) || pagina == 1) {

        offset = 0
    } else {

        offset = (parseInt(pagina) - 1) * 4;
    }

    Artigo.findAndCountAll({

        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(artigos => {

        let next;

        if (offset + 4 >= artigos.count) {

            next = false;

        } else {

            next = true;

        }

        let result = {

            pagina: parseInt(pagina),
            artigos: artigos,
            next: next

        }

        Categoria.findAll().then(categorias => {

            res.render("admin/artigos/page", { result: result, categorias: categorias });

        })
    })
})

module.exports = router;