const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs')


router.get("/admin/users", (req, res) => {

    User.findAll().then(usuarios=>{

        res.render('admin/users/index',{usuarios:usuarios})
    })

})

router.get("/admin/users/create", (req, res) => {

    res.render("admin/users/create");
})

router.post('/user/create', (req, res) => {

    let email = req.body.email
    let password = req.body.password

    User.findOne({

        where:{

            email:email
        }
    }).then(user=>{

        if(user == undefined){

            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password,salt)
        
            User.create({
        
                email: email,
                senha: hash
        
            }).then(()=>{
        
                res.redirect('/admin/users');
        
            }).catch(err=>{
        
                res.redirect('/admin/users');
                
            })

        }else{

            res.redirect('/admin/users/create')
        }
    })

    
})

module.exports = router;