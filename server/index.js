import 'dotenv/config'
import Fastify from 'fastify'
import firstRoute from './routes/firstRoute.js'
import cors from 'cors'
import middie from '@fastify/middie'
import fastifyRowBody from 'fastify-raw-body'

const fastify = Fastify({
  logger: true
})

await fastify.register(fastifyRowBody, {
  field: 'rawBody'
})

await fastify.register(middie)

fastify.use(cors())

fastify.register(firstRoute)

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3003 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
