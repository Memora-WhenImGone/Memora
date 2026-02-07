"use client"
import React from "react";
import { Clock } from "lucide-react";

const ConfigureTrigger = ({
  inactivityPeriod,
  setInactivityPeriod,
  warningPeriod,
  setWarningPeriod,
}) => {
  const warningOptions = [1, 3, 7, 14, 30];

  const getMonthsDisplay = (days) => {
    const months = Math.round(days / 30);
    return `${months} months`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Configure Release Trigger
        </h1>
        <p className="text-lg text-gray-600">
          Set how long after inactivity your vault should be released to trusted contacts.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Inactivity Trigger
          </h2>
        </div>

     
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-base font-semibold text-gray-900">
              Inactivity Period
            </label>
            <span className="text-lg font-bold text-blue-600">
              {getMonthsDisplay(inactivityPeriod)}
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="7"
              max="365"
              step="1"
              value={inactivityPeriod}
              onChange={(e) => setInactivityPeriod(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>7 days</span>
              <span>365 days</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Your vault remains locked while you are active.
            </p>
            <p className="text-sm text-gray-600">
              You will receive warning notifications before release.
            </p>
            <p className="text-sm text-gray-600">
              After {inactivityPeriod} days, your vault is released to trusted contacts.
            </p>
          </div>
        </div>


        <div className="space-y-2">
          <label className="block text-base font-semibold text-gray-900">
            Warning Period
          </label>
          <select
            value={warningPeriod}
            onChange={(e) => setWarningPeriod(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-700 bg-white"
          >
            {warningOptions.map((days) => (
              <option key={days} value={days}>
                {days} {"days"}
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500">
            You will receive notifications during this period before release
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigureTrigger;
