import { useEffect, useState } from 'react'

function App() {
  // conditional rendering
  let [counterVisible, setCounterVisible] = useState(false)
  useEffect(() => {
    setInterval(() => { setCounterVisible(c => !c) }, 50000)
  }, [])

  let [count1, setCount1] = useState(0)
  let [count2, setCount2] = useState(0)

  function IncreaseCount1() {
    setCount1(count1 + 1)
  }
  function DecreaseCount2() {
    setCount2(count2 - 1)
  }

  return <div>
    <b>Welcome to Hood</b>
    {counterVisible || <Counter count1={count1} count2={count2}></Counter>}
    <button onClick={IncreaseCount1}>Home</button>
    <button onClick={DecreaseCount2}>About</button>
  </div>
}

// use of props
function Counter(props) {
  const [count, setCount] = useState(0)

  // mounting and unmounting
  useEffect(() => {
    console.log('Component mounted')
    let clock = setInterval(() => {
      console.log('Interval running')
      setCount(c => c + 1)
    }, 1000)

    return () => {
      console.log('Component unmounted')
      clearInterval(clock) //cleanup
    }
  }, [])

  useEffect(() => {
    console.log("Props changed")
    return function cleanup() {
      console.log("Cleanup Action onn Props Change")
    }}, [props.count1, props.count2])

  // multiple counters
  return <div>
    <h1>Running Counter: {count}</h1>
    <h2>Counter 1: {props.count1} </h2>
    <h2>Counter 2: {props.count2} </h2>
  </div>
}

export default App
