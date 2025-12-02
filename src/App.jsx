import React, { useState } from "react";
import { BASE_API } from './api'
import { useNavigate } from "react-router";

function App(){
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

		console.log("finish date:" + finishDate);
		if (finishDate == null || finishDate == "") {
			alert("Select a Date");
			return;
		}

		const formData = new FormData();
		formData.append(
			"file",
			selectedFile,
			selectedFile.name
		);

		console.log(selectedFile);

		const queryParams = {
			endTime: finishDate
		};
		const params = new URLSearchParams(queryParams);
		const queryString = params.toString();

		const basePath = BASE_API + "/Home/FileToken";
		const url = queryString ? `${basePath}?${queryString}` : basePath;

		console.log("requested url from onFileUpload:" + url);

		try {
			const response = await fetch(url, {
				method: "POST",
				body: formData
			});


			const result = await response.json();
			if (response.status === 400) {
				alert(result.error);
				throw new Error();
			}

			const token = result.token;
			console.log(token);

			const urlQR = `${BASE_API}/Home/File?token=${token}\0`;
			navigate(`/QRCodePage?link=${urlQR}`);
		} catch (error) {
			console.log("error message:" + error.message);
		}

	};

	const fileData = () => {
		if (selectedFile) {
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {selectedFile.name}</p>
					<p>File Type: {selectedFile.type}</p>
					<p>
						Last Modified: {selectedFile.lastModifiedDate.toDateString()}
					</p>
				</div>
			);
		} else {
			return (
				<div>
					<br />
					<h4>Choose before Pressing the Upload button</h4>
				</div>
			);
		}
	};

	const handleFinishDate = (e) => {
		const localdate = e.target.value;
		const utcDate = new Date(localdate).toUTCString();
		console.log(utcDate);
		setFinishDate(utcDate);
	}

	return (
		<>
			<h1>Create QR Code for Your Files</h1>
			<div className="upload-from-device">
				<h3>File Upload from Your Device!</h3>
				<div>
					<input type="file" onChange={onFileChange} />
					<input type="datetime-local" id="end-file-time" name="endTime" onChange={handleFinishDate} />
					<button onClick={onFileUpload}>Upload!</button>
				</div>
				{fileData()}
			</div>

			<div className="upload-from-drive">
				<button onClick={() => navigate("/DriveFiles")}>
					File Upload from Your Drive
				</button>
			</div>
		</>
	);
};

export default App;