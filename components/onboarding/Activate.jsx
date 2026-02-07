"use client";
import React from 'react';
import { Shield, Users, Clock, CheckCircle } from 'lucide-react';

const Activate = ({ vaultName, contacts, inactivityPeriod, warningPeriod }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Ready to Activate
        </h1>
        <p className="text-lg text-gray-600">
          Review your vault configuration before activating protection.
        </p>
      </div>


      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <Shield className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Vault</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{vaultName}</p>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              Pending Activation
            </span>
          </div>
        </div>
      </div>

    
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Trusted Contacts ({contacts.length})
          </h2>
        </div>
        <div className="px-6 py-5">
          {contacts.length > 0 ? (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                    Invite Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No contacts added</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Release Trigger</h2>
        </div>
        <div className="px-6 py-5">
          <div className="space-y-2">
            <p className="text-gray-900">
              <span className="font-semibold">Release after {inactivityPeriod} days</span> of inactivity
            </p>
            <p className="text-sm text-gray-600">
              Warning notifications {warningPeriod} days before release
            </p>
          </div>
        </div>
      </div>

  
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <p className="text-green-800 font-medium">
            Your vault will be encrypted and protected immediately upon activation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Activate;