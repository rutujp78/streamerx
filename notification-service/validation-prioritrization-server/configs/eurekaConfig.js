const Eureka = require('eureka-js-client').Eureka;

const eurekaClient = new Eureka({
    instance: {
        app: 'notification-service',
        // instanceId: 'notification-service:127.0.0.1:5001',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 5001,
            '@enabled': true
        },
        vipAddress: 'notification-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
    },
    eureka: {
        host: '127.0.0.1',
        port: 8761,
        servicePath: '/eureka/apps/',
        maxRetries: 3,
        requestRetryDelay: 5000,
        heartbeatInterval: 30000,
        registryFetchInterval: 5000,
    },
    logging: {
        level: 'debug'
    }
});

module.exports = { eurekaClient };