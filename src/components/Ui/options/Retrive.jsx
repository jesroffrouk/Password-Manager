import Overlay from '../../overlay';
import MasterKey from '../MasterKey';
import { useEffect, useState } from 'react';
import { getAllServices, RetriveData } from '../../../db/models';
import { decryption } from '../../../services/cryptoUtils.';
import ShowPassword from '../ShowPassword';
import { ListOfServices } from '../../../constants/ServiceList';
import { AlertTriangle } from 'lucide-react';

export default function RetriveForm() {
  // add retrive handler
  const [services,setServices] = useState([])
  useEffect(()=>{
    (async()=>{
      const haveServices = await getAllServices()
      const showServices = ListOfServices.filter((service)=>(haveServices.includes(service.name)))
      setServices(showServices)
    })()
  },[])

  const [show,setShow] = useState(false)
  const [crendentials,setCredentials] = useState(null)
  const [ServiceName,setServiceName] = useState('') // inconsistency of capital S in here

  const onSelect = async(service) =>{
    setServiceName(service)
  }

  const onSubmit = async(key) => {
    // handle decryption
    // verifying masterkey - i need to verify if the master key is consistent or correct
    // retrive details from db, like Identifier, Passwd , decrypt everything,
    const data = await RetriveData(ServiceName) // data {Identifier,Passwd,decrypt}
    let cipherText = data.Passwd
    let salt = data.Decrypt.Salt
    let iv = data.Decrypt.Iv
    const Password = await decryption(cipherText,salt,iv,key)
    // then pass details to the showPassword to show details to the user where user can copy and paste items. That would be it. 
    // end
    let Identifier = data.Identifier
    // trigger a function to call for showPassword component to show Password
    setCredentials({ServiceName,Identifier,Password})
    setShow(true)
  }

  // here i renderd it conditionally so i don't need to use function as chldren , but it would have been simple but i don't feel any need of that but i can do that to make consistency and render it with show && <compoennt> 

  return (
    <>
      {show ? 
      (<>
      <ShowPassword crendentials={crendentials} /> 
      </>):
       (<>
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-text mb-4">Select Password to retrive</h2>
        {
          services.length > 0 ? (<>

      <div className="grid grid-cols-2 gap-2">
         { services.map((service) => {
          const Icon = service.icon;
          return (

            <Overlay
            trigger={
            <button
              onClick={() => onSelect?.(service.name)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-400/50 border border-text rounded-lg transition-colors text-left`}
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
        })
      }
      </div>
          </>):
          (<>
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
      </>)}
    </>
  )
}