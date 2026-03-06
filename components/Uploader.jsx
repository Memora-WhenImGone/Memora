"use client";
export default function Uploader({itemId, onDone}) {
    async function onChange(e) {
        const f = e.target.files[0]; 
        if(!f) return;

        const fd = new FormData();
        fd.append("file", f);

        const r = await fetch ("/api/files/upload", {
            method: "POST",
            body: fd
        });

        

        if (res.ok){
            Alert('File Uploaded');
        }
    }

    return (
        <label className="px-4 py-2 border rounded-b-lg cursor-pointer
         hover:bg-gray-50 transition-colors ">
            Upload File
            <input type="file" className="hidden" onChange={onChange} />
         </label>
    );
}