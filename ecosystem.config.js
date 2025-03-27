module.exports = {
    apps: [{
        name: "virtual-lawyer",
        script: "server-combined.js",
        instances: "max",
        exec_mode: "cluster",
        autorestart: true,
        watch: false,
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "production",
            PORT: 5001
        }
    }]
};