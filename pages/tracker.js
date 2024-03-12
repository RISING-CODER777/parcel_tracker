import { useEffect, useState } from 'react';
import appwrite from '../utils/appwrite-connection';
import config from '../utils/config';
import { Query } from "appwrite";
import { useRouter } from "next/router";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function Tracker() {
  const [notifications, setNotifications] = useState([]);
  const [parcelData, setParcelData] = useState();

  const getParcelEvents = async (parcelNo) => {
    try {
      const response = await appwrite.database.listDocuments(
        config.appwriteDatabaseID,
        config.appwriteParcelEventsID,
        [Query.equal('ParcelId', parcelNo)]
      );

      const data = response.documents.map((document) => {
        return {
          id: document.$id,
          status: document.status,
          time: document.time,
          orderRequestTime: document.time,
          deliveryTime: document.delivery_time
        }
      });

      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  }

  const router = useRouter();

  useEffect(() => {
    setParcelData(() => router.query);
    getParcelEvents(router.query.$id);
    registerSubscriber();
  }, [parcelData]);

  const registerSubscriber = () => {
    try {
      appwrite.client.subscribe('documents', (response) => {
        if (parcelData?.$id) getParcelEvents(parcelData?.$id);
      });
    } catch (error) {
      console.log(error, 'error');
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Parcel Information</h1>
        <p className="text-lg font-medium mb-4">Parcel Name: {parcelData?.name}</p>
        <p className="text-lg font-medium mb-4">Parcel No: {parcelData?.$id}</p>

        <VerticalTimeline layout="1-column">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'transparent', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #000' }}
            date="Tue, 8th Aug 24"
            iconStyle={{ background: '#2d3748', color: '#fff' }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-medium">Order Confirmed</h3>
            <p>Your order has been confirmed. Expect delivery soon.</p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'transparent', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #000' }}
            date="Wed, 9th Aug 24"
            iconStyle={{ background: '#2d3748', color: '#fff' }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-medium">Item Picked Up</h3>
            <p>Your item has been picked up by the courier partner.</p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'transparent', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #000' }}
            date="Thu, 10th Aug 24"
            iconStyle={{ background: '#2d3748', color: '#fff' }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-medium">Shipped by Pharm Logistics</h3>
            <p>Your item has been shipped by Pharm Logistics.</p>
          </VerticalTimelineElement>

          <hr /> {/* Add a horizontal line here */}

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'transparent', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #000' }}
            date="Fri, 11th Aug 24"
            iconStyle={{ background: '#2d3748', color: '#fff' }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-medium">Item Received at Hub</h3>
            <p>Your item has been received at the hub.</p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'transparent', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid  #000' }}
            date="Sat, 12th Aug 24"
            iconStyle={{ background: '#2d3748', color: '#fff' }}
            icon={<Icon />}
          >
            <h3 className="vertical-timeline-element-title text-lg font-medium">Delivered</h3>
            <p>Your item has been delivered.</p>
          </VerticalTimelineElement>
        </VerticalTimeline>

        <div className="mt-8">
          <a href="./" className="block px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-700 text-center">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12" y2="16" />
  </svg>
);
