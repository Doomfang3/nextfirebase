import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./Loader";

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async event => {
    const file = Array.from(event.target.files)[0];
    const extension = file.type.split("/")[1];

    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    const task = ref.put(file);

    task.on(STATE_CHANGED, snapshot => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise, so no async/await !)
      task
        .then(d => ref.getDownloadURL())
        .then(url => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className='box'>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <>
          <label className='btn'>
            Upload Img
            <input type='file' onChange={uploadFile} accept='image/x-png,image/gif,image/jpeg' />
          </label>
        </>
      )}
      {downloadURL && <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>}
    </div>
  );
};

export default ImageUploader;
