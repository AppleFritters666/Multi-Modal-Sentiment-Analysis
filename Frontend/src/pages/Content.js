import './Content.css'
import React from 'react';
import { useState } from 'react';
import Text from './Text';
import Picture from './Picture';
const Content = () =>{
    const [type,setType] = useState('text'); 
    const handleSetType = (newType) =>{
        setType(newType); 
    };
    const getButtonClass = (buttonType) => {
        return type === buttonType ? 'tabButton active' : 'tabButton inactive';
    };
    return(
        <div className="box">
            <div className="Bar">
                <h1>Multi-modal Sentiment Analysis</h1> 
            </div>
            <div className='tool'>
                <div className='tabs'>
                    <button className={getButtonClass('text')} onClick={() => handleSetType('text')}>Text</button>
                    <button className={getButtonClass('pic')} onClick={() => handleSetType('pic')}>Picture</button>
                    <button className={getButtonClass('vid')} onClick={() => handleSetType('vid')}>Video</button>
                </div>
                <div className='content'>
                    {type === 'text' && <Text/>}
                    {type === 'pic' && <Picture/>}
                    {type === 'vid' && <div>Video Content</div>}
                </div>
            </div>
        </div>
    )
}

export default Content; 