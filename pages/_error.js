import Link from 'next/link';
import styles from '../components/error.module.css';

function Error({ statusCode, leagueError = false }) {
  
  if(statusCode === 404 || statusCode === 200) {
    return ( 
      <div className={`${styles['notfound-2']} user-select-none`}>
        <div className={styles['notfound']}>
          <div className={styles['notfound-404']}></div>
          <h1>404</h1>
          <h2>Oops! {leagueError ? `League` : `Page`} Not Found</h2>
          <p>
            Sorry but the {leagueError ? `league` : `page`} you are looking for does not exist, have been removed. name changed or is temporarily unavailable
          </p>
          <Link href={leagueError ? `../` : `/`}>
            <a>
              {`> Select a league.`}
            </a>
          </Link>
        </div>
      </div>  
    );
  }

  return (
    <p className="text-center m-auto">
      {statusCode
        ? `An error ${statusCode} occurred on server.`
        : 'An error occurred on client.'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error;