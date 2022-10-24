const Product = require('../models/product')
const getAllProductsStatic = async (req,res)=>{
  const products = await Product.find({})
  res.status(200).json(products)
}

const getAllProducts = async (req,res)=>{
  const { featured, company, name, sort, fields, numericFilters } = req.query
  console.log('numericFilters', numericFilters)
  const queryObject={}
  if(featured){
    queryObject.featured = featured === 'true'
  }
  if(company){
    queryObject.company = company
  }
  if(name){
    queryObject.name = {$regex:name, $options:'i'}
  }

  let result = Product.find(queryObject)

  if(sort){
   const sortList=sort.split(',').join(' ')
    result = result.sort(sortList)
  } else{
    result = result.sort('createdAt')
  }
  if(fields){
    const fieldsList=fields.split(',').join(' ')
    result = result.select(fieldsList)
  }
  if(numericFilters){
    const operatorMap={
      '>' :'$gt',
      '>=':'$gte',
      '=' : 'eq',
      '<' : '$lt',
      '<=' : '$lte'
    }
    const regEx=/\b(<|>|>=|=|<=)\b/g
    const options=['price', 'rating']
     numericFilters
      .replace(regEx,(match)=>`-${operatorMap[match]}-`)
      .split(',')
      .forEach(item=>{
        console.log('item', item)
        const [field, operator, value] = item.split('-')
        if(options.includes(field)){
          queryObject[field]={
            [operator]:Number(value)
          }
        }
      })
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip=(page-1) * limit
  result = result.skip(skip).limit(limit)

  const products = await result
  res.status(200).json(products)
}

module.exports = {
  getAllProductsStatic,
  getAllProducts
}
