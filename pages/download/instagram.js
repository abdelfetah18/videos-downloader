var instagram = require("../../utils/instagram");

export async function getServerSideProps({ query }){
    var { link } = query;
    var data = await instagram(link);
    console.log(data);
    if(!data.newLink){
        return {
            redirect: {
                permanent: false,
                destination: "/",
            }
        }
    }
    var { data,newLink,is_video } = data;
    
    return {
        props:{
            data,
            newLink,
            is_video
        }
    }
}

export default function Instagram({ data,newLink,is_video }){

    function replaceAll(text){
        var prev = text;
        var cur = text.replace("\\u0026","&");
        while(cur != prev){
            prev = cur;
            cur = cur.replace("\\u0026","&");
        }
        return cur;
    }

    return (
        <div className="flex flex-col items-center h-screen w-screen">
            <iframe height={"60%"} src={newLink} />
            {(!is_video) ? data.ImagesLinks.map((item,index)=>{
                return (<a id="download-btn" target="_blank" data-mediatype="Video" className="font-bold text-white px-4 py-2 mt-1 rounded-md border-b-4 border-blue-800 bg-blue-600 ring-1 ring-blue-500 hover:bg-blue-700" href={ replaceAll(item) } key={index} >Download {index}</a>)
            }) : "" }
            <a id="download-btn" target="_blank" data-mediatype="Video" className="font-bold text-white px-4 py-2 mt-1 rounded-md border-b-4 border-blue-800 bg-blue-600 ring-1 ring-blue-500 hover:bg-blue-700" href={ replaceAll(data.video_link) }>Download</a>
        </div>
    )
}