import { useEffect, useState } from 'react';
import appwrite from '../utils/appwrite-connection';
import config from '../utils/config';
import { Query } from "appwrite";
import { useRouter } from "next/router";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function Tracker () {
  const [notifications, setNotifications] = useState([]);
  const [parcelData, setParcelData] = useState();

  const getParcelEvents = async (parcelNo) => {
    try {
      const response = await appwrite.database.listDocuments(
        config.appwriteDatabaseID, 
        config.appwriteParcelEventsID, 
        [ Query.equal('ParcelId', parcelNo) ]
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

        {notifications.length > 0 && (
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="ml-2 text-lg font-medium">Status: {notifications[0].status}</p>
            </div>
            <div>
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="ml-2 text-lg font-medium">Updated Time: {notifications[0].time}</p>
            </div>
          </div>
        )}

        <VerticalTimeline layout="1-column">
          {notifications.map(event => (
            <VerticalTimelineElement
              key={event.id}
              contentStyle={{ background: 'transparent', color: '#000' }}
              contentArrowStyle={{ borderRight: '7px solid  #000' }}
              date={event.deliveryTime}
              iconStyle={{ background: '#2d3748', color: '#fff' }}
              icon={<Icon />} 
            >
              <h3 className="vertical-timeline-element-title text-lg font-medium">{event.status}</h3>
            </VerticalTimelineElement>
          ))}
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
