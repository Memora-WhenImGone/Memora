import { Shield } from 'lucide-react'



const CreateVault = ({vaultName, setVaultName}) => {
  return (
    <div className='space-y-8'>
      <div className='text-center'>
  <h1  className='text-4xl font-bold text-gray-900 mb-3'>
     Create Your Vault
  </h1>

  <p className='text-lg text-gray-600'>
    Give your vault a name. 
    This is how you will identify it in your dashboard.
  </p>
      </div>

 <div className='bg-white rounded-xl border border-gray-200 p-8'>
        
<div className='flex items-center gap-3 mb-6 pb-6 border-b-2 border-gray-200'>
 <Shield className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Vault Configuration
          </h2>


</div>

     
     <div className='space-y-2'>
     <label className='block text-sm font-semibold text-gray-900 '>
Vault Name
     </label>

       <input
       type='text'
       value={vaultName}
       onChange={(e)=>{setVaultName(e.target.value)}}
         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
            placeholder="When I am Gone"
       >

        
       </input>

     </div>


     </div>


    </div>

    

  )
}

export default CreateVault
