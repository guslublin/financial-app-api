const { Router } = require('express');

const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');

const { json } = require('express/lib/response');

router.get('/', (req, res) => res.send('Hello World'));

router.post('/signUp', async(req, res) => {

    const { email, password } = req.body;
    const newUser = new User({email, password});
    
    await newUser.save();
    
    const token = jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});

});

router.post('/signIn', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user) return res.status(401).send('El correo no existe');
    if(user.password != password) return res.status(401).send('Wrong Password');

    const token = jwt.sign({_id: user._id}, 'secretkey');
    return res.status(200).json({token});
});

router.get('/tasks', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task One',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        },
        {
            _id: 2,
            name: 'Task Two',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        },
        {
            _id: 3,
            name: 'Task Three',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        }
    ]);
});


router.get('/private-tasks', verifyToken, (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task One',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        },
        {
            _id: 2,
            name: 'Task Two',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        },
        {
            _id: 3,
            name: 'Task Three',
            description: 'Lorem ipsum',
            date: '2022-09-06T02:47:00.476Z'
        }
    ]);
});

router.get('/profile', verifyToken, (req, res)=>{
    res.send(req.userId);
});


module.exports = router;

function verifyToken(req, res, next){
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized Request');
    } 
    const token = req.headers.authorization.split(' ')[1];
    if (token == null){
        return res.status(401).send('Unauthorized Request');
    }
    const payload = jwt.verify(token, 'secretkey');
    // console.log(payload);
    req.userId = payload._id;
    next();
}