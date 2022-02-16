const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs')
const adminAlternative = require('../middwares/adminAlt')


router.get("/admin/users", (req, res) => {

    User.findAll().then(usuarios => {

        res.render('admin/users/index', { usuarios: usuarios })
    })

})

router.get("/admin/users/create", (req, res) => {

    res.render("admin/users/create");
})

router.post('/user/create', (req, res) => {

    let email = req.body.email
    let password = req.body.password

    User.findOne({

        where: {

            email: email
        }
    }).then(user => {

        if (user == undefined) {

            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({

                email: email,
                senha: hash

            }).then(() => {

                res.redirect('/admin/users');

            }).catch(err => {

                res.redirect('/admin/users');

            })

        } else {

            res.redirect('/admin/users/create')
        }
    })


})

router.get('/login', (req, res) => {

    res.render('admin/users/login')
})

router.post('/autenticacao', (req, res) => {


    let email = req.body.email;
    let senha = req.body.senha;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {


        if (user != undefined) {

            let correct = bcrypt.compareSync(senha, user.senha)

            if (correct) {

                req.session.user = {

                    id: user.id,
                    email: user.email
                }

                res.redirect('/admin/artigos')
            } else {

                res.redirect('/login')

            }

        } else {

            res.redirect('/login')
        }
    })

})

router.get('/logout', (req, res) => {

    req.session.user = undefined;

    res.redirect('/')
})
module.exports = router;