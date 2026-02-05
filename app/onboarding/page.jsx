'use client' // if you seeing this for the first time, Everything in Next.js is server side but to use hooks like useeffect from React we have 
// make pages components client side 

// important when it complains that client side things can  not be used on server components just use this line 

// Good engineering would be if you a re using a component that use a client side thing in a server componet make another compoonent than import it in the server side component 

// exmaple if you plan to use anything client side in layout.tsx please dont make layout.tsx a client side component 


import { Check, Clock, Shield, Users } from 'lucide-react'
import Header from '../../components/HomePage/Header'
import { useState } from 'react';
import CreateVault from '../../components/onboarding/CreateVault';

const Page = () => {


  const [currentStep, setCurrentStep] = useState(1);


   const [vaultName, setVaultName] = useState('My Personal Vault');

const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    relationship: ''
  });



    const Steps = [

        {
            id:1, title:'Create Vault', icon: Shield
        },
         {
            id:2, title:'Trusted Contacts', icon: Users
        },
         {
            id:3, title:'Configure Trigger', icon: Clock
        },
         {
            id:4, title:'Activate', icon: Check
        }
    ]


    const relationships = [

      'Parent', 
      'Sibling',
      'Spouse',
      'Child', 
      'Friend',
      'Lawyer',
      'Other'
    ];




  return (
  <div className="min-h-screen bg-gray-50">
        <Header/>
  
       <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {Steps.map((Step, i) => {
              const Icon = Step.icon;
              const isCompleted = currentStep > Step.id;


              const isActive = currentStep === Step.id;
              
              return (
                <div key={Step.id} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`rounded-xl p-4 transition-all ${
                        isCompleted

                          ? 'bg-green-500'
                          : isActive
                          ? 'bg-gray-900'
                          : 'bg-gray-200'
                      }`}
                    >
                   


                      <Icon
                        className={`w-6 h-6 ${
                          
                          isCompleted ||
                           isActive ? 
                           'text-white' : 
                           'text-gray-400'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium
                      ${ isActive ? 'text-gray-900' : 'text-gray-500'}
                      
                      `}
                    >


                      {Step.title}
                    </span>
                  </div>
                  {i < Steps.length&& 
                  (
                    <div
                      className={`flex-1 h-1 mx-4 rounded 
                      
                      ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }
                      
                      `}
                    />
                  )
                  
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>  
      
    {/* I am doing prop drilling here not a good practice 
    
    Better Approach would be if I use Redux toolkit to mmange the 
    state but the code will become very complex

    We will think about it if we will be able to finish the prject on time 


    
     */}


      {currentStep === 1 && (
          <CreateVault
          
           vaultName={vaultName} 
           setVaultName={setVaultName} />
        )}

        
      
       </div>
  )
}

export default Page;
