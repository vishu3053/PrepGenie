"use client"
import { MockInterview } from "@/utils/schema";
import React, {useEffect, useState} from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// params-> contains the Interview ID
const Interview = ({params}) => {

    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    const webcamRef = React.useRef(null); // Create a ref for the Webcam

    useEffect(()=>{
        // console.log(params.interviewId);
        getInterviewDetails();
    })

    /*
        Used to get Interview Details by MockId / Interview Id
    */
    const getInterviewDetails = async() => {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        
        // console.log(result);
        setInterviewData(result[0]);
    }

    const getWebcamStream = () => {
        const video = webcamRef.current?.video;
        if (video) {
            console.log('Webcam stream:', video.srcObject);
        }
    };

    useEffect(() => {
        if (webCamEnabled) {
            getWebcamStream();
        }
    }, [webCamEnabled]);    

    return(
        <div className="my-10 flex flex-col items-center justify-center">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            
            <div>
                {
                    webCamEnabled ? (
                    <Webcam 
                        ref={webcamRef}
                        onUserMediaError={(error) => {
                            console.error("Error accessing webcam:", error);
                        }}
                        style={{
                            height: 300, 
                            width: 300
                        }}
                    />
                ) :(
                    <>
                        <WebcamIcon className="h-72 w-full my-7 bg-secondary rounded-lg border p-20"/>
                        <Button onClick={() => setWebCamEnabled(true)}>
                            Enable Webcam and Microphone
                        </Button>
                    </>
                )
                }
            </div>
        </div>
    )
};

export default Interview;