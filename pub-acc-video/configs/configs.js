module.exports = {
    connectConfig : { //数据库连接池的配置
        host: '42.51.29.9',
        user: 'movie',
        password: 'admin',
        database: 'movie'
    },
    movieTypes : [ //电影类型
        { '1': 'action' },
        { '2': 'comedy' },
        { '3': 'romance' },
        { '4': 'science' },
        { '5': 'drama' },
        { '6': 'suspense' },
        { '7': 'war' },
        { '8': 'thrill' },
        { '9': 'horror' },
        { '10': 'disaster' },
        { '11': 'cartoon' }
    ],
    token: 'c83JFMO302FEHU3UDHS41524MD02sw2q',
    APPID: 'wx00de4458ab110d05',
    APPSECRET: 'e163f18641294dab11037b3acbb55101',
    urls: {
        getAccessToken: 'https://api.weixin.qq.com/cgi-bin/token',
        upLoadTemporyMaterial: 'https://api.weixin.qq.com/cgi-bin/media/upload',
        upLoadPermantMaterial: 'https://api.weixin.qq.com/cgi-bin/material/add_material', // 上传永久素材
        createMenu: ' https://api.weixin.qq.com/cgi-bin/menu/create'
    },
    // menus: {
    //     'button': [
    //         {
    //             name: '万寻影视',
    //             type: 'view',
    //             url: 'https://www.wanxunm.com'
    //         },
    //         {
    //             name: '快速搜电影',
    //             type: 'click',
    //             key: 'search_movie'
    //         }
    //     ]
    // },
}