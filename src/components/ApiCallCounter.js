import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '../constants'

ApiCallCounter.propTypes = {
  count: PropTypes.number,
  setCount: PropTypes.func,
  refresh: PropTypes.bool
}

function ApiCallCounter ({ count, setCount, refresh }) {
  const MAX_API_CALLS = 20

  useEffect(() => {
    async function getCallCount () {
      fetch(`${API_URL}/api-call-count`, {
        method: 'GET',
        credentials: 'include'
      }).then((res) => {
        return res.json()
      }).then(({ count: newCount }) => {
        setCount(parseInt(newCount))
      })
    }

    try {
      getCallCount()
    } catch (err) {
      console.error(err)
    }
  }, [refresh])

  return <p className="mt-4 text-xl text-center">API Calls Remaining: {MAX_API_CALLS - count}</p>
}

export default ApiCallCounter
