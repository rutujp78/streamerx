import { Eureka } from "eureka-js-client";

const eurekaClient = new Eureka({
    instance: {
        app: 'stream-service',
        // instanceId: 'stream-service:127.0.0.1:5000',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 5000,
            '@enabled': true
        },
        vipAddress: 'stream-service',
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

export default eurekaClient;