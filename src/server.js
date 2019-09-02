const prodConfig = {
    // TODO: dev vs prod config

    SELF: {
        host: "workstation.community-boating.org",
        https: true,
        pathPrefix: "/api",
        port: 443
    },
    API: {
        host: "localhost",
        https: false,
        port: 3000
    }
}

const devConfig = {
	...prodConfig,
	SELF: {
		...prodConfig.SELF,
        host: "workstation-dev.community-boating.org",
		https: false,
		port: 8081
	}
}

console.log("node_env is " + process.env.NODE_ENV)

module.exports = (process.env.NODE_ENV == 'development' ? devConfig : prodConfig)