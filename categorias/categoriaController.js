const express = require('express');
const router = express.Router();
const Categoria = require("./Categoria");
const slugify = require("slugify");


router.get("/admin/categoria/new", (req, res) => {

    res.render("admin/categorias/new");

});

router.post('/categoria/save', (req, res) => {

    let titulo = req.body.titulo;

    if (titulo != undefined) {

        Categoria.create({

            titulo: titulo,
            slug: slugify(titulo),

        }).then(() => {

            res.redirect('/admin/categorias');
        })

    } else {

        res.redirect('/admin/categoria/new');
    }
});


router.get('/admin/categorias', (req, res) => {

    Categoria.findAll().then(categorias => {

        res.render('admin/categorias/index', { categorias: categorias });

    });


});

router.post("/categoria/delete", (req, res) => {

    let id = req.body.id;
    if (id != undefined) {

        if (!isNaN(id)) {

            Categoria.destroy({
                where: {

                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categorias")

            })

        } else {

            res.redirect("/admin/categorias")
        }

    } else {

        res.redirect("/admin/categorias")

    }
})

router.get('/admin/categoria/edite/:id', (req, res) => {

    let id = req.params.id;

    if (isNaN(id)) {

        res.redirect('/admin/categorias');
    }

    Categoria.findByPk(id).then(categoria => {

        if (categoria != undefined) {

            res.render("admin/categorias/edite", { categoria: categoria });

        } else {

            res.redirect('/admin/categorias');
        }
    }).catch(err => {

        res.redirect('/admin/categorias');

    })

});

router.post("/categoria/update", (req, res) => {

    let id = req.body.id;
    let titulo = req.body.titulo;

    Categoria.update({ titulo: titulo, slug: slugify(titulo) }, {
        where: { id: id }
    }).then(() => {

        res.redirect('/admin/categorias');

    })
})

module.exports = router;