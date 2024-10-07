"use client"

import React, {useState} from 'react';
import { Button } from '@/components/ui/button';  
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import {v4 as uuidv4} from "uuid";
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {

  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const {user} = useUser();

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}, Depends on Job Position, Job Description & years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format, Give us question and answer field on JSON`;

    try {
        const result = await chatSession.sendMessage(InputPrompt);
        const rawResponse = result.response.text();
        console.log("Raw response:", rawResponse); // Log the raw response

        // Clean the raw response to isolate the JSON
        const MockJsonResp = rawResponse
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        // Extract only the JSON part
        const jsonStartIndex = MockJsonResp.indexOf('[');
        const jsonEndIndex = MockJsonResp.lastIndexOf(']') + 1;

        const cleanedJson = MockJsonResp.slice(jsonStartIndex, jsonEndIndex).trim();

        console.log("Cleaned MockJsonResp:", cleanedJson); // Log the cleaned response

        // Attempt to parse the JSON
        if (cleanedJson.startsWith('[') || cleanedJson.startsWith('{')) {
            try {
                const parsedResponse = JSON.parse(cleanedJson);
                console.log("Parsed Response:", parsedResponse);
                setJsonResponse(parsedResponse);

                if(parsedResponse){
                    // storing in Database
                    const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: parsedResponse,
                        jobPosition: jobPosition,
                        jobDesc: jobDesc,
                        jobExperience: jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-yyyy')
                    }).returning({mockId: MockInterview.mockId});

                    console.log("Inserted ID: ", resp)
                    if(resp){
                        setOpenDialog(false);
                        router.push("/dashboard/interview/" + resp[0]?.mockId)
                    }
                }
                else{
                    console.log("Error: ", error)
                }

                // Handle the parsed response as needed
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
            }
        } else {
            console.error("The response does not start with a valid JSON structure.");
        }
    } catch (error) {
        console.error("Failed to process the response:", error);
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
        <div className="p-10 border rounded-lg bg-secondary 
        hover:scale-105 cursor-pointer hover:shadow-md transition-all"
        onClick = {() => setOpenDialog(true)}>
            <h2 className="text-lg text-center">+ Add New</h2>
        </div>

        <Dialog open={openDialog}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle className="text-2xl">Tell us more about Job you are Interviewing</DialogTitle>
                <DialogDescription>
                    <form onSubmit={onSubmit}>
                        <div>
                            <h2>Add Details about your Job position/role, Job Description and Years of Experience</h2>
                                
                            <div className="mt-7 my-3">
                                <label>Job position / Role name</label>
                                <Input placeholder="Ex. Full Stack Developer" required
                                onChange={(e) => setJobPosition(e.target.value)}/>
                            </div>

                            <div className="mt-7 my-3">
                                <label>Job Description / Tech Stack (In Short)</label>
                                <Textarea placeholder="Ex. React, Angular, NodeJs, MySQL etc" required
                                onChange={(e) => setJobDesc(e.target.value)}/>
                            </div>

                            <div className="mt-7 my-3">
                                <label>Year of Experience</label>
                                <Input placeholder="Ex. 5" type="number" max="50" required
                                onChange={(e) => setJobExperience(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex gap-5 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {
                                    loading ?
                                        <div className="flex gap-2">
                                            <LoaderCircle className="animate-spin"/> Generating from AI
                                        </div> : 'Start Interview'
                                }
                                </Button>
                        </div>
                    </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddNewInterview