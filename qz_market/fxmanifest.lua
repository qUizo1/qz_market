fx_version 'cerulean'
game 'gta5'

author 'qUizo'
description 'Market Script for vRP2'
version '1.0.0'

client_scripts {
    'client.lua'
}

server_scripts {
    'server_vrp.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/script.js',
    'html/style.css',
    'html/assets/**',
    "cfg/cfg.lua",
    'html/fonts/**'
}

shared_script {
  "@vrp/lib/utils.lua"
}