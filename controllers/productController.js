const Product = require('../models/product')

exports.showAllProducts = (req, res) => {
    try {
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
        let order = req.query.order ? req.query.order : 'asc'
        let limit = req.query.limit ? parseInt(req.query.limit) : 6

        Product.find()
            .populate('category', 'name')
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, data) => {
                if(err) {
                    return res.status(404).json({
                        error: "product not found"
                    })
                }
                    res.json({
                    data
                })
            })
    }
    catch {

    }
}

exports.relatedProduct = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 2

	Product.find({category: req.params.category, _id:{ $ne: req.params.id }})
	.limit(limit)
	.populate('category', 'name')
	.exec((err, products) => {
		if(err) {
			return res.status(404).json({
				error: "Product not found !"
			})
		}
		res.json({
			products
		})
	})
}
