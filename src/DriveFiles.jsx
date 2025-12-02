import { useState, useEffect,  } from 'react'
import { getData, BASE_API, createQrLinkForDriveFile } from './api'
import { useNavigate } from "react-router";

function DriveFiles() {
    const [fileList, setFileList] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [loadingQr, setLoadingQr] = useState(false);
    const [finishDate, setFinishDate] = useState("");
    const [fileId, setFileId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        handleListFiles(0);
    }, []);


    const handleListFiles = async (pageDirection) => {
        setLoadingFiles(true);
        const path = "/Home/driveFiles";
        const params = {
            PageDirection: pageDirection
        };

        try {
            const data = await getData(path, params);
            setFileList(data);
        } catch (error) {
            alert("An error occured:");
            console.log("Error:" + error);
        }

        setLoadingFiles(false);
    };


    const createQr = async (fileId, endTime) => {
        if (endTime == null || endTime == "") {
            alert("Select a date");
            return;
        }

        setLoadingQr(true);

        try {
            const link = await createQrLinkForDriveFile(fileId, endTime);
            console.log("qr link:" + link);
            navigate(`/QRCodePage?link=${link}`);
        } catch (error) {
            console.log("error:" + error);
            setLoadingQr(false);
        }

    }


    return (
        <>
            <div className="listFile-interaction-components">

                <button onClick={() => handleListFiles(0)}>List Your Drive Files</button>
                {fileList.length > 0 ? (
                    <div className="NextPrev-buttons">
                        <button onClick={() => handleListFiles(-1)}>Prev</button>
                        <button onClick={() => handleListFiles(1)}>Next</button>
                    </div>)
                    :
                    (<div></div>)
                }

                <input type="datetime-local" id="end-file-time" name="endTime" onChange={(e) => setFinishDate(e.target.value)} />

                <button onClick={() => createQr(fileId, finishDate)}>
                    Create QR Code
                </button>
                {loadingQr ? (<p>Qr code is created...</p>) : (<p></p>)}

            </div>

            <div className="listFile-area">
                {loadingFiles ? (<p>Files are loaded...</p>) : (<p></p>)}
                <ul>
                    {fileList.map(file =>
                        <li key={file.id}>
                            <input type="radio" id={file.id} name="fileId" value={file.id} onChange={(e) => setFileId(e.target.value)} />
                            <a
                                href={`${BASE_API}/Home/driveFile-Preview/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {file.name}
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default DriveFiles;
