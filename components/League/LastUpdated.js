import TextLoader from '../TextLoader';
const moment = require('moment');

export default function LastUpdated({LastUpdatedDate}) {
    return (
        <div className={`text-center mandali user-select-none ${LastUpdatedDate ? "mt-3" : "mb-2"}`}>
             {LastUpdatedDate ? `- Last updated ${moment(LastUpdatedDate).fromNow()} -` : <TextLoader>...</TextLoader>}
         </div>
    );
}