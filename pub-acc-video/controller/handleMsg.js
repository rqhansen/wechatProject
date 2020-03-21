'use strict';
const getRawBody = require('raw-body');
const tpl = require('../utils/createXml');
const { parseXML,formatMsg} = require('../utils/handleXml');
const { upLoadPermanMaterial } = require('../utils/upLoadMaterial');
const searchMovie = require('../utils/searchMovie');
const handleMsg = async (ctx) => {  
    let xml = await getRawBody(ctx.req,{
        length: ctx.request.length,
        limit: '1mb',
        encoding: ctx.request.charset || 'utf-8'
    });
    let result = await parseXML(xml);
    let { ToUserName,FromUserName,MsgType,Content,Label,Event,Recognition} = await formatMsg(result.xml);
    let reply = {
        toUserName: FromUserName,
        fromUserName: ToUserName,
        createTime: Date.now()
    };
    ctx.status = 200;
    ctx.type = 'application/xml';
    if(MsgType === 'text') {
        if(Content[Content.length - 1] === 'm' && Content.length >1) {
            const keyword = Content.slice(0,Content.length - 1);
            const textMovies = await searchMovie(keyword);
            if(!textMovies.length) {
                reply = Object.assign({},reply,{
                    msgType: 'text',
                    content: '暂无数据'
                })
                ctx.body = tpl(reply);
            } else {
                let mXmls = '';
                textMovies.forEach(m =>{
                    let singleReply = Object.assign({},reply,{
                        msgType: 'news',
                        articleCount: 1,
                        title: `${m.pureName}`,
                        description: `${m.shortIntro}`,
                        picUrl: `https://www.wanxunm.com/common/${m.indexImgSrc}`,
                        url: `https://www.wanxunm.com/${m.type}/${m.id}`
                    });
                    mXmls += tpl(singleReply);
                })
                ctx.body = mXmls;
            }
        } else if(Content === '音乐') {
            // const musicReply = await upLoadTempMaterial('thumb','public/mp/chx.jpg');
            // const musicReply = await upLoadPermanMaterial('thumb','public/mp/chx.jpg');
            const musicReply = {
                media_id: '5LVqPvRPtA_-LXTvblPHB_oEHdJECwyrniP1lDo62GU',
                url: 'http://mmbiz.qpic.cn/mmbiz_jpg/Ua6zVtrQ2NVvKITx4S8fmFUwsVXicIPysRtbaxXC298ywpp12jicrq3P2G0uWmgy1tek5u3oKSDuP0SpvRoQAdkA/0?wx_fmt=jpeg',
                item: []
              }
            reply = !musicReply ? ''
                    : Object.assign({},reply,{
                        msgType: 'music',
                        title: '千千阙歌',
                        descript: '永远是你的朋友',
                        musicUrl: 'https://m3ws.kugou.com/kgsong/ryczpf2.html',
                        hQMusicUrl: 'https://m3ws.kugou.com/kgsong/ryczpf2.html',
                        thumbMediaId: musicReply.media_id
                    });
             ctx.body = tpl(reply);
        } 
        // else if(Content === '视频') {
        //     const videoReply = await upLoadPermanMaterial('video','public/mp/video.mp4');
        //     console.log(videoReply);
        //     reply = !videoReply ? ''
        //              :  Object.assign({},reply,{
        //                 msgType: 'video',
        //                 mediaId: videoReply.media_id,
        //                 title: 'Html5',
        //                 description: '演示html5的video标签播放视频'
        //             });
        //     ctx.body = tpl(reply);
        // } 
        else if(Content === '图片') {
            // const imageReply = await upLoadPermanMaterial('image','public/mp/cat.jpg');
            const imageReply = { // 永久素材数据
                media_id: '5LVqPvRPtA_-LXTvblPHB8pJuYplwf4ujbk8YU8j9y4',
                url: 'http://mmbiz.qpic.cn/mmbiz_jpg/Ua6zVtrQ2NVvKITx4S8fmFUwsVXicIPysrqZtwdPeY8lKDIuUIEqglobcu5H0VQiaK3U4pkHGd9tIqwnloplNhOw/0?wx_fmt=jpeg'
            };
            reply = !imageReply ? ''
                    : Object.assign({} ,reply,{
                        msgType: 'image',
                        mediaId: imageReply.media_id
                    })
                    ctx.body = tpl(reply);
        } else if (Content === '语音') {
            // const voiceReply = await upLoadTempMaterial('voice','public/mp/hard to say I am sory.mp3');
            // const voiceReply = await upLoadPermanMaterial('voice','public/mp/hard to say I am sory.mp3')
            const voiceReply = {
                media_id: '5LVqPvRPtA_-LXTvblPHBy198KWlQtGB8Pt_Fn-v3xY'
            };
            reply = !voiceReply ? ''
                    : Object.assign({},reply,{
                        msgType: 'voice',
                        mediaId: voiceReply.media_id
                    });
             ctx.body = tpl(reply);
        } else if(Content === '位置') {
            reply = Object.assign({},reply,{
                msgType: 'text',
                content: '我不能告诉你我的位置'
            });
            ctx.body = tpl(reply);
        } else if(Content === '【收到不支持的消息类型，暂无法显示】') {
            reply = Object.assign({},reply,{
                msgType: 'text',
                content: '童鞋，你发的什么东东啊'
            });
            ctx.body = tpl(reply);
        } else if(Content === '图文') {
            reply = Object.assign({},reply,{
                msgType: 'news',
                articleCount: 1,
                title: '万寻电影',
                description: '万寻电影网－最新电影,迅雷电影下载-每天搜集最新迅雷免费电影下载。为使用迅雷软件的用户提供最新的免费电影下载、小电影下载、高清电影下载等服务。',
                picUrl: 'https://www.wanxunm.com/common/icons/favicon-32x32.png',
                url: 'https://www.wanxunm.com/'
            });
            ctx.body = tpl(reply);
        } else {
            reply = Object.assign({},reply,{
                msgType: 'text',
                content: `接收到了你的消息:${Content}`
            });
            ctx.body = tpl(reply);
        }
    } else if(MsgType === 'image') { 
        reply = Object.assign({},reply,{
            msgType: 'text',
            content: '图片不错哦'
        });
        ctx.body = tpl(reply);
    } else if(MsgType === 'voice') {
        const searchName = Recognition.replace(/[^\u4e00-\u9fa5]/g,'');
        if(!searchName) {
            reply = Object.assign({},reply,{
                msgType: 'text',
                content: '请录入中文电影名称'
            })
            ctx.body = tpl(reply);
        } else {
            const voiceMovies = await searchMovie(searchName);
            if(!voiceMovies.length) {
                reply = Object.assign({},reply,{
                    msgType: 'text',
                    content: '暂无数据'
                });
                ctx.body = tpl(reply);
            } else {
                let mXmls = '';
                voiceMovies.forEach(m =>{
                    let singleReply = Object.assign({},reply,{
                        msgType: 'news',
                        createTime: Date.now() + 1000,
                        articleCount: 1,
                        title: `${m.pureName}`,
                        description: `${m.shortIntro}`,
                        picUrl: `https://www.wanxunm.com/common/${m.indexImgSrc}`,
                        url: `https://www.wanxunm.com/${m.type}/${m.id}`
                    });
                    mXmls += tpl(singleReply);
                })
                ctx.body = mXmls;
            }
        }
    } else if(MsgType === 'video' || MsgType === 'shortvideo') {
        reply = Object.assign({},reply,{
            msgType: 'text',
            content: '拍的不错哦'
        });
        ctx.body = tpl(reply);
    } else if(MsgType === 'location') {
        reply = Object.assign({},reply,{
            msgType: 'text',
            content: `童鞋，原来你在${Label}`
        });
        ctx.body = tpl(reply);
    } else if(MsgType === 'link') { // 链接
        reply = Object.assign({},reply,{
            msgType: 'text',
            content: `童鞋,一会儿再看你的链接哈`
        });
        ctx.body = tpl(reply);
    } else if(MsgType === 'event') {
        if(Event === 'subscribe') {
            reply = Object.assign({},reply,{
                msgType: 'text',
                content: '欢迎关注万寻影讯!\n' + 
                         '回复图片获取图片\n' +
                         '回复语音获取语音\n' +
                         '回复音乐获取音乐\n' +
                         '回复图文获取图文\n' +
                         '发送位置获取位置\n' +
                         '语音回复电影名称搜索电影\n' + 
                         '回复电影名称+m搜索电影\n' +
                         '您也可以点击进入<a href="https://www.wanxunm.com">万寻电影</a>'
            });
            ctx.body = tpl(reply);
        } else if(Event === 'unsubscribe'){
            ctx.body = '';
        } else {
            ctx.body = '';
        }
    } else {
        ctx.body = '';
    }
}

module.exports = handleMsg;