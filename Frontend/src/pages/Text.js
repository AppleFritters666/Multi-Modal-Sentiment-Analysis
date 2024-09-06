import './Text.css'
import React,{useState} from 'react';
import axios from 'axios'; 
const Text = () => {
    const [input,setInput] = useState('');

    const[textSent,SetTextSent] = useState('');

    const analyzeSentiment = async () =>{
        try{
            const response = await axios.post('http://127.0.0.1:5000/predict',{text:input});
            SetTextSent(response.data.sentiment); 
        }
        catch (error) {
        console.error('Error predicting sentiment:', error);
        SetTextSent('Error occurred');
    }
    };

    return( 
        <div className="text">
            <div className='io'>
                <textarea onChange={(event) => setInput(event.target.value)} className="textIn" value={input} placeholder='Type/Paste Here'></textarea>
                <div className='result'>
                    {textSent}
                </div>
            </div>
            <button className="textButton" onClick={analyzeSentiment}>Analyze</button>
        </div>
    )
}

export default Text; 