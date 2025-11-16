import { useState,useEffect } from 'react'
import './App.css'
import Overlay from './components/overlay'
import FileUpload from './components/Ui/FileUpload'
import Manager from './components/Ui/Manager'
import { dataExist } from './db/models'
import DownloadComponent from './components/Ui/DownloadComponent'
import { ErrorHandlingComp } from './components/ErrorHandlingComp'
// import { creationDB } from './db/models'

function App() {
  const [showManager,setShowManager] = useState(false)
  const [showSave,setShowSave] = useState(false)
  const [error,setError] = useState(null)

  const onClose = () => {
    setError(null)
  }
  useEffect(()=>{
    async function handleCleaning(){
      const dataAlreadyExist = await dataExist()
      if(dataAlreadyExist){
        setShowSave(true)
      }
    }
    handleCleaning()
    function handleError(e){
      console.log(e.detail)
      let err = e.detail.message || 'something went wrong'
      setError(err)
      setShowManager(false);
    }
    window.addEventListener('error-handle',handleError)
    return () => window.removeEventListener('error-handle',handleError)
  },[])

  function handleFileSubmit(){
    console.log('file submit handled')
    // triggered to read data from files and save it to db by creating a db
    setShowManager(true)
  }

  async function openManager(){
    // handling to create a db in indexed DB , if it's already doesn't exist. by calling creationDB function. 
    // check here if db already exist with my store in it if it doesn't create a one. 
    //  creation of db 
    // await creationDB()
    setShowManager(true)
  }

  return (
    <div className='bg-bg text-text font-regular h-screen overflow-hidden'>
    <div className='flex items-center justify-center flex-col h-full'>
      <div className='text-3xl text-center font-bold'>Password Manager</div>
      <div className='flex flex-col justify-center items-center'>
      {showManager ? (<Manager />):(
        <>
      <div className='flex flex-col gap-6 items-center justify-center pt-16'>
        {/* load from files button */}
            <Overlay
              trigger={
              <div className='regular-container'>Load from files</div>
              }
            >
              <FileUpload onSubmit={handleFileSubmit} />
            </Overlay>
        {/* build new entry button */}
            <div className='regular-container' onClick={openManager}>Build new Entry</div>
      </div>
        </>)}
      </div>
      {/* first page */}

        {/* overlay for saving */}
        {
        showSave &&
        <Overlay>
          {/* also clear data to clear files after saving the data */}
          {({closeOverlay})=>( <DownloadComponent closeOverlay={closeOverlay} />)}
            
        </Overlay>
        }

        {error && <ErrorHandlingComp message={error} onClose={onClose} />}
    </div>
    </div>
  )
}

export default App
