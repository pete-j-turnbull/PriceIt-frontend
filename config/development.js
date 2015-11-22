module.exports = {
    logger: {
        enabled: ['debug', 'info', 'warn', 'error']
    },
    port: 8880,
    zerorpc: {
        bind: 'tcp://0.0.0.0:4242',
        connect: 'tcp://127.0.0.1:4242'
    }
};