import { Module } from 'magnet-core/module'
import Redis, { Cluster } from 'ioredis'

import defaultConfig from './config/ioredis'

// WIP
export default class MagnetIoredisCluster extends Module {
  async setup () {
    this.log.warn('WIP: use at your own risk')

    Redis.Promise.onPossiblyUnhandledRejection((err) => {
      this.log.error(err)
    })

    // Any cleaner way? Adding this because of
    // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
    this.app.ioredisClusterFactory = () => {
      return new Cluster(this.config.cluster, this.config)
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
