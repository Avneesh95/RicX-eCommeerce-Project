import { useState } from "react";
import { Upload, FileSpreadsheet, Download, CheckCircle2, XCircle } from "lucide-react";
import { bulkUploadProducts, downloadSampleTemplate } from "../../api/productApi";

export default function BulkUploadPanel({ accentColor = "indigo" }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [downloading, setDownloading] = useState(false);

  const accent = {
    indigo: {
      ring: "border-indigo-300 dark:border-indigo-800",
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      icon: "bg-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700",
      gradient: "from-indigo-600 to-purple-600",
    },
    emerald: {
      ring: "border-emerald-300 dark:border-emerald-800",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      icon: "bg-emerald-600",
      button: "bg-emerald-600 hover:bg-emerald-700",
      gradient: "from-emerald-600 to-teal-600",
    },
  }[accentColor];

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    setFile(e.target.files[0]);
    setResult(null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await bulkUploadProducts(formData);
      setResult(data);
      setMessage(data.message);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleDownload = async () => {
    try {
      setDownloading(true);
      const response = await downloadSampleTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample-products.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download sample file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-gray-900 dark:text-white">
        Bulk Product Upload
      </h1>

      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Upload multiple products at once using an Excel (.xlsx) file
      </p>

      {/* Sample download, up top so it's the natural first step */}
      <div className="text-center mb-8">
        <button
          onClick={handleSampleDownload}
          disabled={downloading}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border ${accent.ring} ${accent.bg} text-gray-700 dark:text-gray-200 font-semibold hover:shadow-md transition disabled:opacity-50`}
        >
          <Download size={18} />
          {downloading ? "Preparing file..." : "Download Sample Excel"}
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Columns: name, description, price, category, stock, image (URL)
        </p>
      </div>

      {/* Upload Card */}
      <div className={`border-2 border-dashed ${accent.ring} rounded-2xl p-8 sm:p-10 text-center ${accent.bg}`}>
        <div className="flex justify-center mb-5">
          <div className={`w-20 h-20 rounded-full ${accent.icon} flex items-center justify-center`}>
            <FileSpreadsheet size={40} className="text-white" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Select Excel File
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Supported format: .xlsx</p>

        <input
          type="file"
          accept=".xlsx,.xls"
          id="excelFile"
          className="hidden"
          onChange={handleFileChange}
        />

        <label
          htmlFor="excelFile"
          className={`cursor-pointer inline-flex items-center gap-3 px-6 py-3 rounded-xl ${accent.button} text-white font-semibold transition`}
        >
          <Upload size={20} />
          Choose File
        </label>

        {file && (
          <div className="mt-6">
            <p className="text-green-600 dark:text-green-400 font-semibold">Selected File</p>
            <p className="text-lg font-bold mt-2 text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-8 w-full py-4 rounded-xl text-white font-bold text-lg transition ${
            loading
              ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
              : `bg-gradient-to-r ${accent.gradient} hover:scale-[1.02]`
          }`}
        >
          {loading ? "Uploading Products..." : "Upload Products"}
        </button>
      </div>

      {/* Summary */}
      {result && (
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-6 text-center border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Uploaded</h3>
            </div>
            <p className="text-5xl font-bold text-green-600 dark:text-green-400">
              {result.uploaded}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950 rounded-2xl p-6 text-center border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="text-red-600 dark:text-red-400" size={20} />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Skipped</h3>
            </div>
            <p className="text-5xl font-bold text-red-600 dark:text-red-400">
              {result.skipped}
            </p>
          </div>
        </div>
      )}

      {message && !result && (
        <p className="mt-6 text-center text-red-600 dark:text-red-400 font-medium">{message}</p>
      )}
    </div>
  );
}
