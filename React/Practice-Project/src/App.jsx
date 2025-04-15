import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'

function AppCounter() {
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
    }
  }, [props.count1, props.count2])

  // multiple counters
  return <div>
    <h1>Running Counter: {count}</h1>
    <h2>Counter 1: {props.count1} </h2>
    <h2>Counter 2: {props.count2} </h2>
  </div>
}

// children prop
const Card = ({ children }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
      color: '#333',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px',
      boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    }}> {children} </div>
  )
}

// list and keys
const ItemList = ({ Items }) => {
  return (
    <ul>
      {Items.map(item => (
        <li key={item.id} style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}

// Error Boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

// FRagment
const FragmentExample = () => {
  return (
    <>
      <h1>Fragment Example</h1>
      <p>This is a fragment example.</p>
    </>
  )
}

const ErrorComponent = () => {
  throw new Error('This is a simulated error')
}

// Single Page Application
const App = () => {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/neet/class-11" element={<Class11Program />} />
          <Route path="/neet/class-12" element={<Class12Program />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
}

// Layout
function Layout() {
  return <div style={{ height: "100vh" }}>
    <Header />
    <div style={{ height: "90vh" }}>
      <Outlet />
    </div>
    <Footer />
  </div >
}

function Header() {
  return (
    <nav>
      <Link to="/">Allen</Link> |{" "}
      <Link to="/neet/class-11">Class 11</Link> |{" "}
      <Link to="/neet/class-12">Class 12</Link>
    </nav>
  );
}

function Footer() {
  return <div>
    <p>Footer content goes here.</p>
  </div>
}

function Landing() {
  return <div>
    <h1>Welcome to the NEET Program</h1>
    <p>This is the landing page.</p>
  </div>
}

function Class11Program() {
  return <div>
    <h1>Class 11 Program</h1>
    <p>This is the Class 11 program.</p>
  </div>
}

function Class12Program() {
  return <div>
    <h1>Class 12 Program</h1>
    <p>This is the Class 12 program.</p>
  </div>
}

const App2 = () => {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
      <Card>
        <p>This is a card component.</p>
        <p>It can contain any content you want.</p>
      </Card>
      <Card>
        <p>This is another card component.</p>
        <p>It can also contain any content you want.</p>
      </Card>
      <AppCounter />
      <h2>Item List</h2>
      <ItemList
        Items={[
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
        ]}
      />
      <h2>Item List with Unique Keys</h2>
      <ItemList
        Items={[
          { id: 1, name: 'Item A' },
          { id: 2, name: 'Item B' },
          { id: 3, name: 'Item C' },
        ]}
      />
      <h2>Fragment Example</h2>
      <FragmentExample />
    </div>
  )
}

export default App
