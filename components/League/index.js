import styles from './index.module.css';
import SplitedValues from './SplitedExalted';
import ChangeHelper from './ChangeHelper';

export default function League({SplitsArray}) {
    return (
        <>
            <div className="row mandali mt-2">

                <div className="col-sm">
                    <SplitedValues SplitsArray={SplitsArray}></SplitedValues>
                </div>

                <div className="col-sm">
                    <ChangeHelper></ChangeHelper>
                </div>

            </div>            
        </>        
    );
}