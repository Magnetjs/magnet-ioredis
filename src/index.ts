import { Module } from 'magnet-core/module'
import * as Redis from 'ioredis'

export default class MagnetIoredis extends Module {
  init () {
    this.moduleName = 'ioredis'
    this.defaultConfig = __dirname
  }

  async setup () {
    // Redis.Promise.onPossiblyUnhandledRejection((err) => {
    //   this.log.error(err)
    // })

    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.ioredisFactory = () => new Redis(this.config)
    this.app.ioredis = this.app.ioredisFactory()
    this.app.ioredis.on('error', (err) => {
      this.log.error(err)
    })
  }

  async teardown () {
    this.app.ioredis.quit()
  }
}
