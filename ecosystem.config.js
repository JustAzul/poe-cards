module.exports = {
    apps : [{
      name: "poe.cards NextJS",
      script: 'server.js',
      watch: true,
      env: {
        "NODE_ENV": "production",
        "PORT": 2469
      },
      error_file: "error.log",
      out_file: "log.log"
    }]
  };
  