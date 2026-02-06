
'use client'
import { Check, Clock, Shield, Users } from 'lucide-react'
import Header from '../../components/HomePage/Header'
import { useState } from 'react';
import CreateVault from '../../components/onboarding/CreateVault';
import TrustedContacts from '../../components/onboarding/TrustedContacts';
import NavigationButtons from '../../components/onboarding/Navigationbuttons';
import Activate from '../../components/onboarding/Activate';
import ConfigureTrigger from '../../components/onboarding/ConfigureTrigger';

const Page = () => {


  const [currentStep, setCurrentStep] = useState(1);

 const [inactivityPeriod, setInactivityPeriod] = useState(90);
  const [warningPeriod, setWarningPeriod] = useState(3); 
   const [vaultName, setVaultName] = useState('My Personal Vault');

const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    relationship: ''
  });


const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActivate = () => {
  };
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
                  {i < Steps.length -1 && 
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
<div className="max-w-3xl mx-auto px-6 py-12">
 {currentStep === 1 && (
          <CreateVault
          
           vaultName={vaultName} 
           setVaultName={setVaultName} />
        )}

         {currentStep === 3 && (
          <ConfigureTrigger
            inactivityPeriod={inactivityPeriod}
            setInactivityPeriod={setInactivityPeriod}
            warningPeriod={warningPeriod}
            setWarningPeriod={setWarningPeriod}
          />
        )}

    
        {currentStep === 4 && (
          <Activate
            vaultName={vaultName}
            contacts={contacts}
            inactivityPeriod={inactivityPeriod}
            warningPeriod={warningPeriod}
            onActivate={handleActivate}
          />
        )}

              {currentStep === 2 && (  <TrustedContacts
contacts={contacts}
            setContacts={setContacts}
            newContact={newContact}
            setNewContact={setNewContact}

               />)}
        
         <NavigationButtons
          currentStage={currentStep}
          onBack={handleBack}
          onContinue={handleContinue}
        />
</div>

     
       </div>
  )
}

export default Page;
