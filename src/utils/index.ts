import { mediaSrc } from "../assets/api";
import { getMusicSrcWithCloudId } from "../assets/cloudApi";
import { LocalAudioInfo, CloudAudioInfo, AudioInfoType, Singer } from "../interface";


/** 整合数据, 统一本地歌曲和网易云歌曲的字段 */
export async function formatMusicInfo(info: LocalAudioInfo | CloudAudioInfo) {
    let id: number, 
        title: string, 
        cover: string, 
        duration: number, 
        singers: Singer[], 
        src: string;
    if (info.type === AudioInfoType.local) {
        id = info.music_id;
        title = info.music_name;
        cover = info.music_cover;
        duration = info.duration;
        singers = info.singers.map(item => ({id: item.singer_id, name: item.singer_name}));
        src = mediaSrc(`/music/${info.music_id}`)
    }
    else {
        id = info.id;
        title = info.name;
        cover = info.al.picUrl;
        duration = info.dt;
        singers = info.ar;
        let [err, result] = await getMusicSrcWithCloudId(info.id);
        if (!err && result) {
            src = result.data.data.src;
        }
        else {
            src = ''
        }
    }
    return {
        type: info.type, id, title, cover, duration, singers, src
    }
}