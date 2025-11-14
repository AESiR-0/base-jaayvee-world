export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Refund Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
              <p className="text-gray-300 mb-4">
                We understand that plans can change. Our refund policy is designed to be fair while 
                protecting the interests of event organizers and other participants. Refunds are 
                available under the following conditions:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Event cancellation by the organizer</li>
                <li>Event postponement (with option to attend rescheduled event or receive refund)</li>
                <li>Technical issues preventing event access</li>
                <li>Request made within the specified timeframes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Refund Timeframes</h2>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Standard Events</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><strong>More than 7 days before event:</strong> Full refund</li>
                  <li><strong>3-7 days before event:</strong> 75% refund</li>
                  <li><strong>1-3 days before event:</strong> 50% refund</li>
                  <li><strong>Less than 24 hours:</strong> No refund</li>
                </ul>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Premium Events</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><strong>More than 14 days before event:</strong> Full refund</li>
                  <li><strong>7-14 days before event:</strong> 80% refund</li>
                  <li><strong>3-7 days before event:</strong> 50% refund</li>
                  <li><strong>Less than 3 days:</strong> No refund</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Non-Refundable Items</h2>
              <p className="text-gray-300 mb-4">
                The following items are generally non-refundable:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Processing fees and taxes</li>
                <li>Digital downloads or virtual content</li>
                <li>Membership fees (subject to specific terms)</li>
                <li>Third-party service charges</li>
                <li>No-show situations without prior notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. How to Request a Refund</h2>
              <p className="text-gray-300 mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                <li>Contact us at talaash@thejaayveeworld.com with your booking details</li>
                <li>Include your order number and reason for refund</li>
                <li>Provide any supporting documentation if applicable</li>
                <li>We will review your request within 2-3 business days</li>
                <li>If approved, refunds will be processed within 5-10 business days</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Processing</h2>
              <p className="text-gray-300 mb-4">
                Approved refunds will be processed using the same payment method used for the original 
                purchase. Processing times vary by payment provider:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>UPI:</strong> 1-3 business days</li>
                <li><strong>Net Banking:</strong> 3-7 business days</li>
                <li><strong>Digital Wallets:</strong> 1-5 business days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Event Cancellation by Organizer</h2>
              <p className="text-gray-300 mb-4">
                If an event is cancelled by the organizer:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Full refunds will be automatically processed</li>
                <li>You will be notified via email and SMS</li>
                <li>Alternative events may be offered as options</li>
                <li>No action required from your side</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Force Majeure</h2>
              <p className="text-gray-300 mb-4">
                In cases of force majeure (natural disasters, government restrictions, etc.), 
                we will work with organizers to provide the best possible solution, which may include:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Event postponement with automatic ticket transfer</li>
                <li>Virtual event alternatives</li>
                <li>Partial or full refunds based on circumstances</li>
                <li>Credit for future events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-300 mb-4">
                If you disagree with a refund decision:
              </p>
              <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
                <li>Contact our customer support team</li>
                <li>Provide detailed explanation of your concern</li>
                <li>Include any relevant documentation</li>
                <li>We will review and respond within 5 business days</li>
                <li>Final decisions will be communicated in writing</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                For refund-related inquiries, please contact us at:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Email:</strong> talaash@thejaayveeworld.com<br/>
                  <strong>Phone:</strong> +91 9879143185<br/>
                  <strong>Address:</strong> 1310 Phoenix Tower, Near Commerce Six Road Metro Station,<br/>
                  Vijay Cross Road, Ahmedabad, Gujarat - 380014<br/>
                  <strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Policy Updates</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to update this refund policy at any time. Changes will be 
                posted on this page with an updated revision date. Continued use of our services 
                after any changes constitutes acceptance of the new policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
