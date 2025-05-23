const Solution = () => {
  return (
    <div className="mx-20 h-auto w-auto flex flex-col border-2 rounded-xl bg-gray-400
                    bg-gradient-to-b from-white via-gray-300 to-gray-400 pb-12">

      <h1 className="text-6xl font-bold mt-12 ml-16">Solution</h1>

      <div className="flex flex-col gap-6 bg-white w-auto h-auto font-sans rounded-xl border-2 m-10 p-8">

        <h2 className="text-3xl font-semibold mb-4">
          Inventory Management System with QR Scanning & Multi-Device Tracking
        </h2>

        <section>
          <h3 className="text-2xl font-semibold mb-2">Solution Overview</h3>
          <p className="text-lg">
            This system streamlines inventory control by integrating QR code scanning technology with real-time, multi-device synchronization. It enables users to quickly access detailed product descriptions by scanning QR codes, ensuring accurate product identification and reducing human error.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>
              <strong>QR Code Scanning:</strong> Each product has a unique QR code. Using any device with a camera, users can scan the code to instantly retrieve and display detailed product information such as name, description, stock levels, and location.
            </li>
            <li>
              <strong>Real-Time Updates:</strong> Changes made on one device (such as stock adjustments, new product entries, or product removals) are propagated instantly to all connected devices, ensuring everyone works with the latest data.
            </li>
            <li>
              <strong>Remote Access:</strong> Team members can monitor and manage inventory remotely, enabling seamless coordination even when physically apart.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-2">Technical Approach</h3>
          <p className="text-lg">
            The frontend uses modern web technologies for a responsive interface, incorporating QR scanning via browser APIs or native mobile capabilities. A centralized backend database stores product and inventory data, accessible through APIs. Real-time synchronization is maintained using WebSockets or push notifications to ensure all devices have consistent, up-to-date information.
          </p>
        </section>

      </div>
    </div>
  )
}

export default Solution;
