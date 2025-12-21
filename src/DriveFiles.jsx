import { useState, useEffect } from 'react'
import { getData, BASE_API, createQrLinkForDriveFile } from './api'
import { useNavigate } from "react-router";
// CSS App.js üzerinden yüklendiyse buraya tekrar import etmeye gerek yok, 
// ama modüler css kullanmýyorsan global çalýþýr.

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
        const params = { PageDirection: pageDirection };

        try {
            const data = await getData(path, params);
            // Hata durumunda undefined gelmesini kontrol et
            if (data) {
                setFileList(data);
            }
        } catch (error) {
            alert("An error occured");
            console.log("Error:" + error);
        }
        setLoadingFiles(false);
    };

    // App.js ile ayný tarih mantýðýný buraya da ekledik
    const handleFinishDate = (e) => {
        const localdate = e.target.value;
        if (localdate) {
            const utcDate = new Date(localdate).toUTCString();
            setFinishDate(utcDate);
        } else {
            setFinishDate("");
        }
    }

    const createQr = async () => {
        if (!fileId) {
            alert("Please select a file from the list below.");
            return;
        }
        if (finishDate == null || finishDate === "") {
            alert("Select a date");
            return;
        }

        setLoadingQr(true);
        try {
            const link = await createQrLinkForDriveFile(fileId, finishDate);
            console.log("qr link:" + link);
            navigate(`/QRCodePage?link=${link}`);
        } catch (error) {
            console.log("error:" + error);
        }
        setLoadingQr(false);
    }

    return (
        <div className="container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        backgroundColor: '#28a745', // Yeþil renk
                        width: 'auto',              // Global geniþliði ezmek için
                        padding: '8px 16px',
                        marginRight: '20px',        // Baþlýk ile mesafe
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <span>&#8592;</span> Back {/* Sol ok iþareti ve yazý */}
                </button>

                <h1 style={{ margin: 0 }}>Select from Google Drive</h1>
            </div>

            <div className="listFile-interaction-components">
                <button onClick={() => navigate(-1)}>Back</button>
                <button onClick={() => handleListFiles(0)}>Refresh File List</button>

                {fileList.length > 0 && (
                    <div className="NextPrev-buttons">
                        <button onClick={() => handleListFiles(-1)}>Previous Page</button>
                        <button onClick={() => handleListFiles(1)}>Next Page</button>
                    </div>
                )}

                <label style={{ fontWeight: 'bold' }}>Select Expiration Date:</label>
                <input type="datetime-local" onChange={handleFinishDate} />

                <button
                    onClick={createQr}
                    style={{ backgroundColor: '#6610f2', width: '100%' }}
                    disabled={loadingQr}
                >
                    {loadingQr ? "Creating..." : "Create QR Code"}
                </button>
            </div>

            <div className="listFile-area">
                <h3>Your Files</h3>
                {loadingFiles && <p className="loading">Files are loading...</p>}

                {!loadingFiles && fileList.length === 0 && <p>No files found.</p>}

                <ul>
                    {fileList.map(file => (
                        <li key={file.id}>
                            <input
                                type="radio"
                                id={file.id}
                                name="fileId"
                                value={file.id}
                                onChange={(e) => setFileId(e.target.value)}
                            />
                            {/* Label kullanarak isme týklayýnca da radio seçilsin istersek htmlFor kullanabiliriz, 
                                ama senin link yapýnda önizleme açýlýyor, bu yüzden böyle kalsýn */}
                            <a
                                href={`${BASE_API}/Home/driveFile-Preview/${file.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {file.name} (Preview)
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Geri Dön Butonu */}
            <button onClick={() => navigate("/")} style={{ backgroundColor: '#6c757d', marginTop: '20px' }}>
                Back to Home
            </button>
        </div>
    )
}

export default DriveFiles;