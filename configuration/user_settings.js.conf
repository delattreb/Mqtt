{
    "workbench.colorTheme": "Monokai",
    "workbench.statusBar.feedback.visible": false,
    "[cpp]": {},
    "editor.largeFileOptimizations": false,
    "github.autoPublish": true,
    "window.zoomLevel": 0,
    "git.autofetch": true,
    "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
    "editor.minimap.enabled": true,
    "editor.renderWhitespace": "none",
    "editor.multiCursorModifier": "ctrlCmd",
    "files.autoSave": "off",
    "workbench.iconTheme": "material-icon-theme",
    "deploy": {
        "openOutputOnDeploy": false,
        "packages": [
            {
                "name": "RaspberryPITemp",
                "deployOnChange": {
                    "files": [
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js",
                        "/**/*.json",
                        "/**/*.sh",
                        "/**/*.php"
                    ],
                    "exclude": [
                        "/**/*.less",
                        "/**/*.ts",
                        "/node_modules",
                        "/.vscode"
                    ],
                    "useTargetList": true,
                    "deployOnSave" : true
                },
                "targets": [
                    "RaspberryPITemp"
                ]
            }
        ],
        "targets": [
            {
                "name": "RaspberryPITemp",
                "type": "sftp",
                "description": "A SFTP folder",
                "dir": "/",
                "host": "",
                "port": XXX,
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
    },
    "git.enableSmartCommit": true
}