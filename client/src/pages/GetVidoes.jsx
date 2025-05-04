import axios from 'axios';
import { useEffect, useState } from 'react';

const GetVidoes = () => {
    console.log("getvideos");
    const [videos, setVideos] = useState([]);
    const getVideos = async () => {
        // const result = await axios.get('http://localhost:8000/awareness')
        const result = await axios.get('http://localhost:8080/user-service/awareness')
            .then((response) => {
                console.log(response);
                return response.data.body;
            })
            .catch((err) => {
                console.log(err);
                return [];
            })
        console.log(result, "result");
        return result;
    }

    useEffect(() => {
        const fetch = async () => {
            const result = await getVideos();
            setVideos(result);
        }
        fetch();
    }, [])
    return (
        <div>
            {
                videos.map((video) => {
                    return (<div key={video.title}> {/*<!--need to add correct key-->*/}
                        <p>{video.title}</p>
                        <video width="320" height="240" controls>
                            <source src={video.location} type="video/ogg" />
                        </video>
                        {/* <img src= /> */}
                    </div>)
                })
            }
        </div>
    )
}

export default GetVidoes;