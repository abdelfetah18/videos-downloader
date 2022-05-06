let cheerio = require('cheerio');
let request = require('request');
import fetch from 'node-fetch';


//extract JSON from string
function extractJSON(str) {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
        firstClose = str.lastIndexOf('}');
        //console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
        if(firstClose <= firstOpen) {
            return null;
        }
        do {
            candidate = str.substring(firstOpen, firstClose + 1);
            //console.log('candidate: ' + candidate);
            try {
                var res = JSON.parse(candidate);
                //console.log('...found');
                return res;
            }
            catch(e) {
                //console.log('...failed');
            }
            firstClose = str.substr(0, firstClose).lastIndexOf('}');
        } while(firstClose > firstOpen);
        firstOpen = str.indexOf('{', firstOpen + 1);
    } while(firstOpen != -1);
}



module.exports = async (video_url) => {
    var video_link = "";
    //get video id
    var type_ = video_url.match(/(?<=https:\/\/[\w]+\.[\w]+\.[\w]+\/)([\w]+)(?=\/)/g);
    if(type_ == null){
        return {};
    }
    var [type] = type_;
    var id_ = video_url.match(/(?<=https:\/\/[\w]+\.[\w]+\.[\w]+\/[\w]+\/)([\w]+)(?=\/)/g);
    if(id_ == null){
        return {};
    }
    var [id] = id_;
    var link = "https://www.instagram.com/"+type+"/"+id+"/embed/";
    var response = await fetch(link);
    var html = await response.text();
    var test = html.match('<script type="text/javascript">window.__additionalDataLoaded');
    var i = test.index;
    var data = "";
    while(html.slice(i,i+9) != "</script>"){
        data += html[i];
        i++;
    }
    var result = extractJSON(data);
    if(result != null){
        if(result.shortcode_media.is_video){
            return { data:{ video_link:result.shortcode_media.video_url }, newLink:link , is_video:true }
        }
    }else{
        return {}
    }
    
    /*if(test != null){
        var counter = "video_url".length+3;
        while(html[test.index+counter] != '"'){
            video_link += html[test.index+counter];
            counter++;
        }
        return { video_link,newLink:link }
    }else{
        var ImagesLinks = [];
        var test = html.match("display_url");
        for(var item of html.matchAll("display_url")){
            var imgUrl = ""
            var counter = "display_url".length+3;
            while(html[item.index+counter] != '"'){
                imgUrl += html[item.index+counter];
                counter++;
            }
            ImagesLinks.push(imgUrl);
        }
        if(test != null){
            var counter = "display_url".length+3;
            while(html[test.index+counter] != '"'){
                video_link += html[test.index+counter];
                counter++;
            }

            return { video_link,newLink:link,ImagesLinks }
        }
    }*/
    return { }
    
};
