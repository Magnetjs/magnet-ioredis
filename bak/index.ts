import { Module } from 'magnet-core/module'
import * as Redis from 'ioredis'

import defaultConfig from './config/ioredis'

export default class Ioredis extends Module {
  async setup () {
    const config = this.prepareConfig('ioredis', defaultConfig)

    Redis.Promise.onPossiblyUnhandledRejection((err) => {
      this.log.error('ioredis onPossiblyUnhandledRejection')
      this.log.error(err)
    })

    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.ioredisFactory = function () {
      return new Redis(config)
    }
    this.app.ioredis = this.app.ioredisFactory()
    this.app.ioredis.on('error', (err) => {
      this.log.error(err)
    })
  }

  async teardown () {
    this.app.ioredis.quit()
  }
}
