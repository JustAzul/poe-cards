import Dynamic from 'next/dynamic';
const Spinner = Dynamic(() => import('../Spinner'), {loading: () => <>{`Please wait..`}</>});

export default function CentralSpinner() {
    return (
        <div className="text-center mt-5 mb-5">
            <Spinner/>
        </div>
    );
}