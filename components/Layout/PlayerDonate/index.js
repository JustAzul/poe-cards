import mandali from '../../mandali.module.css';

import Dynamic from 'next/dynamic';
import Spinner from '../../Spinner';

import TextLoader from '../../TextLoader';

const TwitchPlayer = Dynamic(() => import('./TwitchPlayer'), {loading: () => <Spinner />});
const DonationButtons = Dynamic(() => import('./Buttons'), {loading: () => <TextLoader />});

export default function PlayerDonate({parent}) {
    const ChannelName = "azul21";

    return (
        <div className="row justify-content-center mt-4">
         <TwitchPlayer ChannelName={ChannelName} parent={parent}/>
          <div className="mt-4 text-center">
            <div>
              <blockquote className={`blockquote ${mandali['mandali']}`}>
              This is available for <strong>free</strong>, if you're gratefull for what i did, please consider donating, to develop and maintain this, costs me time and money. Even $1 is highly appreciated and shows that you care. Thank you!
              </blockquote>
              <p className="mb-2 mt-2">
                <DonationButtons ChannelName={ChannelName} />
              </p>
            </div>
          </div>
        </div>
    );
}