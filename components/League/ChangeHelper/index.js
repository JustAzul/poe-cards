import SplitedExaltedStyles from '../SplitedExalted/index.module.css';
import {useEffect, useRef} from 'react';
import styles from './index.module.css';

export default function ChangeHelper({setBoxHeight}) {
    
    const Element = useRef(null);

    const HandleElement = () => {
        if (Element.current) {
            const {height} = Element.current.getBoundingClientRect();
            setBoxHeight(height);
        }
    };

    useEffect(() => {
        HandleElement();
        window.addEventListener("resize", HandleElement);
        return () => {
            window.removeEventListener('resize', () => HandleElement);
          };
    }, [Element]);
    
    return (
        <>
            <div className={`pl-2 pr-2 text-center user-select-none ${SplitedExaltedStyles.header2}`}>
                Change Helper 
            </div>

            <div ref={Element} className={`mt-2 border ${styles['bg-white']}`}>
                <div className="container">
                    <div className="row p-2 pt-1 justify-content-center text-center">
                        
                        <div className="form-group">
                            <label className="user-select-none">Item Chaos Price:</label>
                            <input defaultValue={0} min={0} type="number" placeholder="Chaos Price per item" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group">
                            <label className="user-select-none">Amount:</label>
                            <input defaultValue={1} min={0} type="number" placeholder="Item Amount Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group mb-2">
                            <label className="user-select-none">Exalted Payment:</label>
                            <input defaultValue={0} min={0} type="number" placeholder="Exalted Payment Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group mb-2">
                            <label className="user-select-none">Change:</label>
                            <input /* disabled={true} */ defaultValue={'0c'} min={0} type="text" className="form-control-sm text-center mr-2 ml-2" readOnly></input>
                        </div>
                        
                        <div className={`p-0 m-0 pb-1 ${styles.chaosvalue}`}>
                            <span className="user-select-none">Item Chaos Value: </span><span className="pl-1">0c</span>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}