import { useState, useEffect } from 'react'
import { debounce } from './utils'

interface SearchResult { 
  id: number;
  title: string;
  url: string;
}

const VoiceIcon = () => (
  <svg width={40} height={40} focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path><path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path><path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path><path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path></svg>
)

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { 
    if (searchTerm === '') {
      setSearchResults([])
      return
    }
    debounce(() => {
      fetch(`http://localhost:8080/`, {
        method: 'POST',
        body: JSON.stringify({ query: searchTerm }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setSearchResults(data)
      })
    }, 1000)()
  }, [searchTerm])

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <img width={500} src="/google.png" alt='google logo' />
      <div className='group shadow-lg rounded-md'>
        <div className='p-2 hover:shadow-2xl flex mt-6 items-center gap-3 border-2 border-gray-300 rounded-full w-[800px]'>
          <img src="/lens.svg" alt="lens icon" width={40} />
          <input onChange={(e) => {
            setSearchTerm(e.target.value)
          }} value={searchTerm} type="text" className='text-2xl px-2 flex-grow outline-none' />
          <VoiceIcon />
        </div>
        <div className='space-y-3'>
          {
            searchResults.map((r: SearchResult) => (
              <div className='w-[800px] text-xl flex' key={r.id}>
                <img src="/lens.svg" alt="lens icon" />
                <a href={r.url} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
