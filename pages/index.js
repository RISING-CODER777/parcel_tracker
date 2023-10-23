import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/router';
import appwrite from "../utils/appwrite-connection";
import config from "../utils/config";

export default function Home() {
 const [isLoading, setLoading] = useState(false);
 const [parcelID, setParcelID] = useState(undefined);
 const [parcel, setParcel] = useState({});
 const router = useRouter();

 const getParcelDetails = async (trackingNo) => {
   try {
     setLoading(true);
     const response = await appwrite.database.getDocument(
       config.appwriteDatabaseID,
       config.appwriteParcelsID,
       trackingNo
     );
     
    const resolvedResponse = { 
      ...(response || {}), 
      name: response["parcel-name"] 
    };

     setParcel(() => resolvedResponse);
     router.push({
       pathname: './tracker',
       query: resolvedResponse
     })
   } catch (err) {
     console.error(err);
     alert(err.message)
   } finally {
     setLoading(false)
   }
 }

 return (
   <div className={styles.container}>
     <Head>
       <title> Parcel Tracker </title>
       <meta name="description" content="Parcel Tracking App" />
       <link rel="icon" href="/favicon.ico" />
     </Head>

     <div className={styles.floatingStrip}>
       Dear customer, your tracking status will get updated within 1 hour from the order placed.
     </div>

     <main className={styles.main}>
       <h1 className="md:text-[2rem] text-[1.8rem] mb-2 text-center font-bold">
         🛳️  Parcel Tracking
       </h1>
       {!isLoading ? (
         <div className="flex flex-row w-full lg:w-1/2">
           <input
             type="text"
             className="w-full px-4 h-14"
             onChange={(e) => setParcelID(() => e.target.value)}
             placeholder="Enter your parcel's tracking number"
           />
           <a
             onClick={() => getParcelDetails(parcelID)}
             className="w-[12rem] px-4 flex items-center justify-center bg-blue-500 text-white rounded-md cursor-pointer"
             style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)' }}
           >
             Track Parcel
           </a>
         </div>
       ) : (
         <div>
           isLoading....
         </div>
       )}
     </main>

     <footer className="bg-gray-100 py-5 text-center">
  <div className="container-fluid px-4">
    <div className="mb-4">
      <div className="font-bold text-xl mb-2">
        Powered and maintained by PharmEasy
      </div>
      <p className="text-gray-700 text-sm">
        For inquiries, please contact us at {" "}
        <a href="mailto:contact@pharmeasy.com" className="text-blue-500 underline">
          contact@pharmeasy.com
        </a>
      </p>
    </div>
    <hr className="my-4 w-32 mx-auto border-t border-gray-300" />
    <div className="text-gray-700 text-sm">
      &copy; 2023 PharmEasy. All Rights Reserved.
    </div>
  </div>
</footer>


   </div>
 );
}
