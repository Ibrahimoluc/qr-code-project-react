import QRCode from "react-qr-code";
import { useSearchParams } from "react-router";

function QRCodePage() {
    let [searchParams] = useSearchParams();

    return (
        <>
            <div className="qr-code-section">
                <h1>QR Code for your file</h1>
                {/*<p>End Time is {searchParams.get("q")}</p>*/}
                <QRCode value={searchParams.get("link")} size={256} />
            </div>
            
            
        </>
    )
}

export default QRCodePage;