import React, { useState } from 'react';
import axios from 'axios';

const PDFEditor = () => {
    const [form21Pdf, setForm21Pdf] = useState(null);
    const [form20Pdf, setForm20Pdf] = useState(null);
    const [signature, setSignature] = useState(null);
    const [financeCompany, setFinanceCompany] = useState('idfc');
    const [processedForm21, setProcessedForm21] = useState(null);
    const [processedForm20, setProcessedForm20] = useState(null);

    const handleForm21Change = (e) => {
        setForm21Pdf(e.target.files[0]);
    };

    const handleForm20Change = (e) => {
        setForm20Pdf(e.target.files[0]);
    };

    const handleSignatureChange = (e) => {
        setSignature(e.target.files[0]);
    };

    const handleFinanceCompanyChange = (e) => {
        setFinanceCompany(e.target.value);
    };

    const handleForm21Submit = async () => {
        if (!form21Pdf) return;

        const formData = new FormData();
        formData.append('pdf', form21Pdf);

        try {
            const response = await axios.post('http://127.0.0.1:8000/process_pdf/form21', formData, {
                responseType: 'blob',
            });
            setProcessedForm21(URL.createObjectURL(response.data));
        } catch (error) {
            console.error('Error processing form21:', error);
        }
    };

    const handleForm20Submit = async () => {
        if (!form20Pdf || !signature) return;

        const formData = new FormData();
        formData.append('pdf', form20Pdf);
        formData.append('signature', signature);
        formData.append('finance_company', financeCompany);

        try {
            const response = await axios.post('http://127.0.0.1:8000/process_pdf/form20', formData, {
                responseType: 'blob',
            });
            setProcessedForm20(URL.createObjectURL(response.data));
        } catch (error) {
            console.error('Error processing form20:', error);
        }
    };

    return (
        <div>
            <h2>Form 21</h2>
            <input type="file" accept="application/pdf" onChange={handleForm21Change} />
            <button onClick={handleForm21Submit}>Submit Form 21</button>
            {processedForm21 && (
                <a href={processedForm21} download="processed_form21.pdf">Download Processed Form 21</a>
            )}

            <h2>Form 20</h2>
            <input type="file" accept="application/pdf" onChange={handleForm20Change} />
            <input type="file" accept="image/png" onChange={handleSignatureChange} />
            <select value={financeCompany} onChange={handleFinanceCompanyChange}>
                <option value="idfc">IDFC</option>
                <option value="tvscredit">TVS Credit</option>
            </select>
            <button onClick={handleForm20Submit}>Submit Form 20</button>
            {processedForm20 && (
                <a href={processedForm20} download="processed_form20.pdf">Download Processed Form 20</a>
            )}
        </div>
    );
};

export default PDFEditor;
