import { useState,useEffect } from "react";
import { BiLike } from "react-icons/bi";
import { AiFillEye } from "react-icons/ai";

var youtube = require("../../utils/youtube");

export async function getServerSideProps({ query }){
    var { link } = query;
    var { videoData } = await youtube(link);
    if(videoData != undefined){
        return {
            props:{
                videoData
            }
        }
    }else{
        return {
            redirect: {
                permanent: false,
                destination: "/",
            }
        }
    }
    
}

export default function Youtube({ videoData }){
    var [selectedVideo,setSelectedVideo] = useState(videoData.formats.find((item)=>{ if(item.mimeType.match("video") != null) return item }).url);
    var [selectedAudio,setSelectedAudio] = useState(videoData.formats.find((item)=>{ if(item.mimeType.match("audio") != null) return item }).url);
    return ( 
    <div className="flex flex-col items-center justify-center bg-[#f0f2f5] w-screen h-screen">
        <div>
            <iframe src={videoData.videoDetails.embed.iframeUrl} width="600" height="400" />
            <div>

            </div>
            <div>
                <div className="flex flex-row flex-wrap items-center m-2">
                    <img src={videoData.videoDetails.author.thumbnails[2].url} className="w-14 rounded-full shadow-2xl" />
                    <div>
                        <div className="font-bold text-[1em] ml-2">{videoData.videoDetails.author.name}</div>
                        <div className="font-semibold text-[0.75em] ml-4">{parseInt(videoData.videoDetails.author.subscriber_count).toLocaleString()} Subscribers</div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap justify-end">
                    <div className="flex flex-row flex-wrap font-semibold">{parseInt(videoData.videoDetails.likes).toLocaleString()} <BiLike className="mx-1 inline-block h-full" /></div>
                    <div className="flex flex-row flex-wrap font-semibold">| {parseInt(videoData.videoDetails.viewCount).toLocaleString()} <AiFillEye className="mx-1 inline-block h-full" /></div>
                    <div className="flex flex-row flex-wrap font-semibold">| {videoData.videoDetails.uploadDate}</div>
                </div>
            </div>
        </div>
        <div className="flex flex-row flex-wrap items-center">
            <div className="flex flex-col items-center shadow-2xl m-5">
                <div className="px-4 py-2 bg-gray-900 w-full text-white text-center font-semibold rounded">Video</div>
                <select className="px-4 py-2 rounded w-full" onChange={(e) => { setSelectedVideo(e.target.selectedOptions[0].getAttribute("video_url")) } }>
                    <option>Default</option>
                { videoData.formats.map((item,index)=>{
                    return ((item.mimeType.match("video") != null) ?
                    (<option key={ index } className="py-2 px-4 text-center rounded" video_url={item.url} >
                        { (item.qualityLabel != undefined) ? "videoQuality: "+item.qualityLabel : "audioBitrate: "+item.audioBitrate+"Kps" } { item.mimeType.split(";")[0] }
                    </option>) : ("")
                    )
                }) }
                </select>
                <a className="px-4 py-2 bg-red-500 m-5 rounded text-center font-bold text-white cursor-pointer" href={selectedVideo} download target="_blank">Download</a>
            </div>
            <div className="flex flex-col items-center shadow-2xl m-5">
                <div className="px-4 py-2 bg-gray-900 w-full text-white text-center font-semibold rounded">Audio</div>
                <select className="px-4 py-2 rounded w-full" onChange={(e) => { setSelectedAudio(e.target.selectedOptions[0].getAttribute("video_url")) } }>
                    <option>Default</option>
                { videoData.formats.map((item,index)=>{
                    return ((item.mimeType.match("audio") != null) ? 
                    (<option key={ index } className="py-2 px-4 text-center rounded" video_url={item.url} >
                        { (item.qualityLabel != undefined ) ? "videoQuality: "+item.qualityLabel : "audioBitrate: "+item.audioBitrate+"Kps" } { item.mimeType.split(";")[0] }
                    </option>) : ("")
                    )
                }) }
                </select>
                <a className="px-4 py-2 bg-red-500 m-5 rounded text-center font-bold text-white cursor-pointer" href={selectedAudio} download target="_blank">Download</a>
            </div>
        </div>
    </div>
    
    )
}