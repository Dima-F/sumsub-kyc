import './App.css';
import SumsubWebSdk from '@sumsub/websdk-react'
import { useEffect, useState, useId } from 'react'
import axios from 'axios'

const MESSAGE_STATUSES = {
  APPLICANT_SUBMITTED: 'idCheck.onApplicantSubmitted',
  STATUS_CHANGED: 'idCheck.onApplicantStatusChanged',
  STEP_COMPLETED: 'idCheck.onStepCompleted',
  LIVENESS_COMPLETED: 'idCheck.onLivenessCompleted'
}

const REVIEW_STATUSES = {
  PENDING : 'pending',
  COMPLETED: 'completed'
}

function App() {
  const [token, setToken] = useState(null);
  const [completed, setCompleted] = useState(false);
  const id = useId();

  useEffect(() => {
    axios.get('/access-token', {
      params: {
        externalUserId: `user_${id}`
      }
    })
    .then(res => {
      res?.data?.token && setToken(res.data.token)
    })
    .catch(e => console.error(e))
  }, [])

  const handleMessage = (message, options) => {
    switch(message) {
      case MESSAGE_STATUSES.STATUS_CHANGED: {
        if(options.reviewStatus === REVIEW_STATUSES.COMPLETED) {
          setCompleted(true);
        }
        break;
      }
      default: return;
    }
  }

  const handleError = (e) => {
    console.error(e);
  }

  return (
    <div className="App">
      {
        token ? (
          <SumsubWebSdk
            accessToken={token}
            expirationHandler={()=>{}}
            config={{
              // lang: 'fr'
              theme: 'Purple btn'
            }}
            options={{}}
            onMessage={handleMessage}
            onError={handleError}
          />
        ) : null
      }
      {
        completed && <h2 className='Process-Completed'>Process completed</h2>
      }
    </div>
  );
}

export default App;
