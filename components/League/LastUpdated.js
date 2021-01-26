import TextLoader from '../TextLoader';
import {useEffect, useState} from 'react';
import mandali from '../mandali.module.css';

const moment = require('moment');

export default function LastUpdated({LastUpdatedDate}) {    
    const [Text, setText] = useState();
    
    useEffect(() => {
        setText(moment(LastUpdatedDate).fromNow());
        const Interval = setInterval(() => {
            setText(moment(LastUpdatedDate).fromNow());
        }, moment.duration(30, 'seconds'));

        return () => {
            clearInterval(Interval);
        };
        
    }, [Text, LastUpdatedDate]);

    return (
        <div className={`text-center ${mandali['mandali']} user-select-none ${LastUpdatedDate ? "mt-3" : "mb-2"}`}>
             {LastUpdatedDate ? `- Last updated ${Text} -` : <TextLoader>...</TextLoader>}
         </div>
    );
}