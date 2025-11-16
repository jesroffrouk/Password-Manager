import { Mail,X , AlertTriangle } from 'lucide-react';
import Overlay from '../../overlay';
import MasterKey from '../MasterKey';
import { useEffect, useState } from 'react';
import { DeleteData, getAllServices} from '../../../db/models';

export default function RetriveForm({closeOverlay}) {
  // add retrive handler
  const ListOfservices = [
      { id: 'facebook', name: 'Facebook', icon: Mail, color: 'bg-blue-600' },
      { id: 'twitter', name: 'Twitter', icon: X, color: 'bg-blue-400' },
      { id: 'instagram', name: 'Instagram', icon: Mail, color: 'bg-pink-500' },
      { id: 'linkedin', name: 'LinkedIn', icon: Mail, color: 'bg-blue-700' },
      { id: 'google', name: 'LinkedIn', icon: Mail, color: 'bg-blue-700' },
  ]
  const [services,setServices] = useState([])
  useEffect(()=>{
    (async()=>{
      const haveServices = await getAllServices()
      const showServices = ListOfservices.filter((service)=>(haveServices.includes(service.name)))
      setServices(showServices)
    })()
  },[])

  const [ServiceName,setServiceName] = useState('') // inconsistency of capital S in here

  const onSelect = async(service) =>{
    setServiceName(service)
  }

  const onSubmit = async(key) => {
    // match password then delete service
    await DeleteData(ServiceName) 
    // data delted
    closeOverlay()
  }

  return (
    <>
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-text mb-4">Select Password to Delete</h2>
      {
        services.length > 0 ? (<>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (

                <Overlay
                trigger={
                <button
                  onClick={() => onSelect?.(service.name)}
                  className="flex items-center gap-3 px-4 py-3 border hover:bg-blue-400/50 rounded-lg transition-colors text-left"
                >
                  <div className={`p-2 ${service.color} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-text font-medium">{service.name}</span>
                </button>
                }
                key={service.id}
                >
                  <MasterKey onSubmit={onSubmit} />
                </Overlay>

              );
            })}
          </div>
        </>):(
        <>
          <div className="w-full max-w-6xl">
            {/* Horizontally Long Warning Component */}
            <div className="bg-amber-100/10 backdrop-blur-sm border border-text rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-amber-600 text-sm font-medium">
                    No data available
                  </p>
                  <p className="text-gray-400 text-xs">
                    Add a password to show it here.
                  </p>
                </div>
              </div>
            </div>
        </div>
        </>)
      }
    </div> 
    </>
  )
}