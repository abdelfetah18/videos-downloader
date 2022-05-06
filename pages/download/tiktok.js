import { useState,useEffect } from "react";
import { FaPlay,FaPause,FaHeart,FaCommentDots } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { RiShareForwardFill } from "react-icons/ri";

var tiktok = require("../../utils/tiktok");

export async function getServerSideProps({ query }){
    var { link } = query;
    var videoData = await tiktok(link);
    if(videoData.videoMeta != undefined){
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

export default function Tiktok({ videoData }){
    var [startPos,setStartPos] = useState(0);
    var [saveWidth,setSaveWidth] = useState(0);

    function updatePlayTime(e){
        document.getElementById("progress").style.width = ((((e.target.currentTime * 100)/e.target.duration)*350)/100).toString()+"px";
        document.getElementById("progressPointer").style.left = ((((e.target.currentTime * 100)/e.target.duration)*350)/100).toString()+"px";
    }

    function playPause(e){
        var video = document.querySelector("video");
        if (video.paused || video.ended){
            video.play();
            document.getElementById("playButton").classList.replace("block","hidden");
            document.getElementById("pauseButton").classList.replace("hidden","block");
        }else{
            video.pause();
            document.getElementById("playButton").classList.replace("hidden","block");
            document.getElementById("pauseButton").classList.replace("block","hidden");
        }
    }

    function DragEvt(e){
        var { clientX } = e;
        var video = document.querySelector("video");
        video.currentTime = ((saveWidth+clientX-startPos)*video.duration/(350));
    }

    return (
    <div className={"flex flex-col items-center w-full p-5 flex-wrap bg-[#f0f2f5]"}>
        <div className="flex flex-row items-center">
            <div>
                <video className="rounded-xl shadow-[0px_0px_10px]" poster={videoData.videoMeta.collector[0].covers.origin} width="400" onTimeUpdate={updatePlayTime} autoPlay playsInline src={videoData.videoMeta.collector[0].videoUrl}>
                </video>
                <FaPlay id="playButton" color="white" className="block relative top-[-45px] left-[10px] cursor-pointer " onClick={playPause} />
                <FaPause id="pauseButton" color="white" className="hidden relative top-[-45px] left-[10px] cursor-pointer " onClick={playPause} />
                <div className="cursor-pointer rounded w-[380px] h-[2px] bg-gray-500 relative top-[-35px]  left-[10px]">
                    <div id="progress" className={"cursor-pointer rounded h-[2px] bg-white relative"}></div>
                    <div id="progressPointer" className={"relative top-[-5px] h-[10px] w-[10px] bg-white rounded-xl"} onDrag={({clientX}) => { document.getElementById("progressPointer").style.left = (saveWidth+clientX-startPos).toString()+"px"; document.getElementById("progress").style.width = (saveWidth+clientX-startPos).toString()+"px"; }} onDragStart={({clientX}) =>{ setStartPos(clientX); setSaveWidth(parseInt(document.getElementById("progress").style.width)); }} onDragEnd={DragEvt}></div>
                </div>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center m-2">
                    <AiFillHeart size={32} className="inline-block w-full" />
                    <div className="text-[0.875em] font-semibold">{videoData.videoMeta.collector[0].diggCount}</div>
                </div>
                <div className="flex flex-col items-center m-2">
                    <FaCommentDots size={28} className="inline-block w-full" />
                    <div className="text-[0.875em] font-semibold">{videoData.videoMeta.collector[0].commentCount}</div>
                </div>
                <div className="flex flex-col items-center m-2">
                    <RiShareForwardFill size={28} className="inline-block w-full" />
                    <div className="text-[0.875em] font-semibold">{videoData.videoMeta.collector[0].shareCount}</div>
                </div>
            </div>
        </div>
        
        <a className="hover:shadow-[0px_0px_10px] m-5 cursor-pointer shadow-xl bg-red-500 rounded px-4 py-2 w-fit text-white font-bold" href={videoData.videoMeta.collector[0].videoUrl} >Download</a>
    </div>
    )
}
