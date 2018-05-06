"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("magnet-core/module");
const ioredis_1 = require("ioredis");
// WIP
class MagnetIoredisCluster extends module_1.Module {
    init() {
        this.moduleName = 'ioredis';
        this.defaultConfig = __dirname;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.warn('WIP: use at your own risk');
            ioredis_1.default.Promise.onPossiblyUnhandledRejection((err) => {
                this.log.error(err);
            });
            // Any cleaner way? Adding this because of
            // https://github.com/Automattic/kue#using-ioredis-client-with-cluster-support
            this.app.ioredisClusterFactory = () => {
                return new ioredis_1.Cluster(this.config.cluster, this.config);
            };
            this.app.ioredisCluster = this.app.ioredisClusterFactory();
            this.app.ioredisCluster.on('error', (err) => {
                this.log.error(err);
            });
        });
    }
    teardown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.ioredisCluster.quit();
        });
    }
}
exports.default = MagnetIoredisCluster;
//# sourceMappingURL=cluster.js.map