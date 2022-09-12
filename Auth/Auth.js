const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = 'b46b3aa5b375c91f0a59c2fce60424aa1126a85d2ec34fb06693f06852efa7c79c6529'

exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 6) {
        return res.status('400').json({message: 'Password less than 6 characters'})
    }
    try {
        bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            username,
            password: hash,
        }).then(user => {
            const maxAge = 3 * 60 * 60
            const token = jwt.sign(
                {id: user,
                username,
                role: user.role},
                jwtSecret,
                {
                   expiresIn: maxAge 
                }
            )
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            })
            res.status(201).json({
                message: "User Successfully Created",
                user: user._id,
                role: user.role.at,
            })
        })    
        })
    } catch (err) {
        res.status('401').json({
            message: "User creation failed",
            error: error.message,
        })
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status('400').json({
            message: "Username or password field is empty"
        })
    }
    try {
        const user = await User.findOne({username})
    if (!user) {
        res.status('401').json({
            message: "Login Unsuccessful",
            error: "User not found",
        })
    } else {
        bcrypt.compare(password, user.password).then( (result) => {
            if (result) {
                const maxAge = 3 * 60 * 60
            const token = jwt.sign(
                {id: user,
                username,
                role: user.role},
                jwtSecret,
                {
                   expiresIn: maxAge 
                }
            )
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000
            })
            res.status(201).json({
                message: "User Successfully Logged In",
                user: user._id,
                role: user.role,
            })
            } else {
                res.status(400).json({
                    message: "Login failed"
                })
            }
        })    
    }
    } catch (error) {
        res.status('400').json({
            message: "An error occured. idkmybffjill",
            error: error.message,
        })
    }   
}

exports.update = async (req, res, next) => {
    const {role, id} = req.body
    if (role && id) {
        if (role === 'admin') {
            await User.findById(id)
                .then((user) => {
                    if (user.role !== 'admin') {
                        user.role = role
                        user.save((err) => {
                            if (err) {
                                res
                                .status('400')
                                .json({
                                    message: "An error has occured",
                                    error: err.message
                                })
                                process.exit(1)
                            }
                            res.status('201').json({
                                message: "Update Successful",
                                user
                            })
                        })
                    } else {
                        res.status('400').json({message: "User is already an Admin"})
                    }
                })
                .catch((error) => {
                    res.status('400').json({message: "An error has occured", error: error.message})
                })
        } else {
            res.status('400').json({
                message: "Role is not Admin",
            })
        }
    } else {
        res.status('400').json({
            message: "Role or ID is missing"
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user => {
            res.status(201).json({message: "User Deleted", user})
        })
        .catch(err => {
            res.status(400).json({message: "User does not exist"})
        })
}

exports.getUsers = async (req, res, next) => {
    await User.find({})
    .then(users => {
        const userFunction = users.map(user => {
            const container = {}
            container.username = user.username
            container.role = user.role
            container.id = user._id
            return container
        })
        res.status(200).json({user: userFunction})
    })
    .catch(err =>
        res.status(401).json({message: "not successful", error: err.message})
        )
}