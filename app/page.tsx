"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "./context/auth-provider";
import { Configuration, OpenAIApi } from "openai";
import { useTheme } from "./context/theme-provider";
import axios from "axios";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const PickerAPI: React.FC = () => {
  const { user, accessToken, setTokenClient, handleSignIn, handleSignOut, handleSignInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dark } = useTheme();
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);


  const [isPastMeetingTime, setIsPastMeetingTime] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      // Adjust this to your timezone
      const peruvianTimeOffset = -5;
      const now = new Date();
      const nowOffset = now.getTimezoneOffset() / 60;
      const peruvianTimeNow = new Date(now.setHours(now.getHours() + nowOffset + peruvianTimeOffset));

      const meetingTime = new Date(2023, 7, 1, 11, 20); // Date format is year, month (0-indexed), day, hour, minute

      setIsPastMeetingTime(peruvianTimeNow >= meetingTime);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.onload = () => {
      window.gapi.load("client:picker", initializePicker);
    };
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.onload = () => {
      setTokenClient(
        window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.CLIENT_ID,
          scope: process.env.SCOPES,
          callback: "",
        })
      );
    };
    document.body.appendChild(script2);
  }, []);

  const initializePicker = async () => {
    await window.gapi.client.load(
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    );
    setPickerVisible(true);
  };

  const createPicker = () => {
    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(process.env.API_KEY)
      .setAppId(process.env.APP_ID)
      .setOAuthToken(accessToken)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const document = data[window.google.picker.Response.DOCUMENTS][0];
      const fileId = document[window.google.picker.Document.ID];
      setFileId(fileId);
      const res = await window.gapi.client.drive.files.get({
        fileId: fileId,
        fields: "*",
      });
      const file = res.result;
      const fileRes = await axios.get(file.webContentLink, {
        headers: { Authorization: "Bearer " + accessToken },
        responseType: "text",
      });
      setFileContent(fileRes.data);
    }
  };

  const handleSummarizeText = async () => {
    setIsLoading(true);
    setSummary(null); // Hide the previous summary

    setTimeout(async () => {
      if (clickCount < 3) {
        setClickCount(prevCount => prevCount + 1);
        setSummary("Sorry! The meeting transcript isn't available yet, so we're unable to provide a summary at this moment. Please check back once the transcript has been uploaded. Thanks for your patience!");
      } else {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful personal assistant that summarizes text",
            },
            {
              role: "user",
              content: `Good morning, everyone! Today, I'm really happy to share our report on the first half of the year. I'm excited to tell you that our company has done exceptionally well and earned more money than we expected. Compared to last year, our revenue has gone up by 25%. This success is because of our amazing team, smart strategies, and strong dedication to doing our best. However, we must remain vigilant and adapt to the ever-changing market landscape. The next half of the year presents new challenges, and we need to stay agile and innovative to maintain our growth trajectory. We've got the right people on board, and I have no doubt that together, we'll overcome any obstacles that come our way. We're looking forward to an even better second half of the year, and I'm sure we'll keep doing great in the changing market. Thank you all for your hard work and support. Together, let's keep pushing our business to do even better!`,
            },
          ],
        });
        const meeting = response.data.choices[0].message?.content;
        setSummary(meeting);
      }
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold mb-3 text-center">Welcome, {user.displayName}!</p>
          {fileId && <p className="text-sm mb-4 text-center">File ID: {fileId}</p>}
          <div className="mb-3">
            {isPastMeetingTime
              ? 'No meetings scheduled yet'
              : 'Next meeting: Tuesday, 1 August @ 11:15 – 11:20am'
            }
          </div>
          <div className="flex flex-row items-center justify-center space-x-1">
            <button
              className="bg-gray-800 hover:bg-black text-white py-2 px-10 rounded mb-4"
              onClick={() => window.open("https://meet.google.com/epy-bifg-fvj")}
            >
              Join
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded mb-4"
              onClick={handleSummarizeText}
            >
              {isLoading ? <p>Loading...</p> : <p>Summarize</p>}
            </button>
          </div>
          {isLoading ? null : summary && <p className="px-20 text-gray-600 text-center">{summary}</p>}
        </div>


      ) : (
        <>
          <p className="text-4xl font-bold">Sign in to try the demo!</p>
        </>
      )}
    </div>
  );

};

export default PickerAPI;
