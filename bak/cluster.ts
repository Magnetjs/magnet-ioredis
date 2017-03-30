import { Module } from 'magnet-core/module'
import Redis, { Cluster } from 'ioredis'

import defaultConfig from './config/ioredis'

// WIP
export default class Ioredis extends Module {
  async setup () {
    this.log.warn('WIP: use at your own risk')

    const config = this.prepareConfig('ioredis', defaultConfig)

    Redis.Promise.onPossiblyUnhandledRejection((err) => {
      this.log.error(err)
    })

    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.ioredisClusterFactory = function () {
      return new Cluster(config.cluster, config)
    }
    this.app.ioredisCluster = this.app.ioredisClusterFactory()
    this.app.ioredisCluster.on('error', (err) => {
      this.log.error(err)
    })
  }

  async teardown () {
    this.app.ioredisCluster.quit()
  }
}
