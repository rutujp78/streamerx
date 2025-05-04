const Eureka = require('eureka-js-client').Eureka;

const eurekaClient = new Eureka({
    instance: {
        app: 'user-service',
        // instanceId: 'user-service:127.0.0.1:8000',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 8000,
            '@enabled': true
        },
        vipAddress: 'user-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn'
        },
    },
    eureka: {
        host: '127.0.0.1',
        port: 8761,
        servicePath: '/eureka/apps/',  // Ensure this is the correct path
        maxRetries: 3,
        requestRetryDelay: 5000,
        heartbeatInterval: 30000,
        registryFetchInterval: 5000,
    },
    logging: {
        level: 'debug'  // Set logging level to 'debug'
    }
});

module.exports = { eurekaClient };