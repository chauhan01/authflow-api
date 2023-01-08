const notFound = (req, res)=>{
    res.status(404).send('Rout doesnot exist')
}

module.exports = notFound