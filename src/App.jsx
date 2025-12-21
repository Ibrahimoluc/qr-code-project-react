import React, { useState } from "react";
import { BASE_API } from './api'
import { useNavigate } from "react-router";
import './App.css'; // CSS dosyasýný import etmeyi unutma

function App() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [finishDate, setFinishDate] = useState("");
	const navigate = useNavigate();

	const onFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const onFileUpload = async () => {
		if (selectedFile == null) {
			alert("Select a file");
			return;
		}

		if (finishDate == null || finishDate === "") {
			alert("Select a Date");
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile, selectedFile.name);

		// Backend query string ile endTime alýyor varsayýyoruz
		const queryParams = { endTime: finishDate };
		const params = new URLSearchParams(queryParams);
		const queryString = params.toString();

		const basePath = BASE_API + "/Home/FileToken";
		const url = queryString ? `${basePath}?${queryString}` : basePath;

		try {
			const response = await fetch(url, {
				method: "POST",
				body: formData
			});

			const result = await response.json();
			if (response.status === 400) {
				alert(result.error);
				throw new Error(result.error);
			}

			if (response.status === 500) {
				alert(result.error);
				throw new Error(result.error);
			}

			const token = result.token;
			// Not: \0 karakterini string sonuna eklemek genelde gerekmez, 
			// backend trim yapýyorsa sorun yok ama dikkat et.
			const urlQR = `${BASE_API}/Home/File?token=${token}`;
			navigate(`/QRCodePage?link=${urlQR}`);
		} catch (error) {
			console.log("error message:" + error.message);
		}
	};

	const fileData = () => {
		if (selectedFile) {
			return (
				<div className="file-details">
					<h3>File Details:</h3>
					<p><strong>Name:</strong> {selectedFile.name}</p>
					<p><strong>Type:</strong> {selectedFile.type}</p>
					<p><strong>Last Modified:</strong> {selectedFile.lastModifiedDate.toDateString()}</p>
				</div>
			);
		} else {
			return (
				<div style={{ textAlign: 'center', marginTop: '10px', color: '#888' }}>
					<p>Choose a file before uploading</p>
				</div>
			);
		}
	};

	const handleFinishDate = (e) => {
		const localdate = e.target.value;
		// Eðer tarih seçimi iptal edilirse hata vermesin
		if (localdate) {
			const utcDate = new Date(localdate).toUTCString();
			setFinishDate(utcDate);
		} else {
			setFinishDate("");
		}
	}

	return (
		<div className="container">
			<h1>Create QR Code for Your Files</h1>

			<div className="upload-from-device">
				<h3>Upload from Your Device</h3>

				<label>1. Select File:</label>
				<input type="file" onChange={onFileChange} />

				<label>2. Select Expiration Date:</label>
				<input type="datetime-local" id="end-file-time" name="endTime" onChange={handleFinishDate} />

				<button onClick={onFileUpload} style={{ width: '100%' }}>Upload & Create QR</button>

				{fileData()}
			</div>

			<div className="upload-from-drive">
				<h3>Or Use Google Drive</h3>
				<button onClick={() => navigate("/DriveFiles")} style={{ width: '100%', backgroundColor: '#28a745' }}>
					Select from Google Drive
				</button>
			</div>
		</div>
	);
};

export default App;