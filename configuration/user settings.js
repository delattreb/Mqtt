"deploy": {
    "packages": [
        {
            "name": "My target",
            "deployOnChange": {
                "files": [
                    "/**/*.css",
                    "/**/*.js"
                ],
                "exclude": [
                    "/**/*.less",
                    "/**/*.ts"
                ],
                "useTargetList": true
            },
            "targets": [
                "My target"
            ]
        }
    ],
    "targets": [
        {
            "name": "My target",
            "type": "sftp",
            "description": "A SFTP folder",
            "dir": "/",
            "host": "",
            "port": 8022,
            "user": "",
            "password": "",
            "checkBeforeDeploy": true,
            "mappings": [
                {
                    "source": "/",
                    "target": "/home/dietpi/mqtt"
                }
            ]
        },
    ]
}