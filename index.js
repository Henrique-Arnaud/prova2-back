const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ 'extended': false }))
app.use(bodyParser.json())
app.use(cors())

const uri = "mongodb+srv://henriqueassilva:ExX29UZcc4XZo58n@clusterprova2.xe5zytx.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const db = client.db('Prova1')

const getAllTodos = async () => {
  try {
    const response = db.collection('todos').find()
    return await response.toArray()
  } catch (e) {
    'Erro ao buscar os dados'
  }
}

app.get('/', async (req, res) => {
  const todos = await getAllTodos()
  res.send(todos)
})

app.post('/todo', async (req, res) => {
  try {
    const body = req.body
    const todos = db.collection('todos')
    await todos.insertOne(body)
    res.json(`Todo: ${body.name} inserido com sucesso!`)
  } catch (e) {
    res.status(400).send('Erro ao inserir os dados')
  }
})

app.put('/todo/', async (req, res) => {
  try {
    const { _id, ...rest } = req.body

    const todos = await db.collection('todos')
    await todos.updateOne({ _id: new ObjectId(_id) }, { $set: rest })
    console.log({ _id: new ObjectId(_id) }, { $set: rest })
    res.json("Todo atualizado com sucesso!")
  } catch (e) {
    res.status(400).send("Erro ao atualizar os dados")
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
