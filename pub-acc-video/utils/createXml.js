
const ejs = require('ejs');
const heredoc = require('heredoc');

const tpl = heredoc(function (json){/*
    <xml>
        <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
        <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
        <CreateTime><%= createTime %></CreateTime>
        <MsgType><![CDATA[<%= msgType %>]]></MsgType>
        <% if(msgType === 'text') {%>
            <Content><![CDATA[<%- content %>]]></Content>
        <% } else if(msgType === 'image') {%>
            <Image>
                <MediaId><![CDATA[<%= mediaId %>]]></MediaId>
            </Image>
        <% } else if(msgType === 'music') {%>
            <Music>
                <Title><![CDATA[<%= title %>]]></Title>
                <Description><![CDATA[<%= descript %>]]></Description>
                <MusicUrl><![CDATA[<%= musicUrl %>]]></MusicUrl>
                <HQMusicUrl><![CDATA[<%=hQMusicUrl %>]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[<%= thumbMediaId %>]]></ThumbMediaId>
            </Music>
        <% } else if(msgType === 'video') { %>
            <Video>
                <MediaId><![CDATA[<%= mediaId %>]]></MediaId>
                <Title><![CDATA[<%= title %>]]></Title>
                <Description><![CDATA[<%= description %>]]></Description>
            </Video>
        <% } else if(msgType === 'voice') { %>
             <Voice>
                <MediaId><![CDATA[<%= mediaId %>]]></MediaId>
            </Voice>
        <% } else if(msgType === 'news') {%>
            <ArticleCount><%= articleCount %></ArticleCount>
            <Articles>
                <item>
                <Title><![CDATA[<%= title %>]]></Title>
                <Description><![CDATA[<%= description %>]]></Description>
                <PicUrl><![CDATA[<%= picUrl %>]]></PicUrl>
                <Url><![CDATA[<%= url %>]]></Url>
                </item>
            </Articles>
        <% } %>
    </xml>
*/});

const compiled = ejs.compile(tpl);

exports = module.exports = compiled;