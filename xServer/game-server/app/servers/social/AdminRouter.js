"use strict";
/**
 * Created by bayilaoye on 15-6-9.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('pomelo-logger').getLogger('pomelo');

router.use(cookieParser('erase fox'));
router.use(session({ secret: 'erase fox', resave: false, saveUninitialized: true }));

var urlRoot = "";

router.all('*', function(req, res, next) {
    urlRoot = req.headers.url_root || "";
    next();
    //if (req.headers['x-forwarded-proto'] != 'https') {
    //    var host = req.headers.host;
    //    if (host.indexOf(':') > 0) {
    //        host = host.slice(0, host.indexOf(':'));
    //    }
    //    res.redirect('https://' + host + req.headers.original_url);
    //} else {
    //    next();
    //}
});

router.get('/login', function(req, res) {
    res.render('admin/login');
});

router.get('/welcome', function(req, res) {
    return res.render("admin/mytable", {error : "Welcome!"});
});

router.post('/login', function(req, res, next) {
    logger.info("In admin/login, user: %s, password:%s", req.body.username, req.body.password);

    // 这两行是临时代码
    req.session.user = req.body.username;
    res.redirect(urlRoot + '/admin/');
    /*
    if (req.body.username && req.body.password) {
        var adminUserDao = AdminUserDao.getDao();
        adminUserDao.getPasswordForUser(req.body.username).then(function(pwd) {
            if (!pwd) {
                logger.error("can not find pwd for admin user " + req.body.username);
                return next("InvalidUser");
            }
            if (pwd !== req.body.password) {
                logger.error("admin user " + req.body.username + " password wrong");
                return next("WrongPassword");
            }
            req.session.user = req.body.username;
            res.redirect(urlRoot + '/admin/');
        });
    } else {
        res.redirect(urlRoot + '/admin/login');
    }
    */
});

var checkAuth = function(req, res, next) {
    logger.info("In checkAuth %s query %s", req.path, JSON.stringify(req.query));
    if (req.session.user) {
        next();
    } else {
        res.redirect(urlRoot + '/admin/login');
    }
};

router.all('*', checkAuth);

router.post('/logout', function(req, res) {
    delete req.session.user;
    res.redirect(urlRoot + '/admin/login');
});

router.get('/', function(req, res) {
    var params = { text: "Slots admin"};
    res.render('admin/index', params);
});

module.exports = router;
