import React,{useRef, useState} from "react";
import './Picture.css'; 
import axios from "axios";

const Picture = () =>{
    // const inputRef = useRef(); 
    const [image,setImage] = useState(null);
    const [imageSent,setImageSent] = useState('');

    const handleImage = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };
    
    const analyzeSentiment = async () =>{
        if (!image){
            alert('Select An Image First?');
            return
        }
        const formData = new FormData();
        formData.append('image', image);
        try{
            const response = await axios.post('http://localhost:5000/analyze', formData);
            setImageSent(response.data.sentiment); 
        }
        catch (error) {
        console.error('Error predicting sentiment:', error);
        setImageSent('Error occurred');
        }
    };


    return(
        <div className="io">
            <div className="in">
                {image ? <img src={URL.createObjectURL(image)} className="display"/> : <img src='./sample.jpg' alt="Sample image" className="display" />}
                <div>
                    <input className='picInput'type="file"  onChange={handleImage} />
                    <button className="picButton" onClick={analyzeSentiment}>Analyze</button>
                </div>  
            </div>
            <div className="result">
                {imageSent}
            </div>
        </div>
    ); 
}

export default Picture; 