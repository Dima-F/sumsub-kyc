import { main } from '../appToken.js'
import config from '../config.js'
import crypto from 'crypto'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  fastify.get('/access-token', async (request, reply) => {
    const tokenData = await main({ externalUserId: request.query?.externalUserId })
    return tokenData
  })

  fastify.post('/webhook', async (request, reply) => {
    const algo = {
      'HMAC_SHA1_HEX': 'sha1',
      'HMAC_SHA256_HEX': 'sha256',
      'HMAC_SHA512_HEX': 'sha512',
    }[request.headers['x-payload-digest-alg']]
    
    if (!algo) {
      throw new Error('Unsupported algorithm')
    }
    
    const calculatedDigest = crypto
      .createHmac(algo, config.sumsubWebhookSecret)
      .update(request.rawBody)
      .digest('hex')
    
    if(calculatedDigest !== request.headers['x-payload-digest']) {
      throw new Error('Bad payload digest')
    }
    // do something with request.body
    console.log(request.body)
    return 'OK'
  })
}

export default routes