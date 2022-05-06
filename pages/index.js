import { useState } from 'react';

export default function Home(message) {
  var [link,setLink] = useState("");
 
  async function getDownloadLink(e){
    var regex = new RegExp("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");
    var a = link.match(regex);
    if(link.match(regex) != null){
      if(link.match("tiktok") != null){
        window.location = "/download/tiktok?link="+link;
      }else if(link.match("youtube") != null || link.match("youtu") != null ){
        window.location = "/download/youtube?link="+link;
      }else if(link.match("instagram") != null){
        window.location = "/download/instagram?link="+link;
      }
    }else{
      alert("Bad URL!");
    }
  }

  return (
    <div className="flex bg-[#f0f2f5] items-center h-screen w-screen justify-center">
      <div id="dashboard" className='flex flex-col items-center w-full'>
        <input onChange={ e => setLink(e.target.value) } className='shadow-xl bg-gray-200 rounded px-4 py-2 m-5 w-1/2' placeholder='youtube,tiktok,instgram url...' />
        <div onClick={ getDownloadLink } className='cursor-pointer shadow-xl bg-red-500 rounded px-4 py-2 w-fit text-white font-bold'>Download</div>
      </div>
    </div>
  )
}
