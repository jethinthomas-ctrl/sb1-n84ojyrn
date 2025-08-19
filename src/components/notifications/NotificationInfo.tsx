import React from 'react';
import { MessageCircle, Mail, Phone, Info } from 'lucide-react';

const NotificationInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-8">
        <MessageCircle className="h-8 w-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Notification System</h1>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-gray-900 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Automatic Notifications (Implementation Required)
            </h2>
            <p className="text-gray-800">
              The notification system is designed to automatically send reminders to team members 
              listed in upcoming schedules. This feature requires integration with external services 
              for WhatsApp and Email delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WhatsApp Integration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="h-6 w-6 text-gray-900" />
            <h2 className="text-xl font-semibold text-gray-900">WhatsApp Integration</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Recommended Service:</h3>
              <p className="text-gray-800 text-sm">Twilio WhatsApp Business API</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">1.</span>
                <div>
                  <p className="font-medium text-gray-900">Create Twilio Account</p>
                  <p>Sign up at twilio.com and get WhatsApp Business API access</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">2.</span>
                <div>
                  <p className="font-medium text-gray-900">Setup Webhook</p>
                  <p>Create a server endpoint to handle sending messages</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">3.</span>
                <div>
                  <p className="font-medium text-gray-900">Schedule Automation</p>
                  <p>Use cron jobs or scheduled functions to send weekly reminders</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Sample Message:</strong><br />
                "Hello [Name]! 👋 You're scheduled for worship service on [Date] at [Location] as [Role]. See you there! 🎵"
              </p>
            </div>
          </div>
        </div>

        {/* Email Integration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="h-6 w-6 text-gray-900" />
            <h2 className="text-xl font-semibold text-gray-900">Email Integration</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Recommended Service:</h3>
              <p className="text-gray-800 text-sm">EmailJS, SendGrid, or Nodemailer with SMTP</p>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">1.</span>
                <div>
                  <p className="font-medium text-gray-900">Choose Email Service</p>
                  <p>Set up account with EmailJS (easiest) or SendGrid (more features)</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">2.</span>
                <div>
                  <p className="font-medium text-gray-900">Create Email Template</p>
                  <p>Design a professional email template for worship reminders</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="font-medium text-gray-900">3.</span>
                <div>
                  <p className="font-medium text-gray-900">Automate Sending</p>
                  <p>Schedule weekly email reminders for upcoming services</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Email includes:</strong><br />
                Service date, location, role assignment, contact information, and any special notes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center space-x-3 mb-6">
          <Phone className="h-6 w-6 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900">Implementation Guide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Setup External Services</h3>
            <p className="text-sm text-gray-600">
              Create accounts with Twilio (WhatsApp) and EmailJS/SendGrid (Email). 
              Configure API keys and endpoints.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Automation</h3>
            <p className="text-sm text-gray-600">
              Build server-side functions that check upcoming schedules and send 
              notifications every Monday for the coming week.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Test & Deploy</h3>
            <p className="text-sm text-gray-600">
              Test notifications with sample data, then deploy the automated 
              system to run weekly reminders.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-700">
            Frontend notification system is ready - external service integration required for full functionality
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationInfo;