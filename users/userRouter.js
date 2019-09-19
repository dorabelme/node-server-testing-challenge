const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, (req, res) => {
    console.log('here');
    Users.find()
        .then(users => {
            res.json({ users, loggedInUser: req.user.username });
        })
        .catch(err => {
            console.log(err);
            res.send(err)
        });
});

// DELETE request for users
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id)
        .then(deleted => {
            console.log(deleted);
            if (deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: "User with ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error deleting user." });
        });
});

module.exports = router;
