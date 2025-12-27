// React kodunuz
//export const BASE_API = "https://localhost:7251";
export const BASE_API = import.meta.env.VITE_API_URL;
console.log(BASE_API);

export async function getData(path, queryParams = {}) {
    console.log("working getData for path:", path, "with params:", queryParams);

    // 1. URLSearchParams API'sini kullanarak parametre nesnesini bir query string'e dönüþtür.
    // Bu yöntem, karakterleri (örn: boþluk) otomatik olarak doðru þekilde kodlar (URL encoding).
    const params = new URLSearchParams(queryParams);
    const queryString = params.toString();

    // 2. Temel URL'i ve query string'i birleþtir.
    const basePath = BASE_API + path;
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    console.log("Requesting URL:", url);

    try {
        const response = await fetch(url, {
            credentials: 'include'
            ,headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (response.status === 401) {
            console.log("Kullanýcý giriþ yapmamýþ. Giriþ sayfasýna yönlendiriliyor...");

            // Giriþ URL'ini oluþtururken de ayný mantýðý kullanýyoruz.
            // Mevcut URL'e sadece 'returnUrl' ekliyoruz.
            const loginUrlBuilder = new URL(url); // URL nesnesi oluþtur
            loginUrlBuilder.searchParams.append('returnUrl', window.location); // Yeni parametre ekle
            const loginUrl = loginUrlBuilder.href; // Tam URL'i al

            console.log("Redirecting to login URL:", loginUrl);
            window.location.href = loginUrl;
            return;
        }

        const result = await response.json();

        if (response.status === 400) {
            console.log("api getData 400");
            alert(result.error);
            throw new Error(result.error);
        }

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error(error.message);
    }
}

export async function createQrLinkForDriveFile(fileId, endTime) {
    console.log("endTime:" + endTime);
    const path = `/Home/FileToken/${fileId}`;
    console.log("Requested path:" + path);
    console.log(endTime);

    const params = {
        endTime: endTime
    };

    const result = await getData(path, params);
    const token = result.token;
    if (token === undefined) {
        throw new Error("Qr code oluþturulamadý");
    }
    console.log("token:" + token);

    const urlQR = `${BASE_API}/Home/File?token=${token}\0`;

    return urlQR;
}

