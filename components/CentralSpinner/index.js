import Spinner from '../Spinner';

export default function CentralSpinner() {
    console.log(new Date(), 'CentralSpinner');
    return (
        <div className="text-center mt-5 mb-5">
            <Spinner/>
        </div>
    );
}