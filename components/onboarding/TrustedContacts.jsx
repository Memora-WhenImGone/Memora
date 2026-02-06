import { Button } from '@radix-ui/themes'
import { Plus, Trash2 } from 'lucide-react'
import React from 'react'

const TrustedContacts = ({ contacts, setContacts, newContact, setNewContact }) => {

  const relationships = [
    'Parent',
    'Sibling',
    'Spouse',
    'Child',
    'Friend',
    'Lawyer',
    'Some One Else'
  ];


  const handleAddContact = () => {
    if (newContact.name && newContact.email && newContact.relationship) {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
    }
  };

  const handleRemoveContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Add Trusted Contacts
        </h1>
        <p className="text-lg text-gray-600">
          These people will receive access to your vault when release conditions are met.
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <button className="flex items-center gap-2 
        text-gray-700 font-medium mb-6">
          <Plus className="w-5 h-5" />
          Add New Contact
        </button>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Name
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 
                focus:border-transparent text-gray-900"

              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Relationship
            </label>
            <select
              value={newContact.relationship}
              onChange={(e) =>
                setNewContact({ ...newContact, relationship: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-gray-900 
              focus:border-transparent text-gray-700 bg-white"
            >
              <option value="">Select relationship</option>
              {relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddContact}
            className="w-full bg-gray-500 hover:bg-gray-600 
            text-white font-medium py-3 rounded-lg flex items-center 
            justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Contact
          </button>
        </div>
      </div>
      {contacts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Added Contacts ({contacts.length})
          </h3>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex 
                items-center justify-between hover:border-gray-300 
                transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-700 font-semibold">
                      {getInitial(contact.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {contact.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contact.email} - {contact.relationship}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default TrustedContacts;

