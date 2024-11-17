import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const GoogleDrive = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const signIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const listFiles = () => {
    gapi.client.drive.files
      .list({
        pageSize: 10,
        fields: "files(id, name, webViewLink)",
      })
      .then((response) => {
        setFileList(response.result.files);
      });
  };

  return (
    <div style={{ width: '100%', height: 'auto' }}>
      <iframe
        src="https://drive.google.com/uc?id=YOUR_FILE_ID"
        width="100%"
        height="500"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Google Drive Video"
      ></iframe>
    </div>
  );
};

export default GoogleDrive;
