import { useContext, useEffect, useState } from 'react';

import Contexts from '../../context';
import TextLoader from '../TextLoader';
import mandali from '../mandali.module.css';

const moment = require('moment');

export default function LastUpdated() {
  const [text, setText] = useState<string>('Never');

  const { lastUpdatedDate } = useContext(Contexts.leaguePageData);

  useEffect(() => {
    setText(moment(lastUpdatedDate).fromNow());

    const Interval = setInterval(() => {
      setText(moment(lastUpdatedDate).fromNow());
    }, moment.duration(30, 'seconds'));

    return () => clearInterval(Interval);
  }, [text, lastUpdatedDate]);

  return (
        <div className={`text-center ${mandali.mandali} user-select-none ${lastUpdatedDate ? 'mt-3' : 'mb-2'}`}>
             {lastUpdatedDate ? `- Last updated ${text} -` : <TextLoader>...</TextLoader>}
         </div>
  );
}
